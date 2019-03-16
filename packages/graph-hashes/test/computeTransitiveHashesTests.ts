import * as getHashesFromNodes from '../lib/utilities/getHashesFromNodes';
import * as getNodesInComponentTransitiveClosure from '../lib/utilities/getNodesInComponentTransitiveClosure';
import * as makeHash from '../lib/utilities/makeHash';
import * as stampTransitiveHashOnNodes from '../lib/stampTransitiveHashOnNodes';
import computeTransitiveHashes from '../lib/computeTransitiveHashes';


describe("computeTransitiveHashes", () => {
    let mockGraphAndComponents: any;
    let makeHashSpy = jest.spyOn(makeHash, 'default');
    makeHashSpy.mockImplementation((algorithm, data) => {
        return data.join();
    });
    let stampTransitiveHashOnNodesSpy = jest.spyOn(stampTransitiveHashOnNodes, 'default');
    beforeEach(() => {
        jest.clearAllMocks();

        mockGraphAndComponents = {
            components: {
                '1': {
                    transitiveClosure: ['1', '2', '4'],
                    nodes: ['a', '2', 'testFile']
                },
                '2': {
                    transitiveClosure: ['2'],
                    nodes: ['b']
                },
                '3': {
                    transitiveClosure: ['3', '2'],
                    nodes: ['3', 'd']
                },
                '4': {
                    transitiveClosure: ['4'],
                    nodes: ['1']
                },
            },
            graph: {
                '1': {
                },
                '2': {},
                '3': {},
                'a': {},
                'b': {},
                'notIncluded': {},
                'd': {},
                'testFile': {}
            }
        }

        for (const [nodeId, node] of Object.entries(mockGraphAndComponents.graph)) {
            (node as any).hash = nodeId;
        }
    });

    describe("calls getNodesInComponentTransitiveClosure", () => {
        let getNodesInComponentTransitiveClosureSpy = jest.spyOn(getNodesInComponentTransitiveClosure, 'default');

        it("once for each component", () => {
            computeTransitiveHashes(mockGraphAndComponents, 'sha512');
            expect(getNodesInComponentTransitiveClosure.default).toBeCalledTimes(4);
        })

        afterAll(() => {
            getNodesInComponentTransitiveClosureSpy.mockRestore();
        })
    })

    describe("calls getHashesFromNodes", () => {
        let getHashesFromNodesSpy = jest.spyOn(getHashesFromNodes, 'default');

        it("once for each component", () => {
            computeTransitiveHashes(mockGraphAndComponents, 'sha512');
            expect(getHashesFromNodes.default).toBeCalledTimes(4);
        })

        it("with the nodeIds returned from getNodesInComponentTransitiveClosure", () => {
            let getNodesInComponentTransitiveClosureSpy = jest.spyOn(getNodesInComponentTransitiveClosure, 'default');

            let expectedValues: any[][] = [];

            getNodesInComponentTransitiveClosureSpy.mockImplementation((component, allComponents) => {
                expectedValues.push(component.nodes);
                return component.nodes;
            });
            
            computeTransitiveHashes(mockGraphAndComponents, 'sha512');

            for(let i in expectedValues) {
                expect(getHashesFromNodesSpy.mock.calls[i]).toEqual([expectedValues[i], mockGraphAndComponents.graph]);
            }

            getNodesInComponentTransitiveClosureSpy.mockRestore();
        })

        afterAll(() => {
            getHashesFromNodesSpy.mockRestore();
        })
    })

    describe("calls makeHash", () => {
        it("with the passed hashAlgorithm", () => {
            computeTransitiveHashes(mockGraphAndComponents, 'hashAlgorithm');
            for (let [hashAlgorithm] of makeHashSpy.mock.calls) {
                expect(hashAlgorithm).toEqual('hashAlgorithm');
            }
        })

        it("once for each component", () => {
            computeTransitiveHashes(mockGraphAndComponents, 'sha512');
            expect(makeHash.default).toBeCalledTimes(4);
        })

        it("with each component's transitive closure as its contents", () => {
            computeTransitiveHashes(mockGraphAndComponents, 'sha512');
            for (let i = 0; i < makeHashSpy.mock.calls.length; i++) {
                const [, hashData] = makeHashSpy.mock.calls[i];

                for (let sccId of mockGraphAndComponents.components[i + 1].transitiveClosure) {
                    for (let nodeId of mockGraphAndComponents.components[sccId].nodes) {
                        expect(hashData).toContain(nodeId);
                    }
                }
            }
        })

        it("with the data in lexical order", () => {
            computeTransitiveHashes(mockGraphAndComponents, 'sha512');
            for (let [, hashData] of makeHashSpy.mock.calls) {
                let expectedHashData = JSON.parse(JSON.stringify(hashData)).sort();
                expect(hashData).toEqual(expectedHashData);
            }
        })
    })
})