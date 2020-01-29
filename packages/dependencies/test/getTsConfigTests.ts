import * as path from 'path';
import getTsConfig from "../lib/getTsConfig";

describe("getTsConfig", () => {
    it("returns undefined when passed undefined", () => {
        let result = getTsConfig({baseDirectory: "/"});
        expect(result).toBeUndefined();
    })

    it("returns config.tsConfig when it's an object", () => {
        let tsConfig = {};
        let options = {tsConfig};
        let result = getTsConfig(options as any);
        expect(result).toBe(tsConfig);
    })

    it("fetches and returns config.tsConfig when it's a path string", () => {
        let tsConfig = "TS_CONFIG_FILE";
        let options = {baseDirectory: "/", tsConfig};

        let mockTsConfig = {};
        jest.mock(path.resolve("/", "TS_CONFIG_FILE"), () => mockTsConfig, { virtual: true });

        let result = getTsConfig(options as any);

        expect(result).toBe(mockTsConfig);
    })
})
