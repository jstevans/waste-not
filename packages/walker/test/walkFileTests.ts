import * as walkFile from '../lib/walkFile';
import * as walkNode from '../lib/walkNode';
import {
    emptyStatement,
    file,
    Program,
    program,
    Statement,
    BaseNode
} from '@babel/types';

const makeMockFile = (...expressions: Statement[]) =>
    file(program(expressions), null, null);

describe("walkFile", () => {
    describe("safety checks", () => {
        it("throws if a File is not provided as its first argument", () => {
            expect(walkFile.default).toThrow();
        })

        it("throws if the File has no Program", () => {
            expect(() => walkFile.default({} as any, null as any)).toThrow();
        })

        it("throws if the File's Program has no body", () => {
            const mockFile = file({ type: 'Program' } as Program, null, null);
            expect(() => walkFile.default(mockFile, null as any)).toThrow();
        })

        it("throws if VisitorMap is null", () => {
            const mockFile = makeMockFile();
            expect(() => walkFile.default(mockFile, null as any)).toThrow();
        })

        it("throws if VisitorMap is not an object", () => {
            const mockFile = makeMockFile();
            expect(() => walkFile.default(mockFile, 3 as any)).toThrow();
        })
    });

    it("calls walkNode on every statement in the Program's body", () => {
        const mockFile = makeMockFile(emptyStatement(), emptyStatement());

        const callArgs: any[] = [];
        jest.spyOn(walkNode, 'default').mockImplementation((...args) => {
            callArgs.push([...args]);
            return null;
        });

        walkFile.default(mockFile, {});

        expect(walkNode.default).toBeCalledTimes(2);
        expect(callArgs[0][0]).toBe(mockFile.program.body[0]);
        expect(callArgs[1][0]).toBe(mockFile.program.body[1]);
    })

    it("correctly passes the VisitorMap to walkNode", () => {
        const mockFile = makeMockFile(emptyStatement());
        let visitorsArg;
        jest.spyOn(walkNode, 'default').mockImplementation((node, visitors, state) => {
            visitorsArg = visitors;
            return null;
        });

        const visitorMap = {};
        walkFile.default(mockFile, visitorMap);

        expect(visitorsArg).toBe(visitorMap);
    })

    it("correctly returns the final state of the 'state' object that it passes to walkNode", () => {
        const mockFile = makeMockFile(emptyStatement(), emptyStatement());
        let callCount = 0;
        jest.spyOn(walkNode, 'default').mockImplementation((node, visitors, state) => {
            state.test = (state.test || []).concat(callCount++);
            return null;
        });

        const result = walkFile.default(mockFile, {});

        expect(result).toEqual(
            {
                test: [0, 1],
            }
        )
    })

    it("correctly walks children", () => {
        const mockStatements = [emptyStatement(), emptyStatement(), emptyStatement()];
        const mockFile = makeMockFile(mockStatements[0]);
        let visitedNodes: BaseNode[] = [];
        jest.spyOn(walkNode, 'default').mockImplementation((node, visitors, state) => {
            visitedNodes.push(node);
            if (visitedNodes.length < mockStatements.length) {
                return [mockStatements[visitedNodes.length]];
            }
            return null;
        });

        walkFile.default(mockFile, {});

        expect(visitedNodes).toEqual(mockStatements);
    })
})