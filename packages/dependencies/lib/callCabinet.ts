import { File } from "@babel/types";
import { Options } from "./types";
import cabinet from "./wrappers/cabinet";

export default function defaultResolver(
    ast: File, 
    dependency: string, 
    filePath: string, 
    options?: Options) {
    return cabinet({
        partial: dependency,
        filename: filePath,
        directory: './',
        ast,
        config: options ? options.requireJsConfig : undefined,
        ...options
    })
}