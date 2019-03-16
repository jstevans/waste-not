import { ProcessedFileInfo } from "./processFile";
import { ComponentWithTransitiveHash, GraphWithTransitiveHash } from "./computeTransitiveHashes";

export default function stampTransitiveHashOnNodes<T extends ProcessedFileInfo>(component: ComponentWithTransitiveHash, includedNodeIds: string[], graph: GraphWithTransitiveHash<T>) {
    for (const nodeId of component.nodes) {
        const node = graph[nodeId];
        node.transitiveClosure = includedNodeIds;
        node.transitiveHash = component.transitiveHash;
    }
}