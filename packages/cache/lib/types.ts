
export type Initialize = (
    cacheOptions: CacheOptions,
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
    baseDirectory: string,
    fileRelativePath: string
}

export type CacheLoader = (fileRelativePath: string) => {
        metadata: Metadata,
        getProperty: PropertyGetter
    };

export type PropertyPermissions = {
    write: boolean,
    read: boolean
};

export type PropertyGetter = <T>(
    property: string,
    propertyOptions?: any) => Property<T>;

export type Property<T> = {
    isDirty?: () => boolean,
    read?: () => T
    write?: (value: T) => void,
};

export type Metadata = {
    get: () => any,
    commit: () => void
}

export type CacheFile = {
    metadata: any,
    properties: any
}

export type CacheMode = {
    read: boolean,
    write: boolean,
    overwrite: boolean
}

export type CacheOptions = {
    baseDirectory: string,
    cacheDirPath: string,
    mode: CacheMode,
}

export type Context = {
    cacheOptions: CacheOptions,
    isPropertyDirty: IsPropertyDirty,
    setPropertyClean: SetPropertyClean
}