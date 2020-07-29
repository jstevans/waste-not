import configureGetDependencies from "../lib/getDependencies";
import * as getDependenciesForFile from "../lib/getDependenciesForFile";
import * as getDependenciesForPackage from "../lib/getDependenciesForPackage";

describe("configureGetDependencies", () => {
  it("returns the function getDependencies", () => {
    jest.spyOn(getDependenciesForFile, "default").mockImplementation();
    jest.spyOn(getDependenciesForPackage, "default").mockImplementation();
    const getDependencies = configureGetDependencies({}, null as any);
    expect(typeof getDependencies).toEqual("function");

    jest.restoreAllMocks();
  });

  it("passes the proper options to configureGetDependenciesForFile and configureGetDependenciesForPackage", () => {
    const configureGetDepsForFileSpy = jest
      .spyOn(getDependenciesForFile, "default")
      .mockImplementation();
    const configureGetDepsForPkgSpy = jest
      .spyOn(getDependenciesForPackage, "default")
      .mockImplementation();
    const allFiles: any = {};
    const options: any = {};
    const overrides: any = {};
    configureGetDependencies(allFiles, options, overrides);
    expect(configureGetDepsForFileSpy).toHaveBeenCalledTimes(1);
    expect(configureGetDepsForFileSpy).toHaveBeenCalledWith(
      allFiles,
      options,
      overrides
    );
    expect(configureGetDepsForPkgSpy).toHaveBeenCalledTimes(1);
    expect(configureGetDepsForPkgSpy).toHaveBeenCalledWith(
      allFiles,
      options,
      overrides
    );

    jest.restoreAllMocks();
  });

  describe("getDependencies", () => {
    it("calls getDependenciesForFile when passed a string", () => {
      const getDepsForFileMock = jest.fn();
      const getDepsForPkgMock = jest.fn();
      jest
        .spyOn(getDependenciesForFile, "default")
        .mockReturnValue(getDepsForFileMock);
      jest
        .spyOn(getDependenciesForPackage, "default")
        .mockReturnValue(getDepsForPkgMock);
      const getDependencies = configureGetDependencies({} as any, {} as any);

      getDependencies("foo");

      expect(getDepsForFileMock).toHaveBeenCalledTimes(1);
      expect(getDepsForPkgMock).not.toHaveBeenCalled();
      expect(getDepsForFileMock).toHaveBeenCalledWith("foo", undefined);
    });

    it("calls getDependenciesForPackage when passed an object", () => {
      const getDepsForFileMock = jest.fn();
      const getDepsForPkgMock = jest.fn();
      jest
        .spyOn(getDependenciesForFile, "default")
        .mockReturnValue(getDepsForFileMock);
      jest
        .spyOn(getDependenciesForPackage, "default")
        .mockReturnValue(getDepsForPkgMock);
      const getDependencies = configureGetDependencies({} as any, {} as any);

      getDependencies({} as any);

      expect(getDepsForFileMock).not.toHaveBeenCalled();
      expect(getDepsForPkgMock).toHaveBeenCalledTimes(1);
      expect(getDepsForPkgMock).toHaveBeenCalledWith({});
    });
  });
});
