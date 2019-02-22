import * as readFileSync from "../lib/wrappers/readFileSync";
import * as babelParser from "@babel/parser";
import { Options, TsConfig, PathAliasInfo } from "../lib/types";
import { file, program } from "@babel/types";
import * as walkFile from "../../walker/lib/walkFile";
import * as callCabinet from "../lib/callCabinet";
import getDependencies from "../lib/getDependencies";
import babelParserOptions from "../lib/constants/babelParser";
import visitors from "../../visitors/lib/visitors";
import { WalkerState } from "../../walker/lib/types";
import * as getTsConfig from "../lib/getTsConfig";
import * as getWildcardPathAliases from "../lib/getWildcardPathAliases";

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
    let testOptions: Options = {
        directory: "./",
    };

    let mockTsConfig: TsConfig = {baseUrl: ".", paths: {}};
    let mockFileContents = "fileContents";
    let mockAst = file(program([]), null, null);
    let mockWalkFileState: WalkerState = { 
        fileDependencies: ["foo", "bar"], 
        wildcardDependencies: ["test*"],
        nativeDependencies: ["fs"],
        warnings: [] 
    };
    let mockResolvedAlias = "TEST";
    let mockResolvedWildcardAlias: PathAliasInfo = {
        original: "TEST",
        aliases: []
    };

    let mockResolver: typeof callCabinet.default;


    let calls: CallInfo[];
    beforeEach(() => {
        calls = [];
        let { makeLoggingMock } = makeTestUtils(calls);
        jest.spyOn(getTsConfig, "default").mockImplementation(makeLoggingMock("getTsConfig", mockTsConfig));
        jest.spyOn(readFileSync, "default").mockImplementation(makeLoggingMock("readFileSync", mockFileContents));
        jest.spyOn(babelParser, "parse").mockImplementation(makeLoggingMock("parse", mockAst));
        jest.spyOn(walkFile, "default").mockImplementation(makeLoggingMock("walkFile", mockWalkFileState));
        jest.spyOn(callCabinet, "default").mockImplementation(makeLoggingMock("callCabinet", mockResolvedAlias));
        jest.spyOn(getWildcardPathAliases, "default").mockImplementation(makeLoggingMock("getWildcardPathAliases", mockResolvedWildcardAlias));
        mockResolver = jest.fn(makeLoggingMock("mockResolver", mockResolvedAlias));
    })

    it("1) calls getTsConfig", () => {
        getDependencies(testOptions)(testFilePath);
        expect(calls[0]).toEqual({
            fnName: "getTsConfig",
            args: [testOptions]
        })
    })

    it("2) calls readFileSync", () => {
        getDependencies()(testFilePath);
        expect(calls[1]).toEqual({
            fnName: "readFileSync",
            args: [testFilePath, "utf8"]
        })
    })

    it("3) calls babelParser", () => {
        getDependencies()(testFilePath);
        expect(calls[2]).toEqual({
            fnName: "parse",
            args: ["fileContents", babelParserOptions]
        })
    })

    it("4) calls walkFile", () => {
        getDependencies()(testFilePath);
        expect(calls[3]).toEqual({
            fnName: "walkFile",
            args: [mockAst, visitors]
        })
    })

    describe("4a) when there are no fileDependencies or wildcardDependencies...", () => {
        let tmpFileDependencies = mockWalkFileState.fileDependencies;
        let tmpWildcardDependencies = mockWalkFileState.wildcardDependencies;
        beforeAll(() => {
            mockWalkFileState.fileDependencies = []
            mockWalkFileState.wildcardDependencies = []
        })
        afterAll(() => {
            mockWalkFileState.fileDependencies = tmpFileDependencies;
            mockWalkFileState.wildcardDependencies = tmpWildcardDependencies;
        })
        it("doesn't call callCabinet", () => {
            getDependencies()(testFilePath);
            expect(calls[4]).toBeUndefined();
        })
    })

    describe("4b) when there are fileDependencies", () => {
        it("calls callCabinet on each element by default", () => {
            getDependencies(testOptions)(testFilePath);
            expect(calls[4]).toEqual({
                fnName: "callCabinet",
                args: [mockAst, mockWalkFileState.fileDependencies[0], testFilePath, testOptions]
            });

            expect(calls[5]).toEqual({
                fnName: "callCabinet",
                args: [mockAst, mockWalkFileState.fileDependencies[1], testFilePath, testOptions]
            });
        })

        it("calls the passed resolver on each element", () => {
            getDependencies(testOptions, mockResolver)(testFilePath);
            expect(calls[4]).toEqual({
                fnName: "mockResolver",
                args: [mockAst, mockWalkFileState.fileDependencies[0], testFilePath, testOptions]
            });

            expect(calls[5]).toEqual({
                fnName: "mockResolver",
                args: [mockAst, mockWalkFileState.fileDependencies[1], testFilePath, testOptions]
            });
        })
    })

    describe("5) when there are wildcardDependencies", () => {
        it("calls getWildcardPathAliases on each element by default", () => {
            getDependencies(testOptions)(testFilePath);
            expect(calls[6]).toEqual({
                fnName: "getWildcardPathAliases",
                args: [mockWalkFileState.wildcardDependencies[0], testFilePath, mockTsConfig]
            });
        })
    })

    it("6) returns the alias-mapped results of walkFile", () => {
        let results = getDependencies(testOptions)(testFilePath);
        expect(results).toEqual({
            filePath: testFilePath,
            fileDependencies: [mockResolvedAlias, mockResolvedAlias],
            wildcardDependencies: [mockResolvedWildcardAlias],
            nativeDependencies: mockWalkFileState.nativeDependencies,
            warnings: []
        })
    })
})