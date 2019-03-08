import getStronglyConnectedComponents from "../lib/getStronglyConnectedComponents";

describe("getStronglyConnectedComponents", () => {
    let testGraph: { [key: string]: { dependencies: string[] } };

    beforeEach(() => {
        testGraph = {
            "z": { dependencies: ["a"] },
            "a": { dependencies: ["b"] },
            "b": { dependencies: ["a", "c"] },
            "c": { dependencies: [] },
            "d": { dependencies: ["a"] },
        };
    });

    describe("builds a graph that", () => {
        it("groups nodes correctly", () => {
            const result = getStronglyConnectedComponents(testGraph);

            const resultComponentNodes = Object.entries(result.components)
                .reduce((acc, e) => ({ ...acc, [e[0]]: e[1].nodes }), {});

            expect(resultComponentNodes).toEqual(
                {
                    0: ["z"],
                    1: ["b", "a"],
                    3: ["c"],
                    4: ["d"],
                }
            );
        })

        it("places the right component IDs on nodes", () => {
            const result = getStronglyConnectedComponents(testGraph);

            let resultGraphComponents = Object.entries(result.graph)
                .reduce((acc, e) => ({ ...acc, [e[0]]: e[1].componentIndex }), {});

            expect(resultGraphComponents).toEqual(
                {
                    a: 1,
                    b: 1,
                    c: 3,
                    d: 4,
                    z: 0,
                }
            )
        })

        it("generates component dependencies correctly", () => {
            const result = getStronglyConnectedComponents(testGraph);

            const resultComponentNodes = Object.entries(result.components)
                .reduce((acc, e) => ({ ...acc, [e[0]]: e[1].dependencies }), {});
            expect(resultComponentNodes).toEqual({
                0: ["1"],
                1: ["3"],
                3: [],
                4: ["1"],
            });
        })
    })

    it("toposorts the components in reverse order", () => {
        const result = getStronglyConnectedComponents(testGraph);
        expect(result.reverseToposort).toEqual(["3", "1", "0", "4"]);
    })
})
