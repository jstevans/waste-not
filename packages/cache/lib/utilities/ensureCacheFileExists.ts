import * as path from '../wrappers/path';
import * as json from '../wrappers/json';
import { writeFileSync } from "../wrappers/fs";
import { CacheFile } from '../types';
import ensureDirectoryExists from './ensureDirectoryExists';

export const cacheStructure: CacheFile = {
    metadata: {},
    properties: {}
}

export const cacheStructureString = json.stringify(cacheStructure);
export default function ensureCacheFileExists(cacheDirPath: string, fileRelativePath: string) {
    const cacheFilePath = path.resolve(cacheDirPath, fileRelativePath);
    let fileWasCreated = true;
    try {
        // Make sure the subdirectories of the cache are hydrated correctly
        ensureDirectoryExists(path.dirname(cacheFilePath));

        // If the cache file doesn't exist, initialize it with valid JSON
        writeFileSync(cacheFilePath, cacheStructureString, { flag: 'wx' })
    }
    catch (e) {
        // don't throw on EEXIST
        if (e.errno !== -17) {
            throw e;
        } else {
            fileWasCreated = false;
        }
    }

    return { fileWasCreated, cacheFilePath };
}