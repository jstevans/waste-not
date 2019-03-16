import getHashesFromNodes from "../lib/utilities/getHashesFromNodes";

describe("getHashesFromNodes", () => {
    it("gets hashes from a list of nodes", () => {
        let nodeIds = ['a', '3', '9', 'bb', 'b'];
        let nodeHashes = nodeIds.map(id => id.concat('hash'));
        let mockGraph = nodeHashes.reduce((acc, hash, i) => ({...acc, [nodeIds[i]]: { hash } }), {});
        let result = getHashesFromNodes(nodeIds, mockGraph);

        for(let index in nodeHashes.sort()) {
            expect(result[index]).toEqual(nodeHashes[index]);
        }
    })
})