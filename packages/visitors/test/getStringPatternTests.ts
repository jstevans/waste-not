import getStringPattern from "../src/utils/getStringPattern";
import { stringLiteral, binaryExpression, emptyStatement, booleanLiteral } from "@babel/types";

describe("getStringPattern", () => {
    it("returns a string with no warnings, given a string", () => {
        const results = getStringPattern(stringLiteral("a"));
        expect(results.warnings).toHaveLength(0);
        expect(results.depPattern).toEqual("a");
    })

    it("returns a string with no warnings, given an addition of strings", () => {
        const results = getStringPattern(
            // "c" + "a" + "b"
            binaryExpression(
                "+",
                binaryExpression(
                    "+",
                    stringLiteral("c"),
                    stringLiteral("a")),
                stringLiteral("b")));
        expect(results.warnings).toHaveLength(0);
        expect(results.depPattern).toEqual("cab");
    })

    it("returns a string with warnings, given any non-addition arithmetic of strings", () => {
        const results = getStringPattern(
            // "c" + "a" - "b"
            binaryExpression(
                "-",
                binaryExpression(
                    "+",
                    stringLiteral("c"),
                    stringLiteral("a")),
                stringLiteral("b")));
        expect(results.warnings).toHaveLength(1);
        expect(results.depPattern).toEqual("ca*");
    })

    it("returns a string with warnings, given any other expression", () => {
        const results = getStringPattern(
            // "c" + "a" + true
            binaryExpression(
                "+",
                binaryExpression(
                    "+",
                    stringLiteral("c"),
                    stringLiteral("a")),
                booleanLiteral(true)));
        expect(results.warnings).toHaveLength(1);
        expect(results.depPattern).toEqual("ca*");
    })
})
