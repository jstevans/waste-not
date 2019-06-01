import buildSccTransitiveClosure from '../../dependency-graph/lib/buildSccTransitiveClosure';
import computeTransitiveHashes from './computeTransitiveHashes';
import configureGetDependencies from '../../dependencies/lib/getDependencies';
import configureProcessFile, { ProcessedFileInfo } from './processFile';
import getStronglyConnectedComponents from '../../dependency-graph/lib/getStronglyConnectedComponents';
import { DependencyGetter, Options } from '../../dependencies/lib/types';
import { CacheLoader, CacheOptions } from '../../cache/lib/types';

export type ProcessFilesOptions = Options & CacheOptions;

export default async function processFiles(filePaths: string[], hashAlgorithm: string, getCacheFile: CacheLoader, options: ProcessFilesOptions) {
    const getDependencies = configureGetDependencies(filePaths, options);
    const fileGraph = await computeFileInfo(filePaths, hashAlgorithm, getDependencies, getCacheFile, options);
    const withStronglyConnectedComponents = getStronglyConnectedComponents(fileGraph);
    const sccTransitiveClosure = buildSccTransitiveClosure(withStronglyConnectedComponents);
    const transitiveHashes = computeTransitiveHashes(sccTransitiveClosure, hashAlgorithm, getCacheFile);
    return transitiveHashes;
}


export async function computeFileInfo(
    filePaths: string[], 
    hashAlgorithm: string, 
    getDependencies: DependencyGetter,
    getCacheFile: CacheLoader, 
    options: CacheOptions) {
    const processFile = configureProcessFile(hashAlgorithm, getDependencies, getCacheFile);
    const fileHashPromises: {
        [path: string]: Promise<ProcessedFileInfo>
    } = {};
    for (let path of filePaths) {
        fileHashPromises[path] = processFile(path);
    }

    let fileHashes: { [path: string]: ProcessedFileInfo } = {};

    for (let [path, promise] of Object.entries(fileHashPromises)) {
        fileHashes[path] = await promise;
    }

    return fileHashes;
}