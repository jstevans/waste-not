import { readFileSync, writeFileSync } from './wrappers/fs';
import { Context, CacheLoader } from './types';
import configureGetProperty, { getMetadata } from './getProperty';
import ensureCacheFileExists from './utilities/ensureCacheFileExists';

import * as json from './wrappers/json';

export default function configureLoadCache(context: Context): CacheLoader {
    return function loadCache(fileRelativePath: string, cacheOptions?: any) {
        const { cacheDirPath } = context;

        const cacheFilePath = ensureCacheFileExists(cacheDirPath, fileRelativePath);

        const cacheFile = json.parse(readFileSync(cacheFilePath, { encoding: 'utf8' }));
        const writeToDisk = () => writeFileSync(cacheFilePath, json.stringify(cacheFile));

        const metadata = getMetadata(cacheFile, writeToDisk);
        const getProperty = configureGetProperty(context, metadata, cacheFile, fileRelativePath, writeToDisk);

        return { metadata, getProperty };
    }
}

