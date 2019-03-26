import { Context, Property, Metadata, PropertyGetter } from "./types";

export default function configureGetProperty(
    context: Context,
    getMetadata: Metadata,
    cacheFile: any,
    fileRelativePath: string,
    writeToDisk: () => void
): PropertyGetter {
    return function getProperty<T>(property: string, propertyOptions?: any): Property<T> {
        if (!cacheFile['properties'][property]) {
            cacheFile['properties'][property] = {};
        }
        
        const cacheProperty = cacheFile['properties'][property];
        const {
            cacheDirPath,
            rootPath,
            isPropertyDirty,
            setPropertyClean
        } = context;

        return {
            isDirty: () => isPropertyDirty(
                cacheProperty,
                getMetadata,
                {
                    cacheDirPath,
                    rootPath,
                    fileRelativePath
                },
                propertyOptions),
            read: () => JSON.parse(JSON.stringify({ value: cacheProperty.value })).value,
            write: (newValue: any) => {
                cacheProperty.value = JSON.parse(JSON.stringify({ value: newValue })).value;
                setPropertyClean(
                    cacheProperty,
                    getMetadata,
                    {
                        cacheDirPath,
                        rootPath,
                        fileRelativePath
                    },
                    propertyOptions);
                writeToDisk();
            }
        }
    }
}

export function getMetadata(
    cacheFile: any,
    writeToDisk: () => void
) {
    const cacheProperty = cacheFile['metadata'];

    return {
        get: () => cacheProperty,
        commit: writeToDisk
    }
}