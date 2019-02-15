import { WalkerState } from './types';
import { VisitorMap } from 'walker/types';
import { File, BaseNode } from '@babel/types';
import walkNode from './walkNode';


export function getDependencies(file: File, visitorMap: VisitorMap) {
    if (!file.program) {
        throw new Error(`File has no program: ${file.loc}`);
    } else if (!file.program.body) {
        throw new Error(`File's program has no body: ${file.loc}`);
    } else if (!visitorMap || typeof visitorMap !== 'object') {
        throw new Error("VisitorMap 'visitors' must be an object!");
    }

    const body = file.program.body;

    // We want to visit nodes left-to-right and depth-first.
    // Push each node's children in reverse-order, so that
    // the last element is always the next node to visit.
    const nodesToVisit: BaseNode[] = [...body].reverse();

    const dependencies: WalkerState = {dependencies: [], warnings: []};
    for (let node = nodesToVisit.pop(); node != undefined; node = nodesToVisit.pop()) {
        const subNodes = walkNode(node, visitorMap, dependencies);
        if (subNodes && subNodes.length > 0) {
            nodesToVisit.push(...[...subNodes].reverse());
        }
    }

    return dependencies;
}
