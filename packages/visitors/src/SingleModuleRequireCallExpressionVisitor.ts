import { Visitor } from "walker/types";
import addDependency from "./utils/addDependency";
import addWarning from "./utils/addWarning";
import getStringPattern from "./utils/getStringPattern";
import { CallExpression, isIdentifier, isMemberExpression, Expression, MemberExpression, Identifier } from "@babel/types";

const SingleModuleRequireCallExpressionVisitor: Visitor<CallExpression> =
    function visitSingleModuleRequireCallExpression(node: CallExpression, state: any) {
        if (isSingleModuleRequireCallExpression(node)) {
            const { depPattern, warnings } = getStringPattern(node.arguments[0]);
            addDependency(depPattern, state);
            warnings.forEach(w => addWarning(w, state));
        }
    }

function isSingleModuleRequireCallExpression(node: CallExpression) {
    return isIdentifier(node.callee) && node.callee.name === 'require' || 
    isRequireMemberExpression(node.callee) &&
    isIdentifier(node.callee.property) && (
            node.callee.property.name === 'resolve' || 
            node.callee.property.name === 'include' || 
            node.callee.property.name === 'resolveWeak')
}

function isRequireMemberExpression(callee: Expression): callee is MemberExpression  {
    return isMemberExpression(callee) && 
    isIdentifier(callee.object) && 
    callee.object.name === 'require'
}

export default SingleModuleRequireCallExpressionVisitor;