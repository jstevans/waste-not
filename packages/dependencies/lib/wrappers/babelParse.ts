import { parse } from '@babel/parser';
import babelParserOptions from '../constants/babelParser';

export const jsOrTs = /\.[t|j]sx?$/;
export default function defaultParser(filePath: string, code: string, options = babelParserOptions) {
    return jsOrTs.exec(filePath) && parse(code, options);
}