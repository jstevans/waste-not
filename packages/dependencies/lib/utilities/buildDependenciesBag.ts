import { PathAliasInfo } from "../types";

export function buildDependenciesBagWarningsOnly(
    filePath: string,
    warnings: string[]) {
    return buildDependenciesBag(
        filePath,
        [],
        [],
        [],
        [],
        warnings);
}

export function buildDependenciesBag(
    filePath: string,
    dependencies: string[] = [],
    wildcardFileDependencies: string[] = [],
    wildcardAliasDependencies: PathAliasInfo[] = [],
    nativeDependencies: string[] = [],
    warnings: string[] = []) {
    return {
        filePath,
        dependencies,
        wildcardFileDependencies,
        wildcardAliasDependencies,
        nativeDependencies,
        warnings
    }
}