import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

import { ASTNode } from '../../language/AST/_Base';

import { BaseVisitor } from '../../language/visitor/base';
import { Identifier } from '../../language/AST/Identifier';
import { NameIdentifier } from '../../language/AST/NameIdentifier';
import { Arguments } from '../../language/AST/Arguments';

import { FunctionName } from '../../language/lexer/token';

import { astState } from './ast';

import { NodeDescType } from '../interface';

class NodeVisitor extends BaseVisitor<void> {
    static getNodeByPos = (state: EditorState) => {
        const { from, to } = state.selection.main;
        if (from !== to) return null;

        const visitor = new NodeVisitor(from);
        const ast = state.field(astState).ast;

        if (ast) visitor.visit(ast);
        return visitor.node;
    }

    private node: NodeDescType | null = null;
    
    constructor(private pos: number) {
        super();
    }

    private setNode = (node: NodeDescType) => {
        if (this.node) {
            return;
        }

        this.node = node;
    }

    private matches = (node: ASTNode) => {
        const [start, end] = node.range;

        return this.pos >= start && this.pos <= end;
    }

    protected visitIdentifier = (node: Identifier) => {
        if (!this.matches(node)) {
            return;
        }

        if (node.refType === FunctionName.name) {
            this.setNode({
                raw: node.parent!,
            });

            return;
        }

        
        this.setNode({ 
            raw: node,
        });
    }

    protected visitNameIdentifier = (node: NameIdentifier) => {
        if (!this.matches(node)) {
            return;
        }

        this.setNode({
            raw: node,
        });
    }

    protected visitArguments = (node: Arguments) => {
        node.args.map((arg) => {
            this.visit(arg);
        });

        const [start, end] = node.range;

        if (!(this.pos > start && this.pos < end)) {
            return;
        }

        let argIndex = 0;
        if (node.delimiters?.length) {
            node.delimiters.forEach((delimiter, index) => {
                if (this.pos > delimiter.startOffset) {
                    argIndex = index + 1;
                }
            });
        }

        this.setNode({
            raw: node.parent!,
            extra: {
                argIndex,
            }
        });        
    }
}

export const suggest = ({
    onChange,
    onNodeChange,
}: {
    onChange: (doc: string) => void,
    onNodeChange: (node: NodeDescType | null) => void,
}) => EditorView.updateListener.of((v) => {
    if (v.docChanged) {
        onChange(v.state.doc.toString());
    }

    // cursor change
    onNodeChange(NodeVisitor.getNodeByPos(v.state));
});