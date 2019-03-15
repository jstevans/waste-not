import { GraphWithComponents, StronglyConnectedComponent, InputNode } from "./getStronglyConnectedComponents";

export type TransitiveClosure = { transitiveClosure?: string[] };
export type InputComponent = StronglyConnectedComponent & TransitiveClosure;
export type ComponentWithTransitiveClosure = StronglyConnectedComponent & Required<TransitiveClosure>;
export type ComponentsWithTransitiveClosures = {
    [id: string]: ComponentWithTransitiveClosure;
}

export type GraphAndComponentsWithTransitiveClosure<T extends InputNode> = GraphWithComponents<T> & {
    components: ComponentsWithTransitiveClosures;
}
export default function buildSccTransitiveClosure<T extends InputNode>(graphAndComponents: GraphWithComponents<T>): GraphAndComponentsWithTransitiveClosure<T> {
    let { graph: _graph, components: inputComponents, reverseToposort } = graphAndComponents;

    // a component is always in its own transitive closure
    for (let sortedId of reverseToposort) {
        let component: InputComponent = inputComponents[sortedId];
        component.transitiveClosure = [sortedId];
    }

    let components = inputComponents as ComponentsWithTransitiveClosures;

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