import { Expression, MemberExpression, isMemberExpression, isIdentifier } from "@babel/types";

export default function isRequireMemberExpression(callee: Expression): callee is MemberExpression  {
    return isMemberExpression(callee) && 
    isIdentifier(callee.object) && 
    callee.object.name === 'require'
}