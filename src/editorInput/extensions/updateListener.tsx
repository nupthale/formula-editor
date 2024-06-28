import { EditorView } from '@codemirror/view';

export const updateListener = ({
    onChange,
    onCursorChange,
}: {
    onChange: (doc: string) => void,
    onCursorChange: (pos: number) => void,
}) => EditorView.updateListener.of((v) => {
    if (v.docChanged) {
        onChange(v.state.doc.toString());
    }

    const { from, to } = v.state.selection.main;
    if (from !== to) return null;
    onCursorChange(from);
});