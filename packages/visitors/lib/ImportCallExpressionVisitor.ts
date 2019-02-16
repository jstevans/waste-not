import { Visitor, WalkerState } from "../../walker/lib/types";
import addDependency from "./utils/addDependency";
import addWarning from "./utils/addWarning";
import { CallExpression, isImport } from "@babel/types";
import getStringPattern from "./utils/getStringPattern";

const ImportCallExpressionVisitor: Visitor<CallExpression> =
    function visitImportCallExpression(node: CallExpression, state: WalkerState) {
        if (isImport(node.callee)) {
            const { depPattern, warnings } = getStringPattern("import() call", node.arguments[0]);
            addDependency(depPattern, state);
            warnings.forEach(w => addWarning(w, state));
        }
    }


export default ImportCallExpressionVisitor;