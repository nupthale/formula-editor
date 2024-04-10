import { EditorView } from '@codemirror/view';

export const theme = EditorView.theme({
  '&': {
    color: '#212121',
    backgroundColor: '#fff'
  },
  '.cm-id-cap': {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#187b34',
    backgroundColor: '#187b341a',
    border: '1px solid #187b3420',
    borderRadius: '8px',
    padding: '0 6px',
  },
  '.cm-id-cap--selected': {
    backgroundColor: '#187b34d9',
    color: '#fff',
    border: '1px solid #187b34d9'
  },
  '&.cm-cap--focused .cm-selectionLayer': {
    display: 'none',
  },
  '&.cm-cap--focused .cm-cursorLayer': {
    display: 'none',
  },
  '.cm-errorMark': {
    borderBottom: '1px solid red',
  }
}, { dark: false })