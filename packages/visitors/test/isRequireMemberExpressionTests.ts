import isRequireMemberExpression from "../lib/utils/isRequireMemberExpression";
import { memberExpression, logicalExpression, identifier } from "@babel/types";

describe('isRequireMemberExpression', () => {

    it("fails on null", () => {
        const result = isRequireMemberExpression(null as any);

        expect(result).toBeFalsy();
    });

    it("fails on undefined", () => {
        const result = isRequireMemberExpression(undefined as any);

        expect(result).toBeFalsy();
    });

    it("fails on non-member expression", () => {
        const result = isRequireMemberExpression({} as any);

        expect(result).toBeFalsy();
    });

    it("fails on member expression whose object is not an identifier", () => {
        const result = isRequireMemberExpression(
            memberExpression(
                { type: 'Expression' } as any,
                { type: 'Identifier' } as any
            ));

        expect(result).toBeFalsy();
    });

    it("fails on member expression whose object is an identifier that isn't 'require'", () => {
        const result = isRequireMemberExpression(
            memberExpression(
                identifier('notRequire'),
                { type: 'Identifier' } as any
            ));

        expect(result).toBeFalsy();
    });

    it("fails on non-member expression whose object is an identifier that is 'require'", () => {
        const result = isRequireMemberExpression({ object: identifier('require') } as any);

        expect(result).toBeFalsy();
    });
    
    it("fails on member expression whose object is not an identifier that is 'require'", () => {
        const result = isRequireMemberExpression(
            memberExpression(
                { type: 'Expression', name: 'require' } as any,
                { type: 'Identifier' } as any
            ));

        expect(result).toBeFalsy();
    });

    it("succeeds on member expression whose object is an identifier that is 'require'", () => {
        const result = isRequireMemberExpression(
            memberExpression(
                identifier('require'),
                { type: 'Identifier' } as any
            ));

        expect(result).toBeTruthy();
    });
})