import { StronglyConnectedComponents } from '../lib/getStronglyConnectedComponents';
import buildSccTransitiveClosure from '../lib/buildSccTransitiveClosure';
describe("buildSccTransitiveClosure", () => {
    let testComponents: StronglyConnectedComponents = {
        "0": {
            nodes: [],
            dependencies: []
        },
        "1": {
            nodes: [],
            dependencies: ["0"]
        },
        "2": {
            nodes: [],
            dependencies: []
        },
        "3": {
            nodes: [],
            dependencies: ["4", "1", "0"]
        },
        "4": {
            nodes: [],
            dependencies: ["1", "2"]
        },
    };

    // Each node must come after all nodes they depend on
    let testReverseToposort: string[] = [
        "0", "1", "2", "4", "3"
    ];
    let result = buildSccTransitiveClosure({
        graph: null as any,
        components: testComponents,
        reverseToposort: testReverseToposort
    });

    let expectedTransitiveClosures = {
        "0": ["0"],
        "1": ["1", "0"],
        "2": ["2"],
        "3": ["3", "4", "1", "0", "2"],
        "4": ["4", "1", "0", "2"]
    };

    for (let [sccId, expectedClosure] of Object.entries(expectedTransitiveClosures)) {
        it(`correctly builds the transitive closure w.r.t. component ${sccId}`, () => {
            expect(result.components[sccId]).toEqual({
                ...testComponents[sccId],
                transitiveClosure: expectedClosure
            });
        });
    }
})