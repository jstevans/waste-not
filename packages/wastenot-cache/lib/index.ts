import { Initialize, IsPropertyDirty, SetPropertyClean } from "./types";
import configureLoadCache from "./loadCache";
import ensureDirectoryExists from "./utilities/ensureDirectoryExists";


const initialize: Initialize =
    function initialize(
        rootPath: string,
        cacheDirPath: string,
        isPropertyDirty: IsPropertyDirty,
        setPropertyClean: SetPropertyClean) {

        ensureDirectoryExists(cacheDirPath);

        return configureLoadCache({ rootPath, cacheDirPath, isPropertyDirty, setPropertyClean });
    };

export default initialize;