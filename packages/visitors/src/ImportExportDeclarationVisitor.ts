import { ImportDeclaration, ExportAllDeclaration, ExportNamedDeclaration, isImportDeclaration, isExportNamedDeclaration, isExportAllDeclaration } from "@babel/types";
import addDependency from "./utils/addDependency";
import { Visitor, WalkerState } from "walker/types";

export type ImportExportDeclaration = ImportDeclaration | ExportAllDeclaration | ExportNamedDeclaration;

const ImportExportDeclarationVisitor: Visitor<ImportExportDeclaration> = 
function visitImportExportDeclaration(node: ImportExportDeclaration, state: WalkerState) {
    if (isImportExportDeclaration(node) && node.source && node.source.value) {
        addDependency(node.source.value, state);
    }
}

function isImportExportDeclaration(node: object) {
    return isImportDeclaration(node) ||
        isExportNamedDeclaration(node) ||
        isExportAllDeclaration(node);
}

export default ImportExportDeclarationVisitor;