// jest test runner

const trashd = require("trashd")();

function startTestsForFile(filePath) {
    const {
        isTransitiveDirty,
        isDirty,
        readFromCache,
        writeToCache
    } = require("trashd")(filePath).getPropertyFromCache("jest.testResults");
    if (!isTransitiveDirty()) {
        return readFromCache();
    }

    const results = doStuff();

    writeToCache(results);

    assert.isFalse(isDirty())
    assert.isFalse(isTransitiveDirty())

    return results;
}

const fileCache =
    // <repo>/.trashd/<filePath>

    {
        currentTrash: "<TRASH2>",
        currentHash: "<HASH2>",
        cacheProperties: {
            "dependencies": {
                lastTrash: "",
                lastHash: "",
                property: [""],
            },
            "transitiveDependencies": {
                lastTrash: "",
                lastHash: "",
                property: [""],
            },
            "wildcardDependencies": {
                property: {
                    "aliases": [],
                    "files": [],
                }
            },
            "jest.testResults": {
                lastTrash: "<TRASH1>",
                lastHash: "<TRASH2>",
                property: {
                    /* stuff */ }
            }
        }
    }