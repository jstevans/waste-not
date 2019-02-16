import { VisitorMap } from '../../walker/lib/types';
import ImportExportDeclarationVisitor from './ImportExportDeclarationVisitor';
import ImportCallExpressionVisitor from './ImportCallExpressionVisitor';
import RequireContextCallExpressionVisitor from './RequireContextCallExpressionVisitor';
import RequireEnsureCallExpressionVisitor from './RequireEnsureCallExpressionVisitor';
import SingleModuleRequireCallExpressionVisitor from './SingleModuleRequireCallExpressionVisitor';
import TSImportEqualsDeclarationVisitor from './TSImportEqualsDeclarationVisitor';
const visitors: VisitorMap = {
    ImportDeclaration: [ImportExportDeclarationVisitor],
    ExportNamedDeclaration: [ImportExportDeclarationVisitor],
    ExportAllDeclaration: [ImportExportDeclarationVisitor],
    CallExpression: [
        ImportCallExpressionVisitor,
        SingleModuleRequireCallExpressionVisitor,
        RequireContextCallExpressionVisitor,
        RequireEnsureCallExpressionVisitor,
    ],
    TSImportEqualsDeclaration: [TSImportEqualsDeclarationVisitor],
}

export default visitors;