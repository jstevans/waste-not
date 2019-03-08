export type InputNode = {
    dependencies: string[];
};

export type InputGraph = {
    [id: string]: InputNode;
};

type NodeExternalData = {
    nodeIndex?: number;
    componentIndex?: number;
};

type NodeInternalData = NodeExternalData & {
    onStack?: boolean;
};

type SccInputNode = InputNode & NodeInternalData;
type SccOutputNode = InputNode & Required<NodeInternalData>;

export type StronglyConnectedComponent = {
    nodes: string[];
    dependencies: string[];
};

export type StronglyConnectedComponents = {
    [sccId: string]: StronglyConnectedComponent;
};

export type GraphWithComponentMapping = {
    [id: string]: InputNode & Required<NodeExternalData>;
};

export type GraphWithComponents = {
    components: StronglyConnectedComponents;
    graph: GraphWithComponentMapping;
    reverseToposort: string[];
};

/**
 * Custom implementation of Tarjan's algorithm for strongly-connected components.
 * NOTE: This function mutates its inputs.
 * @see https://enwp.org/Tarjan%27s_strongly_connected_components_algorithm
 * @returns A collection of SCCs, as well as the original graph
 */
export default function getStronglyConnectedComponents(graph: InputGraph): GraphWithComponents {
    let nodeIndex = 0;
    let nodeStack: [string, InputNode][] = [];
    const components: StronglyConnectedComponents = {};

    // One useful property of Tarjan's algorithm is that the order
    // it finds SCCs forms a reverse topological sort of the SCCs
    const reverseToposort: string[] = [];
    for (let [nodeName, node] of Object.entries(graph) as [string, SccInputNode][]) {
        if (node.nodeIndex === undefined) {
            strongConnect(nodeName, node);
        }
    }


    function strongConnect(nodeName: string, node: SccInputNode): node is SccOutputNode {
        // Initialize the node with a unique index
        node.nodeIndex = nodeIndex;
        node.componentIndex = nodeIndex;
        nodeIndex++;
        nodeStack.push([nodeName, node]);
        node.onStack = true;

        // Consider successors of node
        for (let dep of node.dependencies) {
            let depNode = graph[dep] as SccInputNode;
            if (depNode.nodeIndex === undefined) {
                // depNode has not yet been visited; recurse on it.
                strongConnect(dep, depNode) &&
                    // This always evaluates; the && is just to coerce depNode
                    // into an SccOutputNode.
                    (node.componentIndex = Math.min(node.componentIndex, depNode.componentIndex));
            } else if (depNode.onStack) {
                // Successor depNode is on the stack and hence in the current SCC.
                // If depNode is not on the stack, then the edge (node, depNode) is 
                // between two SCCs and should not be counted.
                node.componentIndex = Math.min(node.componentIndex, depNode.nodeIndex);
            }
        }

        if (node.componentIndex == node.nodeIndex) {
            // If node is a root node, pop the stack and generate an SCC.
            let component: string[] = [];
            let stackNodeName: string;
            let stackNode: SccOutputNode;
            do {
                [stackNodeName, stackNode] = nodeStack.pop() as any;
                stackNode.onStack = false;
                component.push(stackNodeName);
            } while (stackNode != node)

            reverseToposort.push(node.componentIndex.toString());
            components[node.componentIndex] = { nodes: component, dependencies: [] };
        }
        return true;
    }

    return addCrossEdges(components, graph as GraphWithComponentMapping, reverseToposort);
}

export function addCrossEdges(components: StronglyConnectedComponents, graph: GraphWithComponentMapping, reverseToposort: string[]): GraphWithComponents {
    for (let [componentId, component] of Object.entries(components)) {
        let componentDeps = component.nodes
            // flatten node dependencies
            .reduce((acc, e) => [...acc, ...graph[e].dependencies], [] as string[])
            // convert to component dependencies
            .map(dep => (graph[dep] as SccOutputNode).componentIndex.toString())
            // remove self-dependencies
            .filter(dep => dep != componentId);

        // dedupe
        component.dependencies = Array.from(new Set(componentDeps));
    }

    return { components, graph, reverseToposort };
}