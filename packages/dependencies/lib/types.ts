import { File } from "@babel/types";
import parser from "./wrappers/babelParse";

export type Options = {
    baseDirectory: string,
    requireJsConfig?: string,
    webpackConfig?: string,
    tsConfig?: string | TsConfig,
};

export type TsConfig = { baseUrl: string, paths: { [idx: string]: string[] } };

export type Resolver = (ast: File, dependency: string, filePath: string, options: Options) => string;

export type PathAliasInfo = {
    original: string[],
    aliases: string[],
};

export type Overrides = { parse?: ScriptParser, resolver?: Resolver};

export type ScriptParser = typeof parser;

export type DependencyGetter<T extends string>= (filePath: T, code?: string) => MaybeDependencies;
export type Dependencies = {
    filePath: string,
    dependencies: string[],
    wildcardFileDependencies: string[],
    wildcardAliasDependencies: PathAliasInfo[],
    nativeDependencies: string[],
    warnings: string[]
}

export type NotDependencies = Dependencies & {
    filePath: string,
    issue: Error,
    details: any
}

export type MaybeDependencies = Dependencies | NotDependencies;
