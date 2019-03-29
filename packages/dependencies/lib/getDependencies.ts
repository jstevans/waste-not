import configureGetDependenciesForFile from './getDependenciesForFile';
import configureGetDependenciesForPackage from './getDependenciesForPackage';
import { FileOrGroup, Options, Overrides, DependencyGetter } from './types';

export default function configure(
    allFiles: Record<string, FileOrGroup>,
    options: Options,
    overrides?: Overrides): DependencyGetter<FileOrGroup> {
        
    let getDependenciesForFile = configureGetDependenciesForFile(allFiles, options, overrides);
    let getDependenciesForPackage = configureGetDependenciesForPackage(allFiles, options, overrides);
    
    return function getDependencies(fileOrGroup: FileOrGroup, code?: string) {
        return typeof fileOrGroup === 'string' ?
            getDependenciesForFile(fileOrGroup, code) :
            getDependenciesForPackage(fileOrGroup);
    };
}
