
export default function addWarning(warning: string, state: any) {
    state.warnings = (state.warnings || []).concat(warning);
}