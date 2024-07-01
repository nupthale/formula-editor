import { EditorView, ViewUpdate } from '@codemirror/view';

import { BaseVisitor } from '../../language/visitor/base';
import { NameIdentifier } from '../../language/AST/NameIdentifier';

import { astState } from './ast';
import { editorContext } from './context';

import { EditorContext } from '../interface';

class Visitor extends BaseVisitor<void> {
    private context: EditorContext;
    
    constructor(private view: EditorView, private pos: number, private ignorePos = false) {
        super();

        const state = view.state;

        const ast = state.field(astState).ast;
        this.context = state.field(editorContext);

        if (ast) this.visit(ast);
    }

    protected visitNameIdentifier = (node: NameIdentifier) => {
        const [from, to] = node.range;
        const field = this.context.fields.find(field => field.name ===  node.name);
        
        if (!field) {
            return;
        }

        if (
            (this.pos > to) ||
            (this.pos < from) ||
            this.ignorePos
        ) {   
            this.view.dispatch({
                changes: { from, to, insert: `\$\$[${field.id}:${field.type}]` },
            })
        }
    }
}

export const updateNameToId = (view: EditorView) => {
    new Visitor(view, 0, true);
}

export const nameToId = EditorView.updateListener.of((v) => {
    const state = v.state;
    const { from, to } = state.selection.main;
    if (from !== to) return null;

    if (!v.docChanged) {
        return;
    }

    new Visitor(v.view, from);
});