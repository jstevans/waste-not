import {
  FileOrGroup,
  Options,
  Overrides,
  DependencyGetter,
  FileGroup,
  MaybeDependencies,
} from "./types";
import readFileSync from "./wrappers/readFileSync";
import * as resolve from "resolve";
import {
  buildDependenciesBagWarningsOnly,
  buildDependenciesBag,
} from "./utilities/buildDependenciesBag";

export default function configure(
  allFiles: Record<string, FileOrGroup>,
  options: Options,
  overrides: Overrides = {}
): DependencyGetter<FileGroup> {
  const { packageResolver = resolve.sync } = overrides;

  return function getDependenciesForPackage(
    fileGroup: FileGroup
  ): MaybeDependencies {
    if (fileGroup.type !== "package") {
      return buildDependenciesBagWarningsOnly(fileGroup.basePath, [
        `Invalid type of FileGroup: '${fileGroup.basePath}' has type '${fileGroup.type}'. Expected type 'package'.`,
      ]);
    }

    let packageJsons = fileGroup.filePaths
      .filter((fp) => /(^|[^A-Za-z0-9\.])package\.json$/.test(fp))
      .map((path) => JSON.parse(readFileSync(path, "utf8")));

    if (packageJsons.length == 0) {
      return buildDependenciesBagWarningsOnly(fileGroup.basePath, [
        `No package.json for FileGroup: '${fileGroup.basePath}' does not have a package.json, so no dependencies were extracted.`,
      ]);
    }

    let dependencies = packageJsons
      .map((pj) =>
        [
          ...Object.keys(pj.dependencies || {}),
          ...Object.keys(pj.optionalDependencies || {}),
          ...Object.keys(pj.peerDependencies || {}),
        ].map((dep) =>
          packageResolver(dep, {
            basedir: fileGroup.basePath,
            package: pj,
          })
        )
      )
      .reduce((acc, e) => [...acc, ...e]);

    return buildDependenciesBag(fileGroup.basePath, dependencies);
  };
}
