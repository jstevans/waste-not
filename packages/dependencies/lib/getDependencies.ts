import babelParserOptions from './constants/babelParser';
import defaultResolver from './callCabinet';
import readFileSync from './wrappers/readFileSync';
import visitors from '../../visitors/lib/visitors';
import walkFile from '../../walker/lib/walkFile';
import { Options, Resolver, DependencyGetter, Dependencies } from './types';
import { parse } from '@babel/parser';
import { WalkerState } from '../../walker/lib/types';
import getWildcardPathAliases from "./getWildcardPathAliases";
import getTsConfig from './getTsConfig';

export default function configure(options?: Options, resolver: Resolver = defaultResolver): DependencyGetter {
    return function getDependencies(filePath: string): Dependencies {
        let tsConfig = getTsConfig(options);

        const code = readFileSync(filePath, 'utf8');

        const ast = parse(code, babelParserOptions);
        const { fileDependencies, wildcardDependencies, nativeDependencies, warnings } = walkFile(ast, visitors) as WalkerState;
        return {
            filePath,
            fileDependencies: fileDependencies.map(dep => resolver(ast, dep, filePath, options)),
            wildcardDependencies: wildcardDependencies.map(dep => getWildcardPathAliases(dep, filePath, tsConfig)),
            nativeDependencies,
            warnings
        }
    }
}