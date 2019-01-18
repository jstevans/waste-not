import * as walker from '../src/walker';
import * as walkNode from '../src/walkNode';
import {
    emptyStatement,
    file,
    Program,
    program,
    Statement,
    blockStatement,
    BaseNode
} from '@babel/types';

const makeMockFile = (...expressions: Statement[]) =>
    file(program(expressions), null, null);

describe("walkFile", () => {
    describe("safety checks", () => {
        it("throws if a File is not provided as its first argument", () => {
            expect(walker.getDependencies).toThrow();
        })

        it("throws if the File has no Program", () => {
            expect(() => walker.getDependencies({} as any, null as any)).toThrow();
        })

        it("throws if the File's Program has no body", () => {
            const mockFile = file({ type: 'Program' } as Program, null, null);
            expect(() => walker.getDependencies(mockFile, null as any)).toThrow();
        })

        it("throws if VisitorMap is null", () => {
            const mockFile = makeMockFile();
            expect(() => walker.getDependencies(mockFile, null as any)).toThrow();
        })

        it("throws if VisitorMap is not an object", () => {
            const mockFile = makeMockFile();
            expect(() => walker.getDependencies(mockFile, 3 as any)).toThrow();
        })
    });

    it("calls walkNode on every statement in the Program's body", () => {
        const mockFile = makeMockFile(emptyStatement(), emptyStatement());

        const callArgs: any[] = [];
        jest.spyOn(walkNode, 'default').mockImplementation((...args) => {
            callArgs.push([...args]);
        });

        walker.getDependencies(mockFile, {});

        expect(walkNode.default).toBeCalledTimes(2);
        expect(callArgs[0][0]).toBe(mockFile.program.body[0]);
        expect(callArgs[1][0]).toBe(mockFile.program.body[1]);
    })

    it("correctly passes the VisitorMap to walkNode", () => {
        const mockFile = makeMockFile(emptyStatement());
        let visitorsArg;
        jest.spyOn(walkNode, 'default').mockImplementation((node, visitors, state) => {
            visitorsArg = visitors;
        });

        const visitorMap = {};
        walker.getDependencies(mockFile, visitorMap);

        expect(visitorsArg).toBe(visitorMap);
    })

    it("correctly returns the final state of the 'state' object that it passes to walkNode", () => {
        const mockFile = makeMockFile(emptyStatement(), emptyStatement());
        let callCount = 0;
        jest.spyOn(walkNode, 'default').mockImplementation((node, visitors, state) => {
            state.test = (state.test || []).concat(callCount++);
        });

        const result = walker.getDependencies(mockFile, {});

        expect(result).toEqual(
            {
                test: [0, 1]
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
        });

        walker.getDependencies(mockFile, {});

        expect(visitedNodes).toEqual(mockStatements);
    })
})