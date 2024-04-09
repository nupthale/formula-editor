import { useEffect, useRef } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

import { astState } from './extensions/ast';
import { selectedCapIdState } from './extensions/cap/selected';
import { suggest } from './extensions/suggest';
import { capPlugin } from './extensions/cap/plugin';
import { nameToId } from './extensions/nameToId';
import { theme } from './extensions/theme';
import { editorContext } from './extensions/context';

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
                basicSetup,
                theme,
                editorContext.init(() => context),
                astState,
                selectedCapIdState,
                suggest({ onNodeChange, onChange }),
                capPlugin,
                nameToId,
            ],
        });

        const view = new EditorView({
            state,
            parent: editorDiv.current!,
        });
        viewRef.current = view;

        return () => {
            viewRef.current?.destroy();
        };
    }, [editorDiv]);

  return <div ref={editorDiv}></div>;
}