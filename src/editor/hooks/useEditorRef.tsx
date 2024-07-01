import { useRef } from 'react';

import { EditorInputExposeType } from '../../editorInput/interface';

export const useEditorRef = () => {
    const editorRef = useRef<EditorInputExposeType | null>(null);

    const handleTakeSuggest = () => {
        editorRef.current?.takeSuggest();
    }

    return {
        editorRef,
        handleTakeSuggest,
    }
}