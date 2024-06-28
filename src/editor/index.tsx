import { useState } from 'react';

import { EditorContext, NodeDescType } from '../editorInput/interface';
import EditorInput from '../editorInput';

import { useNodeDesc } from './hooks/useNodeDesc';

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
                {/* 提示区 */}
                {
                    nodeDesc && (
                        <div className="formula-editor__info">
                            {nodeDesc}
                        </div>
                    )
                }
            </div>

        </div>
    );
}