import visitors from "../src/visitors";
import ImportCallExpressionVisitor from "../src/ImportCallExpressionVisitor";
import ImportExportDeclarationVisitor from "../src/ImportExportDeclarationVisitor";
import RequireContextCallExpressionVisitor from "../src/RequireContextCallExpressionVisitor";
import RequireEnsureCallExpressionVisitor from "../src/RequireEnsureCallExpressionVisitor";
import SingleModuleRequireCallExpressionVisitor from "../src/SingleModuleRequireCallExpressionVisitor";

describe("The VisitorMap", () => {
    const keys = ['ImportDeclaration', 'ExportAllDeclaration', 'ExportNamedDeclaration', 'CallExpression'];
    keys.forEach(key => {
        it(`should include '${key}' as a key`, () => {
            expect(visitors).toHaveProperty(key);
        })
    })

    const values = [ImportCallExpressionVisitor, ImportExportDeclarationVisitor, RequireContextCallExpressionVisitor, RequireEnsureCallExpressionVisitor, SingleModuleRequireCallExpressionVisitor];
    values.forEach(visitor => {
        it(`should include '${visitor.name}' as a value`, () => {

            const occurrences = Object.values(visitors) // ?
                .filter(visitorArray =>
                    visitorArray && visitorArray.includes(visitor));

            expect(occurrences.length).toBeGreaterThan(0);
        })
    })
})