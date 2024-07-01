import { EditorView } from '@codemirror/view';
import { useEffect, MutableRefObject } from 'react';

import { updateEditorContext } from '../extensions/context';
import { updateAutocomplete } from '../extensions/autocomplete/index';
import { EditorContext, SuggestRefType } from '../interface';

export const useContext = ({
    viewRef, 
    context,
    suggestRef,
}: {
    viewRef: MutableRefObject<EditorView | undefined>, 
    context: EditorContext, 
    suggestRef: SuggestRefType,
}) => {
    useEffect(() => {
        if (!viewRef.current) {
            return;
        }

        viewRef.current?.dispatch({
            effects: updateEditorContext.of({
                ...context,
                suggestRef,
            }),
        });

        // 如果suggestRef变化，更新一下autocomplete
        updateAutocomplete(viewRef.current!);
    }, [context, suggestRef]);
}