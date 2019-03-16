import { ComponentWithTransitiveClosure, ComponentsWithTransitiveClosures } from "../../../dependency-graph/lib/buildSccTransitiveClosure";

export default function getNodesInComponentTransitiveClosure(component: ComponentWithTransitiveClosure, allComponents: ComponentsWithTransitiveClosures) {
    const includedComponents = component.transitiveClosure;
    const includedNodeIds = includedComponents
        .reduce((acc, ic) => acc.concat(allComponents[ic].nodes), [] as string[]);
        
    return includedNodeIds;
}