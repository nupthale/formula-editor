
import { useImperativeHandle, ForwardedRef, MutableRefObject } from 'react';
import { EditorView } from '@codemirror/view';

import { takeSuggest } from '../extensions/autocomplete/suggest';

import { EditorInputExposeType } from '../interface';

export const useExpose = (
    ref: ForwardedRef<EditorInputExposeType>,
    viewRef: MutableRefObject<EditorView | undefined>, 
) => {
    useImperativeHandle(ref, () => ({
        takeSuggest: () => {
            if (!viewRef.current) {
                return;
            }

            takeSuggest(viewRef.current);
        },
    }));
}