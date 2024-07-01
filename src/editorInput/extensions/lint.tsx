import { EditorView, Decoration, DecorationSet, ViewUpdate } from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';
import { astState } from './ast';

const markError = StateEffect.define<{from: number, to: number} | null>({
  map: (value, change) => value ? ({from: change.mapPos(value.from), to: change.mapPos(value.to)}) : value,
})

const errorFields = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(underlines, tr) {
      for (let e of tr.effects) if (e.is(markError)) {
        if (e.value) {
          underlines = underlines.update({
            add: [errorMark.range(e.value.from, e.value.to)]
          });
        } else {
          return Decoration.none;
        }
      }

      return underlines
    },
    provide: f => EditorView.decorations.from(f)
});
  
const errorMark = Decoration.mark({ class: 'cm-errorMark', inclusive: true });

const errorListener = EditorView.updateListener.of((v) => {
  if (!v.docChanged) {
      return;
  }

  dispatchError(v.view);
});

export const dispatchError = (view: EditorView) => {
  const { errors } = view.state.field(astState);
  if (errors.length) {
    const error = errors[0];

    view.dispatch({
      effects: markError.of({
        from: error.range[0],
        to: error.range[1],
      }),
    });
  } else {
    view.dispatch({
      effects: markError.of(null),
    });
  }
}

export const lintPlugin = [
    errorFields,
    errorListener,
];