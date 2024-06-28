import { useState } from 'react';

import { EditorContext, NodeDescType } from '../editorInput/interface';
import EditorInput from '../editorInput';

import { useNodeDesc } from './hooks/useNodeDesc';
import { Identifier } from '../language/AST/Identifier';

export default function Editor({
    defaultDoc,
    context,
    onChange,
}: {
    defaultDoc: string,
    context: EditorContext,
    onChange: (doc: string) => void,
}) {
    // 当前ast node
    const [node, setNode] = useState<NodeDescType | null>(null);
    
    const nodeDesc = useNodeDesc({ node, context });

    return (
        <div className="formula-editor">
            {/* 编辑区 */}
            <div className="formula-editor__head">
                <EditorInput context={context} defaultDoc={defaultDoc} onChange={onChange} onNodeChange={setNode} />
            </div>

            <div className="formula-editor__body">
                {/* 函数、引用提示 */}
                {
                    nodeDesc && (
                        <div className="formula-editor-info">
                            {nodeDesc}
                        </div>
                    )
                }

                {/* 函数、引用suggest */}
                {
                    node?.raw instanceof Identifier && (
                        <div className="formula-editor-suggest">
                            <div className="formula-editor-suggest__list"></div>
                            <div className="formula-editor-suggest__info"></div>
                        </div>
                    )
                }
            </div>

        </div>
    );
}