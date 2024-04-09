import { ASTNode } from './AST/_Base';

export type AstRule = (idxInCallingRule?: number, ...args: any[]) => ASTNode;
