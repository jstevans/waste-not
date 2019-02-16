export default function addDependency(dep: string, state: any) {
    state.dependencies = (state.dependencies || []).concat(dep);
}