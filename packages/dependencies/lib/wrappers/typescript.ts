
/**
 * Module declaration for some non-public typescript methods
 */
declare module "typescript" {
    /** Represents a "prefix*suffix" pattern. */
    interface Pattern {
        prefix: string;
        suffix: string;
    }
    function getOwnKeys<T>(map: MapLike<T>): string[];
    function matchPatternOrExact(patternStrings: ReadonlyArray<string>, candidate: string): string | Pattern | undefined;
    function isString(text: unknown): text is string;
    function matchedText(pattern: Pattern, candidate: string): string;
    function patternText({ prefix, suffix }: Pattern): string;
    function pathIsRelative(path: string): boolean;   
    function combinePaths(path: string, ...paths: (string | undefined)[]): string;
    function resolvePath(path: string, ...paths: (string | undefined)[]): string;
}

export {getOwnKeys, matchPatternOrExact, isString, matchedText, patternText, pathIsRelative, combinePaths, resolvePath } from "typescript";