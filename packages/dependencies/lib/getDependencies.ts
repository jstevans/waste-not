import configureGetDependenciesForFile from './getDependenciesForFile';
import { Options, Overrides, DependencyGetter } from './types';

export default function configure(
    allFiles: string[],
    options: Options,
    overrides?: Overrides): DependencyGetter<string> {

    let getDependenciesForFile = configureGetDependenciesForFile(allFiles, options, overrides);

    return function getDependencies(file: string, code?: string) {
        return getDependenciesForFile(file, code);
    };
}
