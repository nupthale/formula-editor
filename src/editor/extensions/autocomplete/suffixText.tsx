import { StateField, StateEffect } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { InlineAutoCompleteWidget } from './widget';

export const updateSuffixText = StateEffect.define<{ text: string, pos: number }>({
    map: (value) => (value)
  });

// 后缀text
export const suffixTextState = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(suffixInline, tr) {
        for (let e of tr.effects) {
            if (e.is(updateSuffixText)) {
                const { text, pos } = e.value;

                if (text) {
                    const widget = Decoration.widget({
                        widget: new InlineAutoCompleteWidget(text),
                        side: 1,
                    });

                    suffixInline = suffixInline.update({
                        add: [widget.range(pos)]
                    });
                } else {
                    suffixInline = Decoration.none;
                }
            }
        }

        return suffixInline;
    },
    provide: f => EditorView.decorations.from(f)
});