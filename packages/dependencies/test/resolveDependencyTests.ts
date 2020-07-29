import { file, program } from "@babel/types";
import defaultResolver from "../lib/resolveDependency";
import * as cabinet from "../lib/wrappers/cabinet";

describe("resolveDependency", () => {
  let mockFile = file(program([]), null, null);
  let mockDependency = "dep";
  let mockFilePath = "filePath";

  let mockCabinetReturn = {};
  let calls: any[][];

  let mockOptions = {
    baseDirectory: "./",
  };

  beforeEach(() => {
    calls = [];
    spyOn(cabinet, "default").and.callFake(function () {
      calls.push([...arguments]);
      return mockCabinetReturn;
    });
  });

  it("calls cabinet with proper inputs", () => {
    defaultResolver(mockFile, mockDependency, mockFilePath, mockOptions);
    expect(calls.length).toBe(1);
    expect(calls[0]).toEqual([
      {
        partial: mockDependency,
        filename: mockFilePath,
        baseDirectory: mockOptions.baseDirectory,
        directory: "./",
        ast: mockFile,
      },
    ]);
  });

  it("returns the result of cabinet", () => {
    let result = defaultResolver(
      mockFile,
      mockDependency,
      mockFilePath,
      mockOptions
    );
    expect(result).toBe(mockCabinetReturn);
  });
});
