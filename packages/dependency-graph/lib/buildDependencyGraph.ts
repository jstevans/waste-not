import { DependencyGetter, Dependencies } from "../../dependencies/lib/types";

export type FileInfo<T> = {[filePath: string]: T }
export type Graph = {
    forward: FileInfo<Dependencies>,
    reverseFiles: FileInfo<string[]>,
    reverseWildcards: FileInfo<string>
}

export default function configure(getDependencies: DependencyGetter) {
    return function buildDependencyGraph(filePaths: string[]): Graph {
        let filePathSet = new Set(filePaths);

        return Array.from(filePathSet.values()).reduce((graph, fp) => {
            let deps = getDependencies(fp);

            graph.forward[fp] = {
                ...deps,
                dependencies: deps.fileDependencies
            };

            deps.fileDependencies.forEach(fd => 
                graph.reverseFiles[fd] = safeConcat(graph.reverseFiles[fd], fp));

            deps.wildcardDependencies.forEach(wds => {
                [...wds.aliases, ...wds.original].forEach(wd => 
                    graph.reverseWildcards[wd] = safeConcat(graph.reverseWildcards[wd], fp))
            });

            return graph;
        }, { forward: {}, reverseFiles: {}, reverseWildcards: {} })
    }
}

export function safeConcat<T>(list: Array<T>, element: T) {
    if (!list) {
        list = [];
    }
    list.push(element);
    return list;
}