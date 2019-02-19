import walkFile from "../../walker/lib/walkFile";
import babelParserOptions from "./constants/babelParser";
import { parse } from "@babel/parser";
import visitors from "../../visitors/lib/visitors";
import { WalkerState } from "../../walker/lib/types";
import cabinet from 'filing-cabinet';
import { readFileSync } from 'fs';
import { File } from "@babel/types";

export type Options = {
    directory: string,
    requireJsConfig: string,
    webpackConfig: string,
    tsConfig: string | { baseUrl: string, paths: { [idx: string]: string[] } },
};

export type Resolver = (ast: File, dependency: string, filePath: string, options?: Options) => string;

function sanitizeOptions(options?: Options) {
    return options && {...options, config: options.requireJsConfig };
}

export default function getDependencies(filePath: string, options?: Options, resolver: Resolver = defaultResolver) {
    options = sanitizeOptions(options);

    const code = readFileSync(filePath, 'utf8');

    const ast = parse(code, babelParserOptions);
    const { dependencies, warnings } = walkFile(ast, visitors) as WalkerState;
    let x = 'babelParser';
    require('./constants/' + x);
    return {
        dependencies: dependencies.map(dep => resolver(ast, dep, filePath, options)),
        warnings
    }
}

export function defaultResolver(ast: File, dependency: string, filePath: string, options?: Options) {
    return cabinet({
      partial: dependency,
      filename: filePath,
      directory: './',
      ast,
      ...options
    })
}