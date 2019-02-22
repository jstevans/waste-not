
import { TsConfig, PathAliasInfo } from "./types";
import * as ts from "./wrappers/typescript";

export default function getWildcardPathAliases(pathString: string, tsConfig?: TsConfig): PathAliasInfo {
    let paths: { original: string, aliases: string[] } = { original: pathString, aliases: [] };
    let pathMap = tsConfig && tsConfig.paths;
    if (pathMap && !ts.pathIsRelative(pathString)) {
        let matchedPattern = ts.matchPatternOrExact(ts.getOwnKeys(pathMap), pathString);
        if (matchedPattern) {
            let matchedStar = ts.isString(matchedPattern) ? undefined : ts.matchedText(matchedPattern, pathString);
            let matchedPatternText = ts.isString(matchedPattern) ? matchedPattern : ts.patternText(matchedPattern);
            paths.aliases = pathMap[matchedPatternText].map(alias => alias.replace("*", matchedStar || ''));
        }
    }
    return paths;
}