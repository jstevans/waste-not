import * as readFileSync from "../lib/wrappers/readFileSync";
import * as babelParse from "../lib/wrappers/babelParse";
import { Options, TsConfig, PathAliasInfo } from "../lib/types";
import { file, program } from "@babel/types";
import * as walkFile from "../../walker/lib/walkFile";
import * as callCabinet from "../lib/resolveDependency";
import getDependencies from "../lib/getDependenciesForFile";
import visitors from "../../visitors/lib/visitors";
import { WalkerState } from "../../walker/lib/types";
import * as getTsConfig from "../lib/getTsConfig";
import * as getWildcardPathAliases from "../lib/getWildcardPathAliases";
import * as getMatchedStrings from "../lib/utilities/getMatchedStrings";
import {
  buildDependenciesBag,
  buildDependenciesBagWarningsOnly,
} from "../lib/utilities/buildDependenciesBag";

type CallInfo = {
  fnName: string;
  args: any[];
};
function makeTestUtils(calls: CallInfo[]) {
  function makeLoggingMock<
    F extends (...args: any[]) => any,
    R extends ReturnType<F>
  >(fnName: string, retValue: R) {
    return function addCallInfo(...args: Parameters<F>): R {
      calls.push({
        fnName,
        args,
      });
      return retValue;
    };
  }

  return {
    makeLoggingMock,
  };
}

describe("getDependenciesForFile", () => {
  let testFilePath = "./file";
  let testAllFiles = {};
  let testOptions: Options = {
    baseDirectory: "./",
  };

  let mockTsConfig: TsConfig = { baseUrl: ".", paths: {} };
  let mockFileContents = "fileContents";
  let mockAst = file(program([]), null, null);
  let mockWalkFileState: WalkerState = {
    fileDependencies: ["foo", "bar"],
    wildcardDependencies: ["test*"],
    nativeDependencies: ["fs"],
    warnings: [],
  };

  let mockResolvedAlias = "TEST";
  let mockResolvedWildcardAlias: PathAliasInfo = {
    original: ["TEST"],
    aliases: [],
  };

  let mockResolvedWildcardPaths: string[] = [];

  let mockResolver: typeof callCabinet.default;

  let calls: CallInfo[];
  beforeEach(() => {
    calls = [];
    let { makeLoggingMock } = makeTestUtils(calls);
    jest
      .spyOn(getTsConfig, "default")
      .mockImplementation(makeLoggingMock("getTsConfig", mockTsConfig));
    jest
      .spyOn(readFileSync, "default")
      .mockImplementation(makeLoggingMock("readFileSync", mockFileContents));
    jest
      .spyOn(babelParse, "default")
      .mockImplementation(makeLoggingMock("parse", mockAst));
    jest
      .spyOn(walkFile, "default")
      .mockImplementation(makeLoggingMock("walkFile", mockWalkFileState));
    jest
      .spyOn(callCabinet, "default")
      .mockImplementation(makeLoggingMock("callCabinet", mockResolvedAlias));
    jest
      .spyOn(getWildcardPathAliases, "default")
      .mockImplementation(
        makeLoggingMock("getWildcardPathAliases", mockResolvedWildcardAlias)
      );
    jest
      .spyOn(getMatchedStrings, "default")
      .mockImplementation(
        makeLoggingMock("getMatchedStrings", mockResolvedWildcardPaths)
      );
    mockResolver = jest.fn(makeLoggingMock("mockResolver", mockResolvedAlias));
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("0.1) returns an exception bag if a new exception is thrown", () => {
    jest.spyOn(getTsConfig, "default").mockImplementationOnce(() => {
      throw "myError";
    });
    let result = getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(result).toEqual({
      ...buildDependenciesBag(testFilePath),
      details: "myError",
      issue: new Error("myError"),
    });
  });

  it("0.2) returns an exception bag if a native exception is thrown", () => {
    jest.spyOn(getTsConfig, "default").mockImplementationOnce(() => {
      return (undefined as any)[0];
    });
    const result = getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(result).toEqual({
      ...buildDependenciesBag(testFilePath),
      details: new TypeError("Cannot read property '0' of undefined"),
      issue: new TypeError("Cannot read property '0' of undefined"),
    });
  });

  it("0.3) returns an exception bag if an unknown exception is thrown", () => {
    jest.spyOn(getTsConfig, "default").mockImplementationOnce(() => {
      throw undefined;
    });
    let result = getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(result).toEqual({
      ...buildDependenciesBag(testFilePath),
      details: undefined,
      issue: new Error("Unknown issue occurred."),
    });
  });

  it("1) calls getTsConfig", () => {
    getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(calls[0]).toEqual({
      fnName: "getTsConfig",
      args: [testOptions],
    });
  });

  it("2) calls readFileSync", () => {
    getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(calls[1]).toEqual({
      fnName: "readFileSync",
      args: [testFilePath, "utf8"],
    });
  });

  it("3) calls babelParser", () => {
    getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(calls[2]).toEqual({
      fnName: "parse",
      args: [testFilePath, "fileContents"],
    });
  });

  it("3.1) returns a warning if no AST comes back from babelParser", () => {
    const results = getDependencies(testAllFiles, testOptions, {
      parse: () => {},
    } as any)(testFilePath);
    expect(results).toEqual({
      filePath: testFilePath,
      dependencies: [],
      nativeDependencies: [],
      wildcardAliasDependencies: [],
      wildcardFileDependencies: [],
      warnings: [`Failed to parse file ${testFilePath}`],
    });
  });

  it("4) calls walkFile", () => {
    getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(calls[3]).toEqual({
      fnName: "walkFile",
      args: [
        mockAst,
        visitors,
        {
          fileDependencies: [],
          wildcardDependencies: [],
          nativeDependencies: [],
          warnings: [],
        },
      ],
    });
  });

  describe("4a) when there are no fileDependencies or wildcardDependencies...", () => {
    let tmpFileDependencies = mockWalkFileState.fileDependencies;
    let tmpWildcardDependencies = mockWalkFileState.wildcardDependencies;
    beforeAll(() => {
      mockWalkFileState.fileDependencies = [];
      mockWalkFileState.wildcardDependencies = [];
    });
    afterAll(() => {
      mockWalkFileState.fileDependencies = tmpFileDependencies;
      mockWalkFileState.wildcardDependencies = tmpWildcardDependencies;
    });
    it("doesn't call callCabinet", () => {
      getDependencies(testAllFiles, testOptions)(testFilePath);
      expect(calls[4]).toBeUndefined();
    });
  });

  describe("4b) when there are fileDependencies", () => {
    it("calls callCabinet on each element by default", () => {
      getDependencies(testAllFiles, testOptions)(testFilePath);
      expect(calls[4]).toEqual({
        fnName: "callCabinet",
        args: [
          mockAst,
          mockWalkFileState.fileDependencies[0],
          testFilePath,
          testOptions,
        ],
      });

      expect(calls[5]).toEqual({
        fnName: "callCabinet",
        args: [
          mockAst,
          mockWalkFileState.fileDependencies[1],
          testFilePath,
          testOptions,
        ],
      });
    });

    it("calls the passed resolver on each element", () => {
      getDependencies(testAllFiles, testOptions, { resolver: mockResolver })(
        testFilePath
      );
      expect(calls[4]).toEqual({
        fnName: "mockResolver",
        args: [
          mockAst,
          mockWalkFileState.fileDependencies[0],
          testFilePath,
          testOptions,
        ],
      });

      expect(calls[5]).toEqual({
        fnName: "mockResolver",
        args: [
          mockAst,
          mockWalkFileState.fileDependencies[1],
          testFilePath,
          testOptions,
        ],
      });
    });

    it("converts unresolvable files to warnings", () => {
      const result = getDependencies(testAllFiles, testOptions, {
        resolver: () => "",
      })(testFilePath);
      expect(result).toEqual({
        ...buildDependenciesBagWarningsOnly(testFilePath, [
          `Failed to resolve dependency 'foo' in file '${testFilePath}'`,
          `Failed to resolve dependency 'bar' in file '${testFilePath}'`,
        ]),
        nativeDependencies: ["fs"],
        wildcardAliasDependencies: [{ aliases: [], original: ["TEST"] }],
      });
    });
  });

  describe("5) when there are wildcardDependencies", () => {
    it("(a) calls getWildcardPathAliases on each element by default", () => {
      getDependencies(testAllFiles, testOptions)(testFilePath);
      expect(calls[6]).toEqual({
        fnName: "getWildcardPathAliases",
        args: [
          mockWalkFileState.wildcardDependencies[0],
          testFilePath,
          testOptions.baseDirectory,
          mockTsConfig,
        ],
      });
    });

    it("(b) calls getWildcardPaths on each element by default", () => {
      getDependencies(testAllFiles, testOptions)(testFilePath);
      expect(calls[7]).toEqual({
        fnName: "getMatchedStrings",
        args: [Object.keys(testAllFiles), [mockResolvedAlias]],
      });
    });
  });

  it("6) returns the alias-mapped results of walkFile", () => {
    const result = getDependencies(testAllFiles, testOptions)(testFilePath);
    expect(result).toEqual({
      filePath: testFilePath,
      dependencies: [mockResolvedAlias, mockResolvedAlias],
      wildcardFileDependencies: [],
      wildcardAliasDependencies: [mockResolvedWildcardAlias],
      nativeDependencies: mockWalkFileState.nativeDependencies,
      warnings: [],
    });
  });
});
