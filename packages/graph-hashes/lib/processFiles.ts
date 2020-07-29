import buildSccTransitiveClosure from "../../dependency-graph/lib/buildSccTransitiveClosure";
import computeTransitiveHashes from "./computeTransitiveHashes";
import configureGetDependencies from "../../dependencies/lib/getDependencies";
import configureProcessFile, { ProcessedFileInfo } from "./processFile";
import getStronglyConnectedComponents from "../../dependency-graph/lib/getStronglyConnectedComponents";
import {
  DependencyGetter,
  Options,
  FileOrGroup,
} from "../../dependencies/lib/types";
import { CacheLoader, CacheOptions } from "../../cache/lib/types";

export type ProcessFilesOptions = Options & CacheOptions;

export default async function processFiles(
  files: Record<string, FileOrGroup>,
  hashAlgorithm: string,
  getCacheFile: CacheLoader,
  options: ProcessFilesOptions
) {
  const getDependencies = configureGetDependencies(files, options);
  const fileGraph = await computeFileInfo(
    files,
    hashAlgorithm,
    getDependencies,
    getCacheFile,
    options
  );
  const withStronglyConnectedComponents = getStronglyConnectedComponents(
    fileGraph
  );
  const sccTransitiveClosure = buildSccTransitiveClosure(
    withStronglyConnectedComponents
  );
  const transitiveHashes = computeTransitiveHashes(
    sccTransitiveClosure,
    hashAlgorithm,
    getCacheFile
  );
  return transitiveHashes;
}

export async function computeFileInfo(
  files: Record<string, FileOrGroup>,
  hashAlgorithm: string,
  getDependencies: DependencyGetter,
  getCacheFile: CacheLoader,
  options: CacheOptions
) {
  const processFile = configureProcessFile(
    hashAlgorithm,
    getDependencies,
    getCacheFile
  );
  const fileHashPromises: {
    [path: string]: Promise<ProcessedFileInfo>;
  } = {};
  for (let path in files) {
    fileHashPromises[path] = processFile(files[path]);
  }

  let fileHashes: { [path: string]: ProcessedFileInfo } = {};

  for (let path in fileHashPromises) {
    const fileHash = await fileHashPromises[path];
    if (fileHash.hash.length > 0) {
      fileHashes[path] = fileHash;
    }
  }

  return fileHashes;
}
