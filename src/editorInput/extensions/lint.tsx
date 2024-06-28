import { EditorView, Decoration, DecorationSet, ViewUpdate } from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';
import { astState } from './ast';

const markError = StateEffect.define<{from: number, to: number}>({
  map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
})

const errorFields = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(underlines, tr) {
      for (let e of tr.effects) if (e.is(markError)) {
        underlines = underlines.update({
          add: [errorMark.range(e.value.from, e.value.to)]
        });
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
  }
}

export const lintPlugin = [
    errorFields,
    errorListener,
];