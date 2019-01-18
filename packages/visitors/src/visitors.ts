import ImportExportDeclarationVisitor from './ImportExportDeclarationVisitor';
import { VisitorMap } from 'walker/types';
const visitors: VisitorMap = {
    ImportDeclaration: ImportExportDeclarationVisitor,
    ExportNamedDeclaration: ImportExportDeclarationVisitor,
    ExportAllDeclaration: ImportExportDeclarationVisitor,

}

export default visitors;