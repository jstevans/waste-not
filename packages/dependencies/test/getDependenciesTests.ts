import * as readFileSync from "../lib/wrappers/readFileSync";
import * as babelParser from "@babel/parser";
import { Options } from "../lib/types";
import { file, program } from "@babel/types";
import * as walkFile from "../../walker/lib/walkFile";
import * as callCabinet from "../lib/callCabinet";
import getDependencies from "../lib/getDependencies";
import babelParserOptions from "../lib/constants/babelParser";
import visitors from "../../visitors/lib/visitors";

type CallInfo = {
    fnName: string,
    args: any[]
}
function makeTestUtils(calls: CallInfo[]) {
    function makeLoggingMock<F extends (...args: any[]) => any, R extends ReturnType<F>>(fnName: string, retValue: R) {
        return function addCallInfo(...args: Parameters<F>): R {
            calls.push({
                fnName,
                args,
            });
            return retValue;
        }
    }

    return {
        makeLoggingMock
    };
}

describe("getDependencies", () => {
    let testFilePath = "./file";
    let testOptions: Options = {} as any;
    let mockFileContents = "fileContents";
    let mockAst = file(program([]), null, null);
    let mockWalkFileState = { fileDependencies: ["foo", "bar"] as string[], warnings: [] as string[] };
    let mockResolvedAlias = "TEST";

    let mockResolver: typeof callCabinet.default;


    let calls: CallInfo[];
    beforeEach(() => {
        calls = [];
        let { makeLoggingMock } = makeTestUtils(calls);
        jest.spyOn(readFileSync, "default").mockImplementation(makeLoggingMock("readFileSync", mockFileContents));
        jest.spyOn(babelParser, "parse").mockImplementation(makeLoggingMock("parse", mockAst));
        jest.spyOn(walkFile, "default").mockImplementation(makeLoggingMock("walkFile", mockWalkFileState));
        jest.spyOn(callCabinet, "default").mockImplementation(makeLoggingMock("callCabinet", mockResolvedAlias));
        mockResolver = jest.fn(makeLoggingMock("mockResolver", mockResolvedAlias));
    })

    it("1) calls readFileSync", () => {
        getDependencies(testFilePath);
        expect(calls[0]).toEqual({
            fnName: "readFileSync",
            args: [testFilePath, "utf8"]
        })
    })

    it("2) calls babelParser", () => {
        getDependencies(testFilePath);
        expect(calls[1]).toEqual({
            fnName: "parse",
            args: ["fileContents", babelParserOptions]
        })
    })

    it("3) calls walkFile", () => {
        getDependencies(testFilePath);
        expect(calls[2]).toEqual({
            fnName: "walkFile",
            args: [mockAst, visitors]
        })
    })

    describe("4a) when there are no fileDependencies...", () => {
        let tmpFileDependencies = mockWalkFileState.fileDependencies;
        beforeAll(() => {
            mockWalkFileState.fileDependencies = []
        })
        afterAll(() => {
            mockWalkFileState.fileDependencies = tmpFileDependencies;
        })
        it("doesn't call callCabinet", () => {
            getDependencies(testFilePath);
            expect(calls[3]).toBeUndefined();
        })
    })

    describe("4b) when there are fileDependencies...", () => {
        it("calls callCabinet on each element by default", () => {
            getDependencies(testFilePath, testOptions);
            expect(calls[3]).toEqual({
                fnName: "callCabinet",
                args: [mockAst, mockWalkFileState.fileDependencies[0], testFilePath, testOptions]
            });

            expect(calls[4]).toEqual({
                fnName: "callCabinet",
                args: [mockAst, mockWalkFileState.fileDependencies[1], testFilePath, testOptions]
            });
        })

        it("calls the passed resolver on each element", () => {
            getDependencies(testFilePath, testOptions, mockResolver);
            expect(calls[3]).toEqual({
                fnName: "mockResolver",
                args: [mockAst, mockWalkFileState.fileDependencies[0], testFilePath, testOptions]
            });

            expect(calls[4]).toEqual({
                fnName: "mockResolver",
                args: [mockAst, mockWalkFileState.fileDependencies[1], testFilePath, testOptions]
            });
        })
    })

    it("5) returns the alias-mapped results of walkFile", () => {
        let results = getDependencies(testFilePath, testOptions);
        expect(results).toEqual({
            fileDependencies: [mockResolvedAlias, mockResolvedAlias],
            warnings: []
        })
    })
})