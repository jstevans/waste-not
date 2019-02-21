import cabinet from "filing-cabinet";
import { TsConfig } from "../types";
import { File } from "@babel/types";

export type CabinetOptions = {
  partial: string,
  filename: string,
  directory: string,
  ast?: File,
  config?: string,
  nodeModulesConfig?: { entry: string },
  tsConfig?: string | TsConfig,
  webpackConfig?: string,
}

export type Cabinet = (options: CabinetOptions) => string;
export default cabinet as Cabinet;