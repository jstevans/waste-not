import { NodeModulesResolution } from "./index";
import * as globby from "globby";
import { FileOrGroup, FileGroup } from "../../dependencies/lib/types";

export default function getAllFiles(
  files: string[],
  nodeModulesResolution: NodeModulesResolution,
  globber = globby.sync
) {
  let allFilePaths: string[] = globber(files, {
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

  return allFiles;
}
