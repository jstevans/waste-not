import getNodesInComponentTransitiveClosure from "../lib/utilities/getNodesInComponentTransitiveClosure";

describe("getNodesInComponentTransitiveClosure", () => {
    it("gets the IDs of the nodes in a component's transitive closure", () => {
        let components: any = {
            '1': {
                transitiveClosure: ['1', '4', '2'],
                nodes: ['a', '2']
            },
            '2': {
                nodes: ['b']
            },
            '3': {
                nodes: ['c', '4']
            },
            '4': {
                nodes: ['d']
            }
        }
        const result = getNodesInComponentTransitiveClosure(components['1'], components);

        const expectedNodes = ['a', '2', 'b', 'd'];

        expectedNodes.forEach(node => expect(result).toContain(node));

    })
})