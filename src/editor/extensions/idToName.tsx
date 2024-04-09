import { EditorView } from '@codemirror/view';

import { BaseVisitor } from '../../language/visitor/base';
import { Identifier } from '../../language/AST/Identifier';

import { selectedCapIdState, selectCap } from './cap/selected';
import { astState } from './ast';
import { Formula } from '../../language/AST/Formula';

class Visitor extends BaseVisitor<void> {
    private formula: Formula;

    private selectedCapId: string | undefined;

    constructor(private view: EditorView, private event: KeyboardEvent) {
        super();

        this.formula = view.state.field(astState)!;
        this.selectedCapId = view.state.field(selectedCapIdState);

        this.visitFormula(this.formula);
    }

    protected visitIdentifier = (node: Identifier) => {
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
        if (
            !this.selectedCapId &&
            cursorPos === to
        ) {
            this.event.preventDefault();
            this.view.dispatch({
                changes: [
                    { from, to, insert: '1234' },
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