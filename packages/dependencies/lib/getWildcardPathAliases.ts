
import { TsConfig, PathAliasInfo } from "./types";
import * as ts from "./wrappers/typescript";
import * as path from 'path';

export default function getWildcardPathAliases(pathString: string, filePath: string, tsConfig?: TsConfig): PathAliasInfo {
    let isPathRelative = ts.pathIsRelative(pathString);
    pathString = isPathRelative ? path.resolve(path.dirname(filePath), pathString) : pathString;

    let paths: { original: string[], aliases: string[] } = { original: [pathString], aliases: [] };
    let pathMap = tsConfig && tsConfig.paths;

    if (pathMap && !isPathRelative) {
        paths.original = getPathsFromAliases(paths.original, filePath);
        let matchedPattern = ts.matchPatternOrExact(ts.getOwnKeys(pathMap), pathString);
        if (matchedPattern) {
            let matchedStar = ts.isString(matchedPattern) ? undefined : ts.matchedText(matchedPattern, pathString);
            let matchedPatternText = ts.isString(matchedPattern) ? matchedPattern : ts.patternText(matchedPattern);
            
            paths.aliases = pathMap[matchedPatternText]
                .map(alias => alias.replace("*", matchedStar || ''));
                
            paths.aliases = getPathsFromAliases(paths.aliases, filePath);
        }
    }

    return paths;
}

export function getPathsFromAliases(aliases: string[], filePath: string) {
    let lookupPaths = aliases.map(alias => getPossibleLookupLocations(alias, filePath))
        .reduce((acc, locations) => [...acc, ...locations])
        .map(tryGetValidLookupLocation)
        .filter(e => !!e)
        .map(p => path.resolve(p as string));

    return Array.from(new Set([...aliases, ...lookupPaths]));
}

export function getPossibleLookupLocations(path: string, filePath: string): string[] {
    return (ts.resolveModuleName(
        path,
        filePath,
        {},
        ts.createCompilerHost({})) as any)
        .failedLookupLocations
}

export function tryGetValidLookupLocation(location: string) {
    let parts = location.split("*.d.ts");
    return parts[1] === "" && parts.length === 2 && parts[0] + "*";
}