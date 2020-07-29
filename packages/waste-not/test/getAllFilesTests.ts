import getAllFiles from "../lib/getAllFiles";

describe("getAllFiles", () => {
  it("returns an empty object when globby returns nothing", () => {
    expect(getAllFiles([], "package", () => [])).toStrictEqual({});
  });

  describe("nodeModuleResolution == 'package'", () => {
    const globbedFiles = [
      "foo.ts",
      "node_modules/foo/package.json",
      "node_modules/foo/index.js",
      "node_modules/foo/node_modules/@types/bar/package.json",
      "node_modules/bar/index.js",
    ];
    const globber = () => globbedFiles;
    it("foo", () => {
      let barGroup = {
        basePath: "node_modules/bar",
        filePaths: ["node_modules/bar/index.js"],
        type: "package",
      };
      let fooGroup = {
        basePath: "node_modules/foo",
        filePaths: [
          "node_modules/foo/package.json",
          "node_modules/foo/index.js",
        ],
        type: "package",
      };
      let fooBarGroup = {
        basePath: "node_modules/foo/node_modules/@types/bar",
        filePaths: ["node_modules/foo/node_modules/@types/bar/package.json"],
        type: "package",
      };
      expect(getAllFiles([], "package", globber)).toEqual({
        "foo.ts": "foo.ts",
        "node_modules/bar/index.js": barGroup,
        "node_modules/foo/package.json": fooGroup,
        "node_modules/foo/index.js": fooGroup,
        "node_modules/foo/node_modules/@types/bar/package.json": fooBarGroup,
      });
    });
  });
});
