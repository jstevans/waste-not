import { File } from "@babel/types";

export type Options = {
    directory: string,
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

export type DependencyGetter = (filePath: string, code?: string) => Dependencies;
export type Dependencies = {
    filePath: string,
    dependencies: string[],
    wildcardFileDependencies: string[],
    wildcardAliasDependencies: PathAliasInfo[],
    nativeDependencies: string[],
    warnings: string[]
}