import { Expression, SpreadElement, JSXNamespacedName, isStringLiteral, isBinaryExpression } from "@babel/types";

const UNSUPPORTED_EXPRESSION_WARNING = "Unsupported expression in import() call. \
                Using wildcard in dependency graph to not miss dependencies. \
                To achieve best performance, please only use string literals and + concatenation";

export default function getStringPattern(node: Expression | SpreadElement | JSXNamespacedName) {
    const parts = [node];
    const stringParts: string[] = [];
    const warnings: string[] = [];

    for (let nextPart = parts.pop(); nextPart; nextPart = parts.pop()) {
        if (isStringLiteral(nextPart)) {
            stringParts.push(nextPart.value);
        } else if (isBinaryExpression(nextPart)) {
            if(nextPart.operator === "+") {
                parts.push(nextPart.right, nextPart.left);
            } else {
                parts.push(nextPart.left);
                warnings.push(UNSUPPORTED_EXPRESSION_WARNING);
            }
        } else {
            warnings.push(UNSUPPORTED_EXPRESSION_WARNING);
        }
    }

    if (warnings.length > 0) {
        stringParts.push("*");
    }

    return {
        depPattern: stringParts.join(""),
        warnings
    }
}