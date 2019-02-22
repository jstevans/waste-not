import { Options, TsConfig } from "./types";

export default function getTsConfig(options?: Options): TsConfig | undefined {
    let tsConfig = options && options.tsConfig;
    if (tsConfig) {
        if (typeof tsConfig === 'string') {
            return require(tsConfig) as TsConfig;
        } else if (typeof tsConfig === 'object') {
            return tsConfig;
        }
    }
    return undefined;
}