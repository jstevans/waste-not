
export type Initialize = (
    rootPath: string,
    cacheDirPath: string,
    isPropertyDirty: IsPropertyDirty,
    setPropertyClean: SetPropertyClean
) => CacheLoader;

export type IsPropertyDirty = (
    cacheProperty: any,
    metadata: Metadata,
    fileInfo: FileInfo,
    propertyOptions?: any) => boolean;

export type SetPropertyClean = (
    cacheProperty: any,
    metadata: Metadata,
    fileInfo: FileInfo,
    propertyOptions?: any) => void;

export type FileInfo = {
    cacheDirPath: string,
    rootPath: string,
    fileRelativePath: string
}

export type CacheLoader = (
    fileRelativePath: string,
    cacheOptions?: any) => {
        metadata: Metadata,
        getProperty: PropertyGetter
    };

export type PropertyGetter = <T>(
    property: string, 
    propertyOptions?: any) => Property<T>;

export type Property<T> = {
    isDirty: () => boolean,
    read: () => T,
    write: (value: T) => void,
}

export type Metadata = {
    get: () => any,
    commit: () => void
}

export type CacheFile = {
    metadata: any,
    properties: any
}

export type Context = {
    rootPath: string,
    cacheDirPath: string,
    isPropertyDirty: IsPropertyDirty,
    setPropertyClean: SetPropertyClean
}