import { BaseNode, Node } from '@babel/types';
export type Visitor<T extends BaseNode> = (node: T, state: any) => void;
export type TypeMapOf<U> = { [k in Node['type']]?: U };
export type VisitorMap = TypeMapOf<Visitor<any>[]>;

export type PropertyOf<T> = T[keyof T];