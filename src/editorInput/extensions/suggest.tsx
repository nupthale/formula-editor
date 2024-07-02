import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

import { ASTNode } from '../../language/AST/_Base';

import { BaseVisitor } from '../../language/visitor/base';
import { Identifier } from '../../language/AST/Identifier';
import { NameIdentifier } from '../../language/AST/NameIdentifier';
import { Arguments } from '../../language/AST/Arguments';
import { NullLiteral } from '../../language/AST/NullLiteral';
import { Literal } from '../../language/AST/Literal';

import { FunctionName } from '../../language/lexer/token';

import { astState } from './ast';

import { NodeDescType } from '../interface';
import { Invalid } from '../../language/AST/Invalid';
import { CallExpression } from '../../language/AST/CallExpression';

// 只返回叶子节点的node
export class NodeVisitor extends BaseVisitor<void> {
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

    // 不匹配边界
    private matchesInner = (node: ASTNode) => {
        const [start, end] = node.range;

        return this.pos > start && this.pos < end;
    }

    private getArgIndex = (node: Arguments) => {
        let argIndex = 0;
        if (node.delimiters?.length) {
            node.delimiters.forEach((delimiter, index) => {
                if (this.pos > delimiter.startOffset) {
                    argIndex = index + 1;
                }
            });
        } 
        return argIndex;
    }

    private getFuncExtra = (node: ASTNode) => {
        const closestFunc = node instanceof Arguments ? node.parent : node.parent?.parent;
        
        if (!(closestFunc instanceof CallExpression)) {
            return;
        }

        return {
            func: closestFunc,
            argIndex: this.getArgIndex(closestFunc.argumentList),
        }

    }

    // Identifier的前后不算match
    protected visitIdentifier = (node: Identifier) => {
        if (!this.matchesInner(node)) {
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
            extra: this.getFuncExtra(node),
        });
    }

    protected visitInvalid = (node: Invalid) => {
        if (!this.matches(node)) {
            return;
        }

        this.setNode({
            raw: node,
            extra: this.getFuncExtra(node),
        });
    }

    protected visitNameIdentifier = (node: NameIdentifier) => {
        if (!this.matches(node)) {
            return;
        }

        this.setNode({
            raw: node,
            extra: this.getFuncExtra(node),
        });
    }

    protected visitLiteral = (node: Literal) => {
        if (!this.matches(node)) {
            return;
        }

        this.setNode({
            raw: node,
            extra: this.getFuncExtra(node),
        });
    }

    protected visitNullLiteral = (node: NullLiteral) => {
        if (!this.matches(node)) {
            return;
        }

        this.setNode({
            raw: node,
            extra: this.getFuncExtra(node),
        });
    }

    protected visitArguments = (node: Arguments) => { 
        node.args.map((arg) => {
            this.visit(arg);
        });  

        // 如果在arguments范围内，但是没有匹配到args的范围，则认为是中间的空格
        if (this.matches(node) && !this.node) {
            this.setNode({
                raw: node,
                extra: this.getFuncExtra(node),
            });
        }
    }
}

export const suggest = ({
    onNodeChange,
}: {
    onNodeChange: (node: NodeDescType | null) => void,
}) => EditorView.updateListener.of((v) => {
    // 如果光标没变化， 则不触发cursor change
    if (!v.docChanged && !v.selectionSet) {
        return;
    }

    const node = NodeVisitor.getNodeByPos(v.state);

    // cursor change
    onNodeChange(node);
});