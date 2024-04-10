import { EditorView } from '@codemirror/view';

import { BaseVisitor } from '../../language/visitor/base';
import { Identifier } from '../../language/AST/Identifier';

import { selectedCapIdState, selectCap } from './cap/selected';
import { astState } from './ast';
import { editorContext } from './context';
import { Formula } from '../../language/AST/Formula';
import { EditorContext } from '../interface';

class Visitor extends BaseVisitor<void> {
    private formula: Formula;

    private context: EditorContext;

    private selectedCapId: string | undefined;

    constructor(private view: EditorView, private event: KeyboardEvent) {
        super();

        this.formula = view.state.field(astState).ast!;
        this.selectedCapId = view.state.field(selectedCapIdState);
        this.context = view.state.field(editorContext);

        this.visitFormula(this.formula);
    }

    protected visitIdentifier = (node: Identifier) => {
        if (node.callable) {
            return;
        }

        // 1. 如果当前选中了cap， 则直接删除cap
        const [from, to] = node.range;
        if (
            this.selectedCapId &&
            node.id === this.selectedCapId
        ) {
            this.event.preventDefault();
            this.view.dispatch({
                changes: { from: from, to, insert: '' },
                effects: selectCap.of(undefined),
            });
        }

        // 2. 如果光标在cap后，此时输入删除，则idToName
        const { from: cursorPos } = this.view.state.selection.main;
        const field = this.context.fields.find(field => field.id === node.id);
        if (
            !this.selectedCapId &&
            cursorPos === to &&
            field
        ) {
            this.event.preventDefault();

            this.view.dispatch({
                changes: [
                    { from, to, insert: field.name },
                ],
            });
        }
    }
}


export const idToName = EditorView.domEventHandlers({
    keydown(event, view) {
        if (event.key !== 'Backspace') {
            return;
        }
        
        new Visitor(view, event);
    },
  });