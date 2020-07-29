import * as globby from "globby";
import initializeCache from "../../cache/lib/index";
import processFiles, {
  ProcessFilesOptions,
} from "../../graph-hashes/lib/processFiles";
import { FileInfo, Metadata, PropertyGetter } from "../../cache/lib/types";
import { TsConfig, FileOrGroup, FileGroup } from "../../dependencies/lib/types";

export interface WasteNotConfig {
  baseDirectory?: string;
  cacheDir?: string;
  files?: string[];
  hashAlgorithm?: string;
  mode?: {
    read?: boolean;
    write?: boolean;
    overwrite?: boolean;
  };
  optimizations?: {
    nodeModulesResolution?: "file" | "package";
  };
  tsConfig?: string | TsConfig;
  requireJsConfig?: string;
  webpackConfig?: string;
}
export default async function wastenot(config: WasteNotConfig = {}) {
  let {
    baseDirectory = process.cwd(),
    cacheDir = ".waste-not",
    files = ["**/*", "*"],
    hashAlgorithm = "sha512",
    optimizations: { nodeModulesResolution = "package" } = {},
  } = config;

  let cacheMode = { read: true, write: true, overwrite: true, ...config.mode };

  function isPropertyDirty(
    cacheProperty: any,
    metadata: Metadata,
    fileInfo: FileInfo,
    propertyOptions?: any
  ) {
    let hashKey = propertyOptions.transitive ? "transitiveHash" : "hash";
    return metadata.get()[hashKey] !== cacheProperty[hashKey];
  }

  function setPropertyClean(
    cacheProperty: any,
    metadata: Metadata,
    fileInfo: FileInfo,
    propertyOptions?: any
  ) {
    let hashKey = propertyOptions.transitive ? "transitiveHash" : "hash";
    cacheProperty[hashKey] = metadata.get()[hashKey];
  }

  let cacheOptions: ProcessFilesOptions = {
    ...config,
    baseDirectory: baseDirectory,
    cacheDirPath: cacheDir,
    mode: cacheMode,
  };

  let _loadCache = initializeCache(
    cacheOptions,
    isPropertyDirty,
    setPropertyClean
  );

  function loadCache(fileRelativePath: string): PropertyGetter {
    const { getProperty } = _loadCache(fileRelativePath);
    return getProperty;
  }

  let allFilePaths: string[] = globby.sync(files, {
    unique: true,
    onlyFiles: true,
  });
  let allFiles: Record<string, FileOrGroup> = {};
  let fileGroups: Record<string, FileGroup> = {};

  for (const filePath of allFilePaths) {
    const pathParts = filePath.split("/");
    const nmIndex = pathParts.lastIndexOf("node_modules");

    if (nmIndex == -1 || nodeModulesResolution !== "package") {
      // a non-node_modules file -- add the filePath as an independent
      allFiles[filePath] = filePath;
    } else {
      // a node_modules file -- create/add a new group if necessary, and
      // add this filePath to the group.
      const isScoped = pathParts[nmIndex + 1][0] === "@";
      const packagePath = pathParts
        .slice(0, nmIndex + (isScoped ? 3 : 2))
        .join("/");

      if (!fileGroups[packagePath]) {
        fileGroups[packagePath] = {
          type: "package",
          basePath: packagePath,
          filePaths: [],
        };
      }

      fileGroups[packagePath].filePaths.push(filePath);
      allFiles[filePath] = fileGroups[packagePath];
    }
  }

  let { graph, components } = await processFiles(
    allFiles,
    hashAlgorithm,
    _loadCache,
    cacheOptions
  );

  // we want the returned value to be a function,
  // but for those interested (e.g. dependency analyzers),
  // we also want to yield our graph/components
  loadCache["graph"] = JSON.parse(JSON.stringify(graph));
  loadCache["components"] = JSON.parse(JSON.stringify(components));

  return loadCache;
}
