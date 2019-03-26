import makeHash from './utilities/makeHash';
import * as fs from './wrappers/fs';
import { DependencyGetter, MaybeDependencies } from '../../dependencies/lib/types';
import { CacheLoader } from '../../cache/lib/types';

export type ProcessedFileInfo = MaybeDependencies & { hash: string };

export default function configure(hashAlgorithm: string, getDependencies: DependencyGetter, getCacheFile: CacheLoader) {
    return function processFile(filePath: string): Promise<ProcessedFileInfo> {
        return new Promise(resolve =>
            fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
                const hash = makeHash(hashAlgorithm, [filePath, data]);
                const dependencyInfo = getDependencies(filePath, data);
                let metadata = getCacheFile(filePath).metadata.get();
                let processedFileInfo =
                {
                    ...dependencyInfo,
                    hash,
                };
                // small optimization: we don't do metadata.commit()
                // here, since we haven't yet stamped the transitiveHash
                // after the next step
                Object.assign(metadata, processedFileInfo);
                resolve(processedFileInfo);
            }));
    }
}