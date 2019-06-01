import * as globby from 'globby';
import initializeCache from '../../cache/lib/index';
import processFiles, { ProcessFilesOptions } from '../../graph-hashes/lib/processFiles';
import {
    FileInfo,
    Metadata,
    PropertyGetter
    } from '../../cache/lib/types';
import { TsConfig } from '../../dependencies/lib/types';

export interface WasteNotConfig {
    baseDirectory?: string,
    cacheDir?: string,
    files?: string[],
    hashAlgorithm?: string,
    mode?: {
        read?: boolean,
        write?: boolean,
        overwrite?: boolean
    },
    tsConfig?: string | TsConfig,
    requireJsConfig?: string,
    webpackConfig?: string

}
export default async function wastenot(config: WasteNotConfig = {}) {
    let {
        baseDirectory = process.cwd(),
        cacheDir = '.waste-not',
        files = ['**/*', '*'],
        hashAlgorithm = 'sha512',
    } = config;

    let cacheMode = { read: true, write: true, overwrite: true, ...config.mode };

    function isPropertyDirty(cacheProperty: any, metadata: Metadata, fileInfo: FileInfo, propertyOptions?: any) {
        let hashKey = propertyOptions.transitive ? 'transitiveHash' : 'hash';
        return metadata.get()[hashKey] !== cacheProperty[hashKey];
    }

    function setPropertyClean(cacheProperty: any, metadata: Metadata, fileInfo: FileInfo, propertyOptions?: any) {
        let hashKey = propertyOptions.transitive ? 'transitiveHash' : 'hash';
        cacheProperty[hashKey] = metadata.get()[hashKey];
    }

    let cacheOptions: ProcessFilesOptions = {
        ...config,
        baseDirectory: baseDirectory,
        cacheDirPath: cacheDir,
        mode: cacheMode,
    };
    let _loadCache = initializeCache(cacheOptions, isPropertyDirty, setPropertyClean);

    function loadCache(fileRelativePath: string): PropertyGetter {
        const { getProperty } = _loadCache(fileRelativePath);
        return getProperty;
    }

    let allFiles = globby.sync(files, { unique: true, onlyFiles: true });
    let { graph, components } = await processFiles(allFiles, hashAlgorithm, _loadCache, cacheOptions);

    // we want the returned value to be a function,
    // but for those interested (e.g. dependency analyzers), 
    // we also want to yield our graph/components
    loadCache['graph'] = JSON.parse(JSON.stringify(graph));
    loadCache['components'] = JSON.parse(JSON.stringify(components));


    return loadCache;
}