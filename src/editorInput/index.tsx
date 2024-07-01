import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

import { basicSetup } from './basicSetup';

import { astState } from './extensions/ast';
import { selectedCapIdState } from './extensions/cap/selected';
import { suggest } from './extensions/suggest';

import { capPlugin } from './extensions/cap/plugin';
import { nameToId } from './extensions/nameToId';
import { idToName } from './extensions/idToName';
import { theme } from './extensions/theme';
import { editorContext } from './extensions/context';
import { lintPlugin, dispatchError } from './extensions/lint';
import { autocomplete } from './extensions/autocomplete/index';
import { updateListener } from './extensions/updateListener';

import { useContext } from './hooks/useContext';
import { useExpose } from './hooks/useExpose';

import { EditorInputPropsType, EditorInputExposeType } from './interface';

export default forwardRef<EditorInputExposeType, EditorInputPropsType>(({
    context,
    defaultDoc, 
    suggestRef,
    onChange,
    onNodeChange,
    onCursorChange,
}: EditorInputPropsType, ref) => {
    const editorDiv = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView>();

    useExpose(ref, viewRef);

    useContext({ viewRef, context, suggestRef});

    useEffect(() => {
        const state = EditorState.create({
            doc: defaultDoc,
            extensions: [
                theme,
                EditorView.lineWrapping,
                editorContext.init(() => ({
                    ...context, 
                    suggestRef,
                })),
                astState,
                selectedCapIdState,
                suggest({ onNodeChange }),

                capPlugin,
                nameToId,
                // idToName监听键盘事件，需要在basicSetup前
                idToName,
                lintPlugin,
                autocomplete,

                updateListener({ onChange, onCursorChange }),
                basicSetup,
            ],
        });

        const view = new EditorView({
            state,
            parent: editorDiv.current!,
        });
        viewRef.current = view;

        onViewReady(view);

        return () => {
            viewRef.current?.destroy();
        };
    }, [editorDiv]);

    const onViewReady = (view: EditorView) => {
        // 触发一次lint
        dispatchError(view);
    };

  return <div ref={editorDiv}></div>;
});