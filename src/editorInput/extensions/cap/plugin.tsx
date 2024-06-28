import { Range } from '@codemirror/state';
import { ViewUpdate, ViewPlugin, DecorationSet, EditorView, Decoration } from '@codemirror/view';

import { BaseVisitor } from '../../../language/visitor/base';
import { Identifier } from '../../../language/AST/Identifier';

import { astState } from '../ast';
import { editorContext } from '../context';

import { selectCap, selectedCapIdState, selectCapByCursorPos } from './selected';

import { CapWidget } from './widget';
import { EditorContext } from '../../interface';

class Visitor extends BaseVisitor<void> {
    widgets: Range<Decoration>[] = [];

    constructor(private context: EditorContext, private doc: string, private selectedCapId?: string) {
        super();
    }

    private getFieldById = (id: string) => {
        const fields = this.context.fields || [];
        return fields.find((field) => field.id === id);
    }

    protected visitIdentifier = (node: Identifier) => {
        if (node.callable) {
            return;
        }

        const field = this.getFieldById(node.id);

        if (field) {
            let deco = Decoration.replace({
                widget: new CapWidget(field, node.id === this.selectedCapId),
                side: 1
            });
    
            const [from, to] = node.range;
            const len = this.doc.slice(from, to).trim().length;
            
            this.widgets.push(deco.range(from, from + len));
        } else {
            let deco = Decoration.replace({
                widget: new CapWidget({
                    id: node.id,
                    name: '未识别的字段',
                    type: 'unknown',
                    iconSvg: '',
                    description: '未识别的字段',
                }, node.id === this.selectedCapId),
                side: 1,
            });
    
            const [from, to] = node.range;
            const len = this.doc.slice(from, to).trim().length;
            
            this.widgets.push(deco.range(from, from + len));
        }
    }
}

const idToCaps = (view: EditorView) => {
    const { ast } = view.state.field(astState);
    const context = view.state.field(editorContext);
    const doc = view.state.doc.toString();
    const selectedCapId = view.state.field(selectedCapIdState);

    const visitor = new Visitor(context, doc, selectedCapId);

    if (ast) {
        visitor.visitFormula(ast);
    }

    return Decoration.set(visitor.widgets);
}

export const capDecoration = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet

        constructor(view: EditorView) {
            this.decorations = idToCaps(view)
        }

        update(update: ViewUpdate) {
            this.decorations = idToCaps(update.view);
        }
    }, {
        decorations: v => v.decorations,

        eventHandlers: {
            mousedown: (e, view) => {
                let target = e.target as HTMLElement;
                const capEl = target.closest('.cm-id-cap');

                view.dispatch({
                    effects: selectCap.of(capEl ? capEl.id : undefined),
                });
            }
        }
    }
);

export const capFocusAttributes = EditorView.editorAttributes.of(v => {
    const selectedCapId = v.state.field(selectedCapIdState);

    console.info('#selectedCapId', selectedCapId);

    return {
        class: selectedCapId ? 'cm-cap--focused' : '',
    }
});

export const capPlugin = [
    capDecoration,
    capFocusAttributes,
    selectCapByCursorPos,
]; 