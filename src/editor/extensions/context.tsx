import { StateField } from '@codemirror/state';

import { EditorContext } from '../interface';

export const editorContext = StateField.define<EditorContext>({
    create() {
        return {
            fields: [],
            functions: [],
        };
    },
    update(value) {
        return value;
    }
});
  