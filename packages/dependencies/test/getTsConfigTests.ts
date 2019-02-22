import getTsConfig from "../lib/getTsConfig";

describe("getTsConfig", () => {
    it("returns undefined when passed undefined", () => {
        let result = getTsConfig();
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
        let options = {tsConfig};

        let mockTsConfig = {};
        jest.mock("TS_CONFIG_FILE", () => mockTsConfig, {virtual: true});

        let result = getTsConfig(options as any);

        expect(result).toBe(mockTsConfig);
    })
})