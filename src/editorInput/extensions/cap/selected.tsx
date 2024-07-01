import { StateField, StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { BaseVisitor } from '../../../language/visitor/base';
import { Formula } from '../../../language/AST/Formula';
import { Identifier } from '../../../language/AST/Identifier';
import { astState } from '../ast';
import { capId } from './id';

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

        if (this.formula) {
            this.visitFormula(this.formula);
        }
    }

    protected visitIdentifier = (node: Identifier) => {
        const { from: cusorPos } = this.view.state.selection.main;
        const [from, to] = node.range;

        if (node.callable) {
            return;
        }

        // 如果当前是选中状态，则需要跳过一个cap的距离
        const selectedId = this.view.state.field(selectedCapIdState);

        if (
            cusorPos === from && this.event.key === 'ArrowRight'
        ) {
            this.event.preventDefault();

            if (selectedId) {
                this.view.dispatch({
                    selection: {
                        head: to,
                        anchor: to,
                    },
                    effects: selectCap.of(undefined),
                });
            } else {
                this.view.dispatch({
                    effects: selectCap.of(capId(node)),
                });
            }
            
        } else if (
            cusorPos === to && this.event.key === 'ArrowLeft' 
        ) {
            this.event.preventDefault();
            
            if (selectedId) {
                this.view.dispatch({
                    selection: {
                        head: from,
                        anchor: from,
                    },
                    effects: selectCap.of(undefined),
                });
            } else {
                this.view.dispatch({
                    effects: selectCap.of(capId(node)),
                });
            }
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

        new Visitor(view, event);
    },
  });