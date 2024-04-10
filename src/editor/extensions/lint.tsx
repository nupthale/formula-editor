import { EditorView, Decoration, DecorationSet } from '@codemirror/view';
import { StateField } from '@codemirror/state';
import { astState } from './ast';

const errorFields = StateField.define<DecorationSet>({
    create(state) {
      const { errors } = state.field(astState);

      const errorMarks = errors.map(error => errorMark.range(error.range[0], error.range[1]));

      const underlines = Decoration.set(errorMarks);

      return underlines;
    },
    update(underlines, tr) {
      if (!tr.docChanged) {
        return underlines;
      }

      const { errors } = tr.state.field(astState);

      const errorMarks = errors.map(error => errorMark.range(error.range[0], error.range[1]));

      underlines = underlines.update({
        add: errorMarks,
      });

      return underlines;
    },
    provide: f => EditorView.decorations.from(f)
});
  
const errorMark = Decoration.mark({ class: "cm-errorMark" });

export const lintPlugin = [
    errorFields,
];