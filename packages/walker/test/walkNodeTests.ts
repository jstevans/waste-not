import walkNode from "../lib/walkNode";
import { blockStatement, emptyStatement, identifier } from "@babel/types";

describe("walkNode", () => {
    describe("safety checks", () => {
        it("returns null if called on a null node", () => {
            const result = walkNode(null as any, null as any, null);
            expect(result === null).toBeTruthy();
        })
    })

    it("calls the right visitor", () => {
        let mockVisitor = jest.fn();
        walkNode({ type: 'test' } as any, { 'test': [mockVisitor] } as any, null);

        expect(mockVisitor).toBeCalledTimes(1);
    })

    it("returns child nodes", () => {
        let mockNode = blockStatement([
            blockStatement([
                emptyStatement()
            ]),
            emptyStatement()
        ])

        const result = walkNode(mockNode, {}, null);

        expect(result).toEqual(mockNode.body);
    })

    it("doesn't return undefined children", () => {
        let mockNode = identifier("test"); // "typeAnnotation" field is undefined
        const result = walkNode(mockNode, {}, null);
        expect(result).toHaveLength(0);
    })
})