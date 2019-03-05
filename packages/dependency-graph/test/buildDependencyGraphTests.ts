import { Dependencies, DependencyGetter } from "packages/dependencies/lib/types";
import buildDependencyGraph from "../lib/buildDependencyGraph";

describe("buildDependencyGraph", () => {
    let mockFiles: { [fileName: string]: Dependencies } = {
        "./src/foo.js": {
            filePath: "./src/foo.js",
            fileDependencies: [
                "./src/bar.js",
                "./src/baz.js"
            ],
            wildcardDependencies: [],
            nativeDependencies: [],
            warnings: []
        },
        "./src/bar.js": {
            filePath: "./src/bar.js",
            fileDependencies: [
            ],
            wildcardDependencies: [
                {
                    original: ["code/fa*"],
                    aliases: ["src/fa*"]
                }
            ],
            nativeDependencies: [],
            warnings: []
        },
        "./src/baz.js": {
            filePath: "./src/baz.js",
            fileDependencies: [
            ],
            wildcardDependencies: [
                {
                    original: ["./src/fa*"],
                    aliases: []
                }
            ],
            nativeDependencies: [],
            warnings: []
        },
        "./src/faz.js": {
            filePath: "./src/faz.js",
            fileDependencies: [
            ],
            wildcardDependencies: [],
            nativeDependencies: [],
            warnings: []
        },
    }

    let mockGetDeps: DependencyGetter = (filePath: string) => mockFiles[filePath];

    it("should build a graph", () => {
        let expectedDependencies = {
            "./src/foo.js": {
                dependencies: [
                    "./src/bar.js",
                    "./src/baz.js"
                ],
            },
            "./src/bar.js": {
                dependencies: [],
            },
            "./src/baz.js": {
                dependencies: [],
            },
            "./src/faz.js": {
                dependencies: [],
            },
        }
        let expectedForward = Object.keys(mockFiles).reduce((acc, key) => ({
            ...acc,
            [key]: {...mockFiles[key], ...expectedDependencies[key]}
        }), {});

        let result = buildDependencyGraph(mockGetDeps)(Object.keys(mockFiles));
        expect(result).toEqual({
            "forward": expectedForward,
            "reverseFiles": {
                "./src/bar.js": [
                    "./src/foo.js"
                ],
                "./src/baz.js": [
                    "./src/foo.js"
                ]
            },
            "reverseWildcards": {
                "./src/fa*": [
                    "./src/baz.js"
                ],
                "code/fa*": [
                    "./src/bar.js"
                ],
                "src/fa*": [
                    "./src/bar.js"
                ]
            }
        })
    })
})