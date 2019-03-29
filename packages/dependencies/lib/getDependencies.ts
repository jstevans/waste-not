import configureGetDependenciesForFile from './getDependenciesForFile';
import { FileOrGroup, Options, Overrides, DependencyGetter } from './types';

export default function configure(
    allFiles: Record<string, FileOrGroup>,
    options: Options,
    overrides?: Overrides): DependencyGetter<string> {
        
    let getDependenciesForFile = configureGetDependenciesForFile(allFiles, options, overrides);

    return function getDependencies(fileOrGroup: string, code?: string) {
        return getDependenciesForFile(fileOrGroup, code);
    };
}
