import makeHash from './utilities/makeHash';
import stampTransitiveHashOnNodes from './stampTransitiveHashOnNodes';
import { ComponentWithTransitiveClosure, GraphAndComponentsWithTransitiveClosure, TransitiveClosure } from '../../dependency-graph/lib/buildSccTransitiveClosure';
import { ProcessedFileInfo } from './processFile';
import getNodesInComponentTransitiveClosure from './utilities/getNodesInComponentTransitiveClosure';
import getHashesFromNodes from './utilities/getHashesFromNodes';

export type TransitiveHash = { transitiveHash?: string };
export type ComponentWithTransitiveHash = ComponentWithTransitiveClosure & Required<TransitiveHash>;
export type ComponentsWithTransitiveHash = {
    [sccId: string]: ComponentWithTransitiveHash;
};

export type NodeWithTransitiveHash<T extends ProcessedFileInfo> = T & Required<TransitiveClosure & TransitiveHash>;
export type GraphWithTransitiveHash<T extends ProcessedFileInfo> = {
    [nodeId: string]: NodeWithTransitiveHash<T>
}

export type GraphAndComponentsWithTransitiveHash<T extends ProcessedFileInfo> = GraphAndComponentsWithTransitiveClosure<T> & {
    components: ComponentsWithTransitiveHash;
    graph: GraphWithTransitiveHash<T>;
}

export default function computeTransitiveHashes<T extends ProcessedFileInfo>(graphWithClosure: GraphAndComponentsWithTransitiveClosure<T>, hashAlgorithm: string) {
    const { components: inputComponents, graph: inputGraph } = graphWithClosure;

    const components = inputComponents as ComponentsWithTransitiveHash;

    // for each SCC:
    for (const component of Object.values(components)) {

        // 1. get list of files involved in each SCC's transitive hash
        let includedNodeIds = getNodesInComponentTransitiveClosure(component, components);

        // 2. get list of hashes for those files (lexically sorted for determinism)
        let includedHashes = getHashesFromNodes(includedNodeIds, inputGraph);

        // 3a. the component's transitive hash is the hash of all of its files' hashes
        component.transitiveHash = makeHash(hashAlgorithm, includedHashes);

        // 3b. Each node's transitive closure (and thus its transitive hash) is the same as its SCC
        stampTransitiveHashOnNodes(component, includedNodeIds, inputGraph as GraphWithTransitiveHash<T>);
    }

    return graphWithClosure as GraphAndComponentsWithTransitiveHash<T>;
}
