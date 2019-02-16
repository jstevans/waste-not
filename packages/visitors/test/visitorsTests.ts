import visitors from "../lib/visitors";
import ImportCallExpressionVisitor from "../lib/ImportCallExpressionVisitor";
import ImportExportDeclarationVisitor from "../lib/ImportExportDeclarationVisitor";
import RequireContextCallExpressionVisitor from "../lib/RequireContextCallExpressionVisitor";
import RequireEnsureCallExpressionVisitor from "../lib/RequireEnsureCallExpressionVisitor";
import SingleModuleRequireCallExpressionVisitor from "../lib/SingleModuleRequireCallExpressionVisitor";
import TSImportEqualsDeclarationVisitor from "../lib/TSImportEqualsDeclarationVisitor";

describe("The VisitorMap", () => {
    const keys = [
        'ImportDeclaration',
        'ExportAllDeclaration',
        'ExportNamedDeclaration',
        'CallExpression',
        'TSImportEqualsDeclaration'
    ];
    keys.forEach(key => {
        it(`should include '${key}' as a key`, () => {
            expect(visitors).toHaveProperty(key);
        })
    })

    const values = [
        ImportCallExpressionVisitor,
        ImportExportDeclarationVisitor,
        RequireContextCallExpressionVisitor,
        RequireEnsureCallExpressionVisitor,
        SingleModuleRequireCallExpressionVisitor,
        TSImportEqualsDeclarationVisitor
    ];
    values.forEach(visitor => {
        it(`should include '${visitor.name}' as a value`, () => {

            const occurrences = Object.values(visitors) // ?
                .filter(visitorArray =>
                    visitorArray && visitorArray.includes(visitor));

            expect(occurrences.length).toBeGreaterThan(0);
        })
    })
})