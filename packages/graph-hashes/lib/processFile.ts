import makeHash from './utilities/makeHash';
import * as fs from './wrappers/fs';
import { DependencyGetter, MaybeDependencies } from '../../dependencies/lib/types';

export type ProcessedFileInfo = MaybeDependencies & { hash: string };

export default function configure(hashAlgorithm: string, getDependencies: DependencyGetter) {
    return async function processFile(filePath: string): Promise<ProcessedFileInfo> {
        return new Promise(resolve =>
            fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
                const hash = makeHash(hashAlgorithm, [filePath, data]);
                const dependencyInfo = getDependencies(filePath, data);
                resolve({
                    ...dependencyInfo,
                    hash,
                });
            }));
    }
}