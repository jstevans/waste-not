import getDependenciesForPackage from "../lib/getDependenciesForPackage";
import { buildDependenciesBagWarningsOnly } from "../lib/utilities/buildDependenciesBag";
import * as readFileSync from "../lib/wrappers/readFileSync";
import * as resolve from "resolve";
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

describe("getDependenciesForPackage", () => {
  describe("configure", () => {
    it("returns the getDependenciesForPackage function", () => {
      const getDeps = getDependenciesForPackage(null as any, null as any);
      expect(typeof getDeps).toEqual("function");
    });
  });

  it("returns early if the passed object isn't of type 'package'", () => {
    const result = getDependenciesForPackage(
      null as any,
      null as any
    )({ type: "foo", basePath: "testPkg" } as any);
    expect(result).toEqual({
      ...buildDependenciesBagWarningsOnly("testPkg", [
        "Invalid type of FileGroup: 'testPkg' has type 'foo'. Expected type 'package'.",
      ]),
    });
  });

  it("returns early if there are no package.json files", () => {
    const result = getDependenciesForPackage(
      null as any,
      null as any
    )({ type: "package", basePath: "testPkg", filePaths: [] });

    expect(result).toEqual({
      ...buildDependenciesBagWarningsOnly("testPkg", [
        "No package.json for FileGroup: 'testPkg' does not have a package.json, so no dependencies were extracted.",
      ]),
    });
  });

  it("reads all package.json files and emits dependencies", () => {
    jest
      .spyOn(readFileSync, "default")
      .mockReturnValueOnce(
        '{"dependencies": {"1dep": "1"}, "optionalDependencies": {"1opt": "1"}, "peerDependencies": {"1peer": "1"}}'
      )
      .mockReturnValueOnce(
        '{"dependencies": {"2dep": "2"}, "peerDependencies": {"2peer": "2"}}'
      )
      .mockReturnValueOnce('{"optionalDependencies": {"3opt": "3"}}');

    const result = getDependenciesForPackage(null as any, null as any, {
      packageResolver: (a) => a,
    })({
      type: "package",
      basePath: "testPkg",
      filePaths: ["package.json", "foo/package.json", "bar/package.json"],
    });

    expect(result).toEqual({
      ...buildDependenciesBagWarningsOnly("testPkg", []),
      dependencies: ["1dep", "1opt", "1peer", "2dep", "2peer", "3opt"],
    });
  });
});
