
import { TsConfig, PathAliasInfo } from "./types";
import * as ts from "./wrappers/typescript";
import * as path from 'path';

export default function getWildcardPathAliases(pathString: string, filePath: string, tsConfig?: TsConfig): PathAliasInfo {
    let isPathRelative = ts.pathIsRelative(pathString);
    pathString = isPathRelative ? path.resolve(path.dirname(filePath), pathString) : pathString;

    let paths: { original: string, aliases: string[] } = { original: pathString, aliases: [] };
    let pathMap = tsConfig && tsConfig.paths;

    if (pathMap && !isPathRelative) {
        let matchedPattern = ts.matchPatternOrExact(ts.getOwnKeys(pathMap), pathString);
        if (matchedPattern) {
            let matchedStar = ts.isString(matchedPattern) ? undefined : ts.matchedText(matchedPattern, pathString);
            let matchedPatternText = ts.isString(matchedPattern) ? matchedPattern : ts.patternText(matchedPattern);
            paths.aliases = pathMap[matchedPatternText].map(alias => alias.replace("*", matchedStar || ''));
        }
    }

    return paths;
}