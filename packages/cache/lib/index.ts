import { Initialize, IsPropertyDirty, SetPropertyClean, CacheOptions } from "./types";
import configureLoadCache from "./loadCache";
import ensureDirectoryExists from "./utilities/ensureDirectoryExists";


const initialize: Initialize =
    function initialize(
        cacheOptions: CacheOptions,
        isPropertyDirty: IsPropertyDirty,
        setPropertyClean: SetPropertyClean) {

        ensureDirectoryExists(cacheOptions.cacheDirPath);

        return configureLoadCache({cacheOptions, isPropertyDirty, setPropertyClean });
    };

export default initialize;