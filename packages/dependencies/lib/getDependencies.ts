import babelParserOptions from './constants/babelParser';
import defaultResolver from './callCabinet';
import readFileSync from './wrappers/readFileSync';
import visitors from '../../visitors/lib/visitors';
import walkFile from '../../walker/lib/walkFile';
import { Options, Resolver, DependencyGetter, Dependencies, PathAliasInfo } from './types';
import { parse } from '@babel/parser';
import { WalkerState } from '../../walker/lib/types';
import getWildcardPathAliases from "./getWildcardPathAliases";
import getTsConfig from './getTsConfig';
import convertRelativePath from './utilities/convertRelativePath';
import getMatchedStrings from './utilities/getMatchedStrings';

export default function configure(
    allFiles: string[],
    options: Options,
    resolver: Resolver = defaultResolver): DependencyGetter {
    return function getDependencies(filePath: string, code?: string): Dependencies {
        let tsConfig = getTsConfig(options);

        code = code || readFileSync(filePath, 'utf8');

        const ast = parse(code, babelParserOptions);

        const walkerState: WalkerState = { fileDependencies: [], wildcardDependencies: [], nativeDependencies: [], warnings: [] };
        let { fileDependencies, wildcardDependencies, nativeDependencies, warnings } = walkFile(ast, visitors, walkerState);

        fileDependencies = fileDependencies
            .map(dep => resolver(ast, dep, filePath, options))
            .map(dep => convertRelativePath(dep, filePath));

        let wildcardAliasDependencies = wildcardDependencies
            .map(dep => getWildcardPathAliases(dep, filePath, tsConfig));

        let wildcardFileDependencies = wildcardAliasDependencies
            .map(wad => getMatchedStrings(allFiles, [...wad.original, ...wad.aliases]))
            .reduce((acc, e) => [...acc, ...e], []);

        fileDependencies = [...fileDependencies, ...wildcardFileDependencies];

        return {
            filePath,
            dependencies: fileDependencies,
            wildcardFileDependencies,
            wildcardAliasDependencies,
            nativeDependencies,
            warnings
        }
    }
}
