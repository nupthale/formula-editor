import { StateField, StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { BaseVisitor } from '../../../language/visitor/base';
import { Formula } from '../../../language/AST/Formula';
import { Identifier } from '../../../language/AST/Identifier';
import { astState } from '../ast';

// 点击选中
export const selectCap = StateEffect.define<string | undefined>({
    map: (value) => (value)
  })

export const selectedCapIdState = StateField.define<string | undefined>({
    create() {
        return undefined;
    },
    update(value, tr) {
        let id;
        let isSelectCap = false;

        for (let e of tr.effects) {
            if (e.is(selectCap)) {
                isSelectCap = true;
                id = e.value;
            }
        }

        return isSelectCap ? id : value;
    },
});
  
// 根据光标位置选中
class Visitor extends BaseVisitor<void> {
    private formula: Formula;

    constructor(private view: EditorView, private event: KeyboardEvent) {
        super();

        this.formula = view.state.field(astState).ast!;

        this.visitFormula(this.formula);
    }

    protected visitIdentifier = (node: Identifier) => {
        const { from: cusorPos } = this.view.state.selection.main;
        const [from, to] = node.range;

        if (node.callable) {
            return;
        }

        if (
            cusorPos === from && this.event.key === 'ArrowRight'
        ) {
            this.event.preventDefault();
            this.view.dispatch({
                selection: {
                    head: to,
                    anchor: to,
                },
                effects: selectCap.of(node.id),
            });
        } else if (
            cusorPos === to && this.event.key === 'ArrowLeft' 
        ) {
            this.event.preventDefault();
            this.view.dispatch({
                selection: {
                    head: from + 1,
                    anchor: from + 1,
                },
                effects: selectCap.of(node.id),
            });
        }
    }
}

export const selectCapByCursorPos = EditorView.domEventHandlers({
    keydown(event, view) {
        // 光标在cap后， 按向前，则选中
        // 光标在cap前， 按向后，则选中
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            return;
        }

        if (view.state.field(selectedCapIdState)) {
            view.dispatch({
                effects: selectCap.of(undefined),
            });
        } else {
            new Visitor(view, event);
        }
    },
  });