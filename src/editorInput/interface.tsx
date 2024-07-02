import { ASTNode } from "../language/AST/_Base";

export type NodeDescType = { 
    raw: ASTNode;
    extra?: Record<string, any>;
};

export type FieldType = {
    isField?: true,
    id: string;
    name: string;
    type: string;
    iconSvg?: string;
    category?: string;
    description: string;

    // editor暂未支持多级对象
    chidlren?: FieldType[];
};

export type FunctionParamType = {
    name: string;
    type: string;
    description: string;
};

export type FunctionType = {
    isField?: false,
    name: string;
    params: FunctionParamType[];
    example: string;
    fixedParamsLen: boolean;
};

export type EditorContext = {
    // 内部使用
    suggestRef?: SuggestRefType;
    fields: FieldType[];
    functions: FunctionType[];
};

export type SuggestRefType = FieldType | FunctionType | null | undefined;

export type LintErrorType = {
    range: [number, number];
    message: string;
};

export type EditorInputPropsType = { 
    context: EditorContext,
    defaultDoc: string, 
    suggestRef: SuggestRefType,
    onChange: (doc: string) => void,
    onNodeChange: (node: NodeDescType | null) => void,
    onCursorChange: (pos: number) => void,
};

export type EditorInputExposeType = {
    // 让当前的suggestRef生效
    takeSuggest: () => void,
}