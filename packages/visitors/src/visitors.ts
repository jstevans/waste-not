import { VisitorMap } from 'walker/types';
import ImportExportDeclarationVisitor from './ImportExportDeclarationVisitor';
import ImportCallExpressionVisitor from './ImportCallExpressionVisitor';
import RequireContextCallExpressionVisitor from './RequireContextCallExpressionVisitor';
import RequireEnsureCallExpressionVisitor from './RequireEnsureCallExpressionVisitor';
import SingleModuleRequireCallExpressionVisitor from './SingleModuleRequireCallExpressionVisitor';
const visitors: VisitorMap = {
    ImportDeclaration: [ImportExportDeclarationVisitor],
    ExportNamedDeclaration: [ImportExportDeclarationVisitor],
    ExportAllDeclaration: [ImportExportDeclarationVisitor],
    CallExpression: [
        ImportCallExpressionVisitor,
        SingleModuleRequireCallExpressionVisitor,
        RequireContextCallExpressionVisitor,
        RequireEnsureCallExpressionVisitor,
    ]
}

export default visitors;