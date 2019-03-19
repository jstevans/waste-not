
import { TsConfig, PathAliasInfo } from "./types";
import * as ts from "./wrappers/typescript";
import * as path from 'path';
import convertRelativePath from "./utilities/convertRelativePath";

/**
 * 
 * @param pathString A path containing a wildcard
 * @param filePath The file that contains a reference to 'pathString'
 * @param tsConfig A tsConfig, containing path mappings
 */
export default function getWildcardPathAliases(pathString: string, filePath: string, baseDirectory: string, tsConfig?: TsConfig): PathAliasInfo {
    let isPathRelative = ts.pathIsRelative(pathString);
    pathString = isPathRelative ? convertRelativePath(pathString, filePath, baseDirectory) : pathString;

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

/**
 * 
 * @param aliases A collection of wildcarded path aliases
 * @param filePath The file that contains a reference to the 'aliases'
 * @returns A deduped set of paths that might exist, corresponding to 'aliases'
 */
export function getPathsFromAliases(aliases: string[], filePath: string) {
    let lookupPaths = aliases.map(alias => getPossibleLookupLocations(alias, filePath))
        .reduce((acc, locations) => [...acc, ...locations])

    return Array.from(new Set([...aliases.map(e => e[e.length-1] == "*" ? e.slice(0, -1) : e), ...lookupPaths]));
}

/**
 * 
 * @param alias A wildcarded path segment that might exist somewhere
 * @param filePath The file that contains a reference to 'path'
 * @returns A list of wildcarded relative paths from root that might exist
 */
export function getPossibleLookupLocations(alias: string, filePath: string): string[] {
    // resolveModuleName thinks it's looking for files, so it duplicates each
    // path with each of its valid file extensions.
    const pathsWithExtensions = (ts.resolveModuleName(
        alias,
        filePath,
        {},
        ts.createCompilerHost({})) as any)
        .failedLookupLocations;

    // We're looking for a wildcarded path, though, so we clean up those strings
    return pathsWithExtensions
        .map(tryGetValidLookupLocation)
        .filter(e => !!e)
        .map(p => path.resolve(p));

    
}

/**
 * 
 * @param location A wildcarded path, with a file extension
 * @returns Either the wildcarded path, or a falsy expression
 */
export function tryGetValidLookupLocation(location: string) {
    // We could dedupe by any file extension, so we choose .d.ts.
    let parts = location.split("*.d.ts");
    return parts[1] === "" && parts.length === 2 && parts[0];
}