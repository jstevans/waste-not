import { Visitor, WalkerState } from "walker/types";
import addDependency from "./utils/addDependency";
import addWarning from "./utils/addWarning";
import { CallExpression, isIdentifier, isArrayExpression, ArrayExpression, isStringLiteral } from "@babel/types";
import isRequireMemberExpression from "./utils/isRequireMemberExpression";

const DEPENDENCIES_MUST_BE_ARRAY = "The first argument of a 'require.ensure' call must be an array.";
const DEPENDENCIES_MUST_BE_STRINGS = "The elements of the first argument of a 'require.ensure' call must be strings.";

const RequireEnsureCallExpressionVisitor: Visitor<CallExpression> =
    function visitRequireEnsureCallExpressionVisitor(node: CallExpression, state: WalkerState) {
        if (isRequireEnsureCallExpression(node)) {
            const dependenciesArg = node.arguments[0];
            if (assertArrayExpression(dependenciesArg, state)) {
                dependenciesArg.elements.forEach(element => {
                    if (element && isStringLiteral(element)) {
                        addDependency(element.value, state);
                    } else {
                        addWarning(DEPENDENCIES_MUST_BE_STRINGS, state);
                    }
                });
            }
        }
    }

function isRequireEnsureCallExpression(node: CallExpression) {
    return isRequireMemberExpression(node.callee) &&
        isIdentifier(node.callee.property) &&
        node.callee.property.name === 'ensure';
}

function assertArrayExpression(node: any, state: any): node is ArrayExpression {
    if (!isArrayExpression(node)) {
        addWarning(DEPENDENCIES_MUST_BE_ARRAY, state);
        return false;
    }
    return true;
}


export default RequireEnsureCallExpressionVisitor;