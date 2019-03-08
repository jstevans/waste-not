import { GraphWithComponents, StronglyConnectedComponent } from "./getStronglyConnectedComponents";

export type ExternalData = { transitiveClosure?: string[] };
export type InternalData = ExternalData;
export type InputComponent = StronglyConnectedComponent & InternalData;
export type OutputComponent = StronglyConnectedComponent & Required<ExternalData>;
export type OutputComponents = {
    [id: string]: OutputComponent;
}

export type GraphAndComponentsWithTransitiveClosure = GraphWithComponents & {
    components: OutputComponents;
}
export default function buildSccTransitiveClosure(graphAndComponents: GraphWithComponents): GraphAndComponentsWithTransitiveClosure {
    let { graph: _graph, components: inputComponents, reverseToposort } = graphAndComponents;

    // a component is always in its own transitive closure
    for (let sortedId of reverseToposort) {
        let component: InputComponent = inputComponents[sortedId];
        component.transitiveClosure = [sortedId];
    }

    let components = inputComponents as OutputComponents;

    // In the order of a reverse toposort, i.e. going over each component
    // only after we've gone over all of its dependencies...
    for (let sortedId of reverseToposort) {
        let component = components[sortedId];

        // ...compute the component's transitive closure, i.e. its direct 
        // and indirect dependencies.
        for (let depId of component.dependencies) {
            let depComponent = components[depId];
            component.transitiveClosure.push(...depComponent.transitiveClosure);
        }

        // dedupe
        component.transitiveClosure = Array.from(new Set(component.transitiveClosure));
    }

    return { graph: _graph, components: components, reverseToposort };

}