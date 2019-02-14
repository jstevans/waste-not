import visitors from "visitors/visitors";
import ImportCallExpressionVisitor from "visitors/ImportCallExpressionVisitor";
import ImportExportDeclarationVisitor from "visitors/ImportExportDeclarationVisitor";
import RequireContextCallExpressionVisitor from "visitors/RequireContextCallExpressionVisitor";
import RequireEnsureCallExpressionVisitor from "visitors/RequireEnsureCallExpressionVisitor";
import SingleModuleRequireCallExpressionVisitor from "visitors/SingleModuleRequireCallExpressionVisitor";
import TSImportEqualsDeclarationVisitor from "visitors/TSImportEqualsDeclarationVisitor";

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