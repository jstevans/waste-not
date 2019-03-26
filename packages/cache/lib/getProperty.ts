import { Context, Property, Metadata, PropertyGetter, PropertyPermissions } from "./types";

export default function configureGetProperty(
    context: Context,
    getMetadata: Metadata,
    cacheFile: any,
    fileRelativePath: string,
    writeToDisk: () => void,
    permissions: PropertyPermissions
): PropertyGetter {
    return function getProperty<T>(property: string, propertyOptions?: any): Property<T> {
        if (!cacheFile['properties'][property]) {
            cacheFile['properties'][property] = {};
        }

        const cacheProperty = cacheFile['properties'][property];
        const {
            cacheOptions: {
                cacheDirPath,
                rootPath,
            },
            isPropertyDirty,
            setPropertyClean
        } = context;

        let propertyValue: Property<T> = {};
        if (permissions.read) {
            propertyValue.isDirty = () => isPropertyDirty(
                cacheProperty,
                getMetadata,
                {
                    cacheDirPath,
                    rootPath,
                    fileRelativePath
                },
                propertyOptions);

            propertyValue.read = () =>
                JSON.parse(JSON.stringify({ value: cacheProperty.value })).value;
        }
        if (permissions.write) {
            propertyValue.write = (newValue: any) => {
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
        };

        return propertyValue;
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