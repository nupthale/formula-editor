import { StateField, StateEffect, RangeSet } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

import { InlineAutoCompleteWidget } from './widget';

export const updateSuffixText = StateEffect.define<{ text: string, pos: number } | null>({
    map: (value) => (value)
  });

export const suffixTextState = StateField.define<{ text: string, pos: number } | null>({
    create() {
        return null;
    },
    update(value, tr) {
        for (let e of tr.effects) {
            if (e.is(updateSuffixText)) {
                return e.value;
            }
        }

        return value;
    },
});

// 后缀text
export const suffixTextDecorationState = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(suffixInline, tr) {
        for (let e of tr.effects) {
            if (e.is(updateSuffixText)) {
                if (e.value?.text) {
                    const { text, pos } = e.value;

                    const widget = Decoration.widget({
                        widget: new InlineAutoCompleteWidget(text),
                        side: 1,
                    });

                    suffixInline = RangeSet.of([widget.range(pos)]);
                } else {
                    suffixInline = Decoration.none;
                }
            }
        }

        return suffixInline;
    },
    provide: f => EditorView.decorations.from(f)
});