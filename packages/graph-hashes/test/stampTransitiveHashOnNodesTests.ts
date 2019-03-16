import stampTransitiveHashOnNodes from "../lib/stampTransitiveHashOnNodes";
import { ComponentWithTransitiveHash, GraphWithTransitiveHash } from "../lib/computeTransitiveHashes";
import { ProcessedFileInfo } from "../lib/processFile";

describe("stampTransitiveHashOnNodes", () => {
    let mockComponent: ComponentWithTransitiveHash;
    let mockIncludedIds: string[];
    let mockGraph: GraphWithTransitiveHash<ProcessedFileInfo>;
    beforeEach(() => {
        mockComponent = {
            nodes: ['a', 'c', 'testNode100'],
            dependencies: [],
            transitiveClosure: [],
            transitiveHash: "transitiveHash1"
        };
        mockIncludedIds = ['a', 'c', 'testNode100', 'd', 'nonExistingNode'];
        mockGraph = {
            'a': {},
            'c': {},
            'd': {},
            'testNode100': {},
            'unreferencedNode': {},
        } as any;
    })
    
    it("stamps the passed component's transitiveHash on all of the component's nodes", () => {
        stampTransitiveHashOnNodes(mockComponent, mockIncludedIds, mockGraph);
        mockComponent.nodes.forEach(nodeId => {
            expect(mockGraph[nodeId].transitiveClosure).toEqual(mockIncludedIds);
            expect(mockGraph[nodeId].transitiveHash).toEqual(mockComponent.transitiveHash);
        });
    })

    it("doesn't touch nodes that aren't part of the passed component", () => {
        stampTransitiveHashOnNodes(mockComponent, mockIncludedIds, mockGraph);
        Object.keys(mockGraph).filter(nodeId => mockComponent.nodes.indexOf(nodeId) == -1).forEach(nodeId => {
            expect(mockGraph[nodeId].transitiveHash).toBeFalsy();
            expect(mockGraph[nodeId].transitiveClosure).toBeFalsy();
        })
    })
})