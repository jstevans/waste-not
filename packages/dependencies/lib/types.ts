import { File } from "@babel/types";

export type Options = {
    directory: string,
    requireJsConfig?: string,
    webpackConfig?: string,
    tsConfig?: string | TsConfig,
};

export type TsConfig = { baseUrl: string, paths: { [idx: string]: string[] } };

export type Resolver = (ast: File, dependency: string, filePath: string, options?: Options) => string;