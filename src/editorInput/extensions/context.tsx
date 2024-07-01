import { StateField, StateEffect } from '@codemirror/state';

import { EditorContext } from '../interface';

export const updateEditorContext = StateEffect.define<EditorContext>({
    map: (value) => (value)
});

export const editorContext = StateField.define<EditorContext>({
    create() {
        return {
            suggestRef: null,
            fields: [],
            functions: [],
        };
    },
    update(value, tr) {
        for (let e of tr.effects) {
            if (e.is(updateEditorContext)) {
                return e.value;
            }
        }

        return value;
    }
});
  