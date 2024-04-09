import { ASTNode } from "../language/AST/_Base";

export type NodeDescType = { 
    raw: ASTNode;
    extra?: Record<string, any>;
};

export type FieldType = {
    id: string;
    name: string;
    type: string;
    iconSvg: string;
    category: string;
    description: string;
};

export type FunctionParamType = {
    name: string;
    type: string;
    description: string;
};

export type FunctionType = {
    name: string;
    params: FunctionParamType[];
    example: string;
    fixedParamsLen: boolean;
};

export type EditorContext = {
    fields: FieldType[];
    functions: FunctionType[];
};