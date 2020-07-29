import makeHash from "./utilities/makeHash";
import * as fs from "./wrappers/fs";
import {
  DependencyGetter,
  MaybeDependencies,
  FileOrGroup,
  FileGroup,
} from "../../dependencies/lib/types";
import { CacheLoader } from "../../cache/lib/types";
import { performance } from "perf_hooks";
import { buildDependenciesBagWarningsOnly } from "../../dependencies/lib/utilities/buildDependenciesBag";

export type ProcessedFileInfo = MaybeDependencies & { hash: string };

const nullEndBenchmark = () => {};
function benchmark(fnName: string, fileName: string) {
  if (process.env.NODE_ENV !== "debug") {
    return nullEndBenchmark;
  }
  performance.mark(`${fnName}{${fileName}}:start`);
  return function end() {
    performance.mark(`${fnName}{${fileName}}:end`);
    performance.measure(
      `${fnName}{${fileName}}`,
      `${fnName}{${fileName}}:start`,
      `${fnName}{${fileName}}:end`
    );
  };
}

export default function configure(
  hashAlgorithm: string,
  getDependencies: DependencyGetter,
  getCacheFile: CacheLoader
) {
  async function processFile(filePath: string) {
    const endBenchmark = benchmark("processFile", filePath);
    let data = fs.readFileSync(filePath, { encoding: "utf8" });
    const hash = makeHash(hashAlgorithm, [filePath, data]);
    const dependencyInfo = getDependencies(filePath, data);
    let metadata = getCacheFile(filePath).metadata.get();

    let processedFileInfo = {
      ...dependencyInfo,
      hash,
    };

    // small optimization: we don't do metadata.commit()
    // here, since we haven't yet stamped the transitiveHash
    // after the next step
    Object.assign(metadata, processedFileInfo);

    endBenchmark();
    return processedFileInfo;
  }
  async function processFileGroup(
    fileGroup: FileGroup & {
      processedFileInfoPromise?: Promise<ProcessedFileInfo>;
    }
  ): Promise<ProcessedFileInfo> {
    if (fileGroup.processedFileInfoPromise) {
      return await fileGroup.processedFileInfoPromise;
    }
    if (
      fileGroup.filePaths.filter((e) => e.endsWith("package.json")).length == 0
    ) {
      return {
        ...buildDependenciesBagWarningsOnly(fileGroup.basePath, []),
        hash: "",
      };
    }

    const endBenchmark = benchmark("processFileGroup", fileGroup.basePath);
    let resolve: (info: ProcessedFileInfo) => void = undefined as any;
    fileGroup.processedFileInfoPromise = new Promise((_resolve) => {
      resolve = _resolve;
    });

    const hashes: string[] = [];
    for (const filePath of fileGroup.filePaths.sort()) {
      const data = fs.readFileSync(filePath, { encoding: "utf8" });
      hashes.push(makeHash(hashAlgorithm, [filePath, data]));
    }
    const packageHash = makeHash(hashAlgorithm, hashes);
    const dependencyInfo = getDependencies(fileGroup);
    let metadata = getCacheFile(
      `${fileGroup.basePath}/package.json`
    ).metadata.get();
    const processedFileInfo = {
      ...dependencyInfo,
      hash: packageHash,
    };

    // small optimization: we don't do metadata.commit()
    // here, since we haven't yet stamped the transitiveHash
    // after the next step
    Object.assign(metadata, processedFileInfo);

    endBenchmark();
    resolve(processedFileInfo);
    return processedFileInfo;
  }

  return async function processFileOrGroup(fileOrGroup: FileOrGroup) {
    if (typeof fileOrGroup === "object") {
      return await processFileGroup(fileOrGroup);
    } else {
      return await processFile(fileOrGroup);
    }
  };
}
