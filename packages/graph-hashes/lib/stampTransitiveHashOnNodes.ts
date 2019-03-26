import { ProcessedFileInfo } from "./processFile";
import { ComponentWithTransitiveHash, GraphWithTransitiveHash } from "./computeTransitiveHashes";
import { CacheLoader } from "../../cache/lib/types";

export default function stampTransitiveHashOnNodes<T extends ProcessedFileInfo>(
    component: ComponentWithTransitiveHash, 
    includedNodeIds: string[], 
    graph: GraphWithTransitiveHash<T>, 
    getCacheFile: CacheLoader) {
    for (const nodeId of component.nodes) {
        const node = graph[nodeId];
        node.transitiveClosure = includedNodeIds;
        node.transitiveHash = component.transitiveHash;

        // write file hash/dependency info to disk
        let { metadata } = getCacheFile(node.filePath);
        Object.assign(metadata.get(), {
            transitiveHash: node.transitiveHash,
            transitiveClosure: node.transitiveClosure
        });
        metadata.commit();
    }
}