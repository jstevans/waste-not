import { Options, TsConfig } from "./types";
import * as path from 'path';

export default function getTsConfig(options: Options): TsConfig | undefined {
    let tsConfig = options && options.tsConfig;
    if (tsConfig) {
        if (typeof tsConfig === 'string') {
            return require(path.resolve(options.directory, tsConfig)) as TsConfig;
        } else if (typeof tsConfig === 'object') {
            return tsConfig;
        }
    }
    return undefined;
}