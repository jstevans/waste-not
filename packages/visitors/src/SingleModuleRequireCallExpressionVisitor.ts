import { Visitor } from "walker/types";
import addDependency from "./utils/addDependency";
import addWarning from "./utils/addWarning";
import { CallExpression, isIdentifier, } from "@babel/types";
import isRequireMemberExpression from "./utils/isRequireMemberExpression";
import getStringPattern from "./utils/getStringPattern";

const SingleModuleRequireCallExpressionVisitor: Visitor<CallExpression> =
    function visitSingleModuleRequireCallExpression(node: CallExpression, state: any) {
        if (isSingleModuleRequireCallExpression(node)) {
            const { depPattern, warnings } = getStringPattern("require() call", node.arguments[0]);
            addDependency(depPattern, state);
            warnings.forEach(w => addWarning(w, state));
        }
    }

function isSingleModuleRequireCallExpression(node: CallExpression) {
    return (isIdentifier(node.callee) && node.callee.name === 'require') ||
        (isRequireMemberExpression(node.callee) &&
            isIdentifier(node.callee.property) && (
                node.callee.property.name === 'resolve' ||
                node.callee.property.name === 'include' ||
                node.callee.property.name === 'resolveWeak'))
}



export default SingleModuleRequireCallExpressionVisitor;