import { readFileSync, writeFileSync } from './wrappers/fs';
import { Context, CacheLoader } from './types';
import configureGetProperty, { getMetadata } from './getProperty';
import ensureCacheFileExists from './utilities/ensureCacheFileExists';

import * as json from './wrappers/json';

export default function configureLoadCache(context: Context): CacheLoader {
    return function loadCache(fileRelativePath: string) {
        const { cacheOptions: { cacheDirPath, mode: cacheMode } } = context;

        const { fileWasCreated, cacheFilePath } = ensureCacheFileExists(cacheDirPath, fileRelativePath);

        const cacheFile = json.parse(readFileSync(cacheFilePath, { encoding: 'utf8' }));
        const writeToDisk = () => {
                writeFileSync(cacheFilePath, json.stringify(cacheFile))
        };

        const metadata = getMetadata(cacheFile, writeToDisk);

        let permissions = {
            write: cacheMode.write && (cacheMode.overwrite || fileWasCreated),
            read: cacheMode.read
        };
        
        const getProperty = configureGetProperty(context, metadata, cacheFile, fileRelativePath, writeToDisk, permissions);

        return { metadata, getProperty };
    }
}

