import { useEffect, useRef } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state';

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

import { EditorContext, NodeDescType } from './interface';

export default function Editor({ 
    context,
    defaultDoc, 
    onChange,
    onNodeChange,
}: { 
    context: EditorContext,
    defaultDoc: string, 
    onChange: (doc: string) => void,
    onNodeChange: (node: NodeDescType | null) => void,
}) {
    const editorDiv = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView>();

    useEffect(() => {
        const state = EditorState.create({
            doc: defaultDoc,
            extensions: [
                theme,
                editorContext.init(() => context),
                astState,
                selectedCapIdState,
                suggest({ onNodeChange, onChange }),
                
                capPlugin,
                nameToId,
                // idToName监听键盘事件，需要在basicSetup前
                idToName,
                lintPlugin,
                autocomplete,

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
}