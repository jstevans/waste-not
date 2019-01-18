import { BaseNode } from "@babel/types";
import { VisitorMap } from "./types";

const VISITOR_KEYS: string[] = require('@babel/types').VISITOR_KEYS;

export default function walkNode(node: BaseNode, visitors: VisitorMap, state: any) {
    if (!node) return null;

    const nodesToVisit: BaseNode[] = [];
    const visitor = visitors[node.type];
    if (visitor) {
        visitor(node, state);
    }

    for (let key of VISITOR_KEYS[node.type] || []) {
        let subNode: BaseNode | BaseNode[] = node[key];
        if (Array.isArray(subNode)) {
            for (let subSubNode of subNode) {
                nodesToVisit.push(subSubNode);
            }
        } else {
            nodesToVisit.push(subNode);
        }
    }
    return nodesToVisit;
}