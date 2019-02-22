import getWildcardPathAliases from "../lib/getWildcardPathAliases";

describe("getWildcardPathAliases", () => {
    let testConfig = {
        baseUrl: ".", paths: {
            "foo*": ["test-*", "test2*"],
            "fa*": ["test3-*", "test4*"],
            "fazb*": ["test5-*", "test6*"],
            "faz*": ["test7-*", "test8*"],
            "bar*": ["bar"],
            "barbar": ["barfaz"],
        }
    };

    it("converts aliases", () => {
        let testValue = "foobar";
        let result = getWildcardPathAliases(testValue, "", testConfig);

        expect(result).toEqual({
            original: testValue,
            aliases: ["test-bar", "test2bar"]
        })
    })

    it("returns non-aliased paths", () => {
        let testValue = "test";
        let result = getWildcardPathAliases(testValue, "", testConfig);

        expect(result).toEqual({
            original: testValue,
            aliases: []
        })
    })

    it("matches the most specific pattern, regardless of order", () => {
        let testValue = "fazbar";
        let result = getWildcardPathAliases(testValue, "", testConfig);

        expect(result).toEqual({
            original: testValue,
            aliases: ["test5-ar", "test6ar"]
        })
    })

    it("matches no-wildcard paths", () => {
        let testValue = "barfoo";
        let result = getWildcardPathAliases(testValue, "", testConfig);

        expect(result).toEqual({
            original: testValue,
            aliases: ["bar"]
        })
    })

    it("matches wildcarded paths with non-wildcard resolution", () => {
        let testValue = "barbar";
        let result = getWildcardPathAliases(testValue, "", testConfig);

        expect(result).toEqual({
            original: testValue,
            aliases: ["barfaz"]
        })
    })

    it("handles wildcarded relative paths", () => {
        let testValue = "./barfaz*";
        let result = getWildcardPathAliases(testValue, "/foo/fah.ts", testConfig);

        expect(result).toEqual({
            original: "/foo/barfaz*",
            aliases: []
        });
    })
});