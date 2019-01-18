import visitors from "../src/visitors";

describe("The VisitorMap", () => {
    const keys = ['ImportDeclaration', 'ExportAllDeclaration', 'ExportNamedDeclaration'];
    keys.forEach(key => {
        it(`should include '${key}' as a key`, () => {
            expect(visitors).toHaveProperty(key);
        })
    })
})