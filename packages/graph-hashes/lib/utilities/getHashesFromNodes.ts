import { GraphWithComponentMapping } from "../../../dependency-graph/lib/getStronglyConnectedComponents";
import { ProcessedFileInfo } from "../processFile";

export default function getHashesFromNodes(nodeIds: string[], graph: GraphWithComponentMapping<ProcessedFileInfo>) {
    const includedHashes = nodeIds
        .map(nodeId => graph[nodeId].hash)
        .sort();

    return includedHashes;
}