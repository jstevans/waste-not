import { Visitor } from "walker/types";
import addDependency from "./utils/addDependency";
import addWarning from "./utils/addWarning";
import getStringPattern from "./utils/getStringPattern";
import { CallExpression, isImport } from "@babel/types";

const ImportCallExpressionVisitor: Visitor<CallExpression> =
    function visitImportCallExpression(node: CallExpression, state: any) {
        if (isImport(node.callee)) {
            const { depPattern, warnings } = getStringPattern(node.arguments[0]);
            addDependency(depPattern, state);
            warnings.forEach(w => addWarning(w, state));
        }
    }


export default ImportCallExpressionVisitor;