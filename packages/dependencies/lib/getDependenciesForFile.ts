import defaultResolver from './resolveDependency';
import defaultParser from './wrappers/babelParse';
import readFileSync from './wrappers/readFileSync';
import visitors from '../../visitors/lib/visitors';
import walkFile from '../../walker/lib/walkFile';
import {
    DependencyGetter,
    MaybeDependencies,
    Options,
    Overrides,
} from './types';
import { WalkerState } from '../../walker/lib/types';
import getWildcardPathAliases from "./getWildcardPathAliases";
import getTsConfig from './getTsConfig';
import convertRelativePath from './utilities/convertRelativePath';
import getMatchedStrings from './utilities/getMatchedStrings';
import * as util from 'util';
import { buildDependenciesBagWarningsOnly, buildDependenciesBag } from './utilities/buildDependenciesBag';

export default function configure(
    allFiles: string[],
    options: Options,
    overrides?: Overrides): DependencyGetter<string> {
    return function getDependenciesForFile(filePath: string, code?: string): MaybeDependencies {
        try {
            let tsConfig = getTsConfig(options);

            code = code || readFileSync(filePath, 'utf8');

            const { parse = defaultParser, resolver = defaultResolver } = overrides || {};

            const ast = parse && parse(filePath, code);

            if (!ast) {
                let warnings = [`Failed to parse file ${filePath}`];
                return buildDependenciesBagWarningsOnly(filePath, warnings);
            }

            const walkerState: WalkerState = { fileDependencies: [], wildcardDependencies: [], nativeDependencies: [], warnings: [] };
            let { fileDependencies, wildcardDependencies, nativeDependencies, warnings } = walkFile(ast, visitors, walkerState);

            let fileDependenciesWithFailures = fileDependencies
                .map(dep => [dep, resolver(ast, dep, filePath, options)])
                .map(dep => [dep[0], convertRelativePath(dep[1], filePath, options.baseDirectory)]);

            let fileDepFailures = fileDependenciesWithFailures
                .filter(dep => !dep[1] || dep[1].length == 0)
                .map(dep => `Failed to resolve dependency '${dep[0]}' in file '${filePath}'`);

            warnings.push(...fileDepFailures);

            fileDependencies = fileDependenciesWithFailures
                .filter(dep => dep[1] && dep[1].length > 0)
                .map(dep => dep[1]);

            let wildcardAliasDependencies = wildcardDependencies
                .map(dep => getWildcardPathAliases(dep, filePath, options.baseDirectory, tsConfig));

            let wildcardFileDependencies = wildcardAliasDependencies
                .map(wad => getMatchedStrings(allFiles, [...wad.original, ...wad.aliases]))
                .reduce((acc, e) => [...acc, ...e], []);

            fileDependencies = [...fileDependencies, ...wildcardFileDependencies];

            return buildDependenciesBag(
                filePath,
                fileDependencies,
                wildcardFileDependencies,
                wildcardAliasDependencies,
                nativeDependencies,
                warnings
            );
        } catch (e) {
            return {
                ...(buildDependenciesBag(filePath)),
                details: e,
                issue:
                    typeof e === 'string' ? new Error(e)
                        : util.types.isNativeError(e) ? e
                            : new Error('Unknown issue occurred.')
            }
        }
    }
}
