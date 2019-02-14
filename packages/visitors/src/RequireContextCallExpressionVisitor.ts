import { Visitor } from "walker/types";
import addDependency from "./utils/addDependency";
import addWarning from "./utils/addWarning";
import { CallExpression, isIdentifier, isStringLiteral } from "@babel/types";
import isRequireMemberExpression from "./utils/isRequireMemberExpression";

const DEPENDENCIES_MUST_BE_STRINGS = "The elements of the first argument of a 'require.context' call must be strings.";

const RequireContextCallExpressionVisitor: Visitor<CallExpression> =
    function visitRequireContextCallExpressionVisitor(node: CallExpression, state: any) {
        if (isRequireContextCallExpression(node)) {
            const args = node.arguments;
            args.forEach(element => {
                if (element && isStringLiteral(element)) {
                    addDependency(element.value, state);
                } else {
                    addWarning(DEPENDENCIES_MUST_BE_STRINGS, state);
                }
            });
        }
    }


function isRequireContextCallExpression(node: CallExpression) {
    return isRequireMemberExpression(node.callee) &&
        isIdentifier(node.callee.property) &&
        node.callee.property.name === 'context';
}



export default RequireContextCallExpressionVisitor;