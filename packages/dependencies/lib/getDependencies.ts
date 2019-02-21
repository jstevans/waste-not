import babelParserOptions from './constants/babelParser';
import defaultResolver from './callCabinet';
import readFileSync from './wrappers/readFileSync';
import visitors from '../../visitors/lib/visitors';
import walkFile from '../../walker/lib/walkFile';
import { Options, Resolver } from './types';
import { parse } from '@babel/parser';
import { WalkerState } from '../../walker/lib/types';

export default function getDependencies(filePath: string, options?: Options, resolver: Resolver = defaultResolver) {
    const code = readFileSync(filePath, 'utf8');

    const ast = parse(code, babelParserOptions);
    const { fileDependencies, warnings } = walkFile(ast, visitors) as WalkerState;
    return {
        fileDependencies: fileDependencies.map(dep => resolver(ast, dep, filePath, options)),
        warnings
    }
}