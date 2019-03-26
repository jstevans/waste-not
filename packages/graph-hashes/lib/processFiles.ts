import buildSccTransitiveClosure from '../../dependency-graph/lib/buildSccTransitiveClosure';
import computeTransitiveHashes from './computeTransitiveHashes';
import configureGetDependencies from '../../dependencies/lib/getDependencies';
import configureProcessFile, { ProcessedFileInfo } from './processFile';
import getStronglyConnectedComponents from '../../dependency-graph/lib/getStronglyConnectedComponents';
import { DependencyGetter, Options } from '../../dependencies/lib/types';

export default async function processFiles(filePaths: string[], hashAlgorithm: string, options: Options) {
    const getDependencies = configureGetDependencies(filePaths, options);
    const fileGraph = await computeFileInfo(filePaths, hashAlgorithm, getDependencies);
    const withStronglyConnectedComponents = getStronglyConnectedComponents(fileGraph);
    const sccTransitiveClosure = buildSccTransitiveClosure(withStronglyConnectedComponents);
    const transitiveHashes = computeTransitiveHashes(sccTransitiveClosure, hashAlgorithm);
    return transitiveHashes;
}


export async function computeFileInfo(filePaths: string[], hashAlgorithm: string, getDependencies: DependencyGetter) {
    const processFile = configureProcessFile(hashAlgorithm, getDependencies);
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