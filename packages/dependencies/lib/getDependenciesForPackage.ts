import {
  FileOrGroup,
  Options,
  Overrides,
  DependencyGetter,
  FileGroup,
  MaybeDependencies,
  PackageResolver,
} from "./types";
import readFileSync from "./wrappers/readFileSync";
import {
  buildDependenciesBagWarningsOnly,
  buildDependenciesBag,
} from "./utilities/buildDependenciesBag";

export const configureResolvePackage = function configureResolvePackage(
  allFiles: Record<string, FileOrGroup>
): PackageResolver {
  return function resolvePackage(dep, opts?) {
    let pathParts = ((opts && opts.basedir) || __dirname).split("/");
    for (let i = pathParts.length; i >= 0; i--) {
      const basePath = pathParts.slice(0, i).join("/");
      const depPath = `${basePath}${
        basePath.length > 0 ? "/" : ""
      }node_modules/${dep}/package.json`;
      if (allFiles[depPath]) {
        return depPath;
      }
    }
    throw new Error(
      `Could not resolve dependency '${dep}' from '${
        (opts && opts.basedir) || "unknown"
      }'`
    );
  };
};

export default function configure(
  allFiles: Record<string, FileOrGroup>,
  options: Options,
  overrides: Overrides = {}
): DependencyGetter<FileGroup> {
  const { packageResolver = configureResolvePackage(allFiles) } = overrides;

  return function getDependenciesForPackage(
    fileGroup: FileGroup
  ): MaybeDependencies {
    if (fileGroup.type !== "package") {
      return buildDependenciesBagWarningsOnly(fileGroup.basePath, [
        `Invalid type of FileGroup: '${fileGroup.basePath}' has type '${fileGroup.type}'. Expected type 'package'.`,
      ]);
    }

    let packageJsonPaths = fileGroup.filePaths.filter((fp) =>
      /(^|[^A-Za-z0-9\.])package\.json$/.test(fp)
    );

    if (packageJsonPaths.length == 0) {
      return buildDependenciesBagWarningsOnly(fileGroup.basePath, [
        `No package.json for FileGroup: '${fileGroup.basePath}' does not have a package.json, so no dependencies were extracted.`,
      ]);
    }

    let packageJsonPath = packageJsonPaths.reduce((shortest, current) =>
      shortest.length > current.length ? current : shortest
    );

    let packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

    let dependencies = [
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.optionalDependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {}),
    ].map((dep) =>
      packageResolver(dep, {
        basedir: fileGroup.basePath,
      })
    );

    return buildDependenciesBag(packageJsonPath, dependencies);
  };
}
