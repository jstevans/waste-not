import { PackageResolver } from "./../lib/types";
import getDependenciesForPackage, {
  configureResolvePackage,
} from "../lib/getDependenciesForPackage";
import { buildDependenciesBagWarningsOnly } from "../lib/utilities/buildDependenciesBag";
import * as readFileSync from "../lib/wrappers/readFileSync";

describe("getDependenciesForPackage", () => {
  describe("configure", () => {
    it("returns the getDependenciesForPackage function", () => {
      const getDeps = getDependenciesForPackage(null as any, null as any);
      expect(typeof getDeps).toEqual("function");
    });
  });

  describe("resolvePackage", () => {
    it("throws an exception if it can't resolve the dependency", () => {
      expect(() => configureResolvePackage({})("testPkg")).toThrowError(
        "Could not resolve dependency 'testPkg' from 'unknown'"
      );
      expect(() =>
        configureResolvePackage({})("testPkg", { basedir: "foo" })
      ).toThrowError("Could not resolve dependency 'testPkg' from 'foo'");
    });

    it("finds a dependency if it exists", () => {
      expect(
        configureResolvePackage({
          "@testPkg/foo/package.json": "a",
          "node_modules/@testPkg/foo/package.json": "b",
          "node_modules/foo/node_modules/@testPkg/foo/package.json": "c",
        })("@testPkg/foo", { basedir: "node_modules/foo" })
      ).toEqual("node_modules/foo/node_modules/@testPkg/foo/package.json");
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
    const result = getDependenciesForPackage(null as any, null as any, {
      packageResolver: (a) => a,
    })({ type: "package", basePath: "testPkg", filePaths: [] });

    expect(result).toEqual({
      ...buildDependenciesBagWarningsOnly("testPkg", [
        "No package.json for FileGroup: 'testPkg' does not have a package.json, so no dependencies were extracted.",
      ]),
    });
  });

  it("reads the shortest package.json path and emits dependencies", () => {
    jest
      .spyOn(readFileSync, "default")
      .mockReturnValueOnce(
        '{"dependencies": {"1dep": "1"}, "optionalDependencies": {"1opt": "1"}, "peerDependencies": {"1peer": "1"}}'
      );

    const result = getDependenciesForPackage(null as any, null as any, {
      packageResolver: (a) => a,
    })({
      type: "package",
      basePath: "testPkg",
      filePaths: ["foo/package.json", "package.json", "bar/package.json"],
    });

    expect(result).toEqual({
      ...buildDependenciesBagWarningsOnly("package.json", []),
      dependencies: ["1dep", "1opt", "1peer"],
    });
  });

  it("reads the shortest package.json path and emits an empty array when there are no dependencies", () => {
    jest.spyOn(readFileSync, "default").mockReturnValueOnce("{}");

    const result = getDependenciesForPackage(null as any, null as any, {
      packageResolver: (a) => a,
    })({
      type: "package",
      basePath: "testPkg",
      filePaths: ["foo/package.json", "package.json", "bar/package.json"],
    });

    expect(result).toEqual({
      ...buildDependenciesBagWarningsOnly("package.json", []),
      dependencies: [],
    });
  });
});
