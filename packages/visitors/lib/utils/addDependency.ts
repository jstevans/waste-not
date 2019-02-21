export enum DependencyKind {
    File = 'fileDependencies',
    Wildcard = 'wildcardDependencies',
    Native = 'nativeDependencies'
}
export default function addDependency(dep: string, state: any, kind?: DependencyKind) {
    kind = kind || getDependencyKind(dep);
    state[kind] = (state[kind] || []).concat(dep);
}

export function getDependencyKind(dep: string) {
    if((process as any).binding('natives')[dep]) {
        return DependencyKind.Native;
    } else if(/.*\*.*/.test(dep)) {
        return DependencyKind.Wildcard;
    }
    return DependencyKind.File;
}