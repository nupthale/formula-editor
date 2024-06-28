import { useState } from 'react';

import { EditorContext, NodeDescType } from '../editorInput/interface';
import EditorInput from '../editorInput';

import { useNodeDesc } from './hooks/useNodeDesc';
import { useSuggest } from './hooks/useSuggest';
import { Identifier } from '../language/AST/Identifier';

import SuggestList from './modules/SuggestList';

export default function Editor({
    defaultDoc,
    context,
    onChange,
}: {
    defaultDoc: string,
    context: EditorContext,
    onChange: (doc: string) => void,
}) {
    // 当前光标位置
    const [cursorPos, setCursorPos] = useState(0);

    // 当前ast node
    const [node, setNode] = useState<NodeDescType | null>(null);
    
    const nodeDesc = useNodeDesc({ node, context });

    const { suggestInfo } = useSuggest({ cursorPos, node, context });

    return (
        <div className="formula-editor">
            {/* 编辑区 */}
            <div className="formula-editor__head">
                <EditorInput 
                    context={context} 
                    defaultDoc={defaultDoc} 
                    onChange={onChange} 
                    onCursorChange={setCursorPos}
                    onNodeChange={setNode} 
                />
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
                    suggestInfo?.matches ? (
                        <div className="formula-editor-suggest">
                            <div className="formula-editor-suggest__list">
                                <SuggestList fields={suggestInfo.fields} functions={suggestInfo.functions} />
                            </div>
                            <div className="formula-editor-suggest__info"></div>
                        </div>
                    ) : ''
                }
            </div>

            <div className="formula-editor__footer">
                <div>帮助中心</div>
            </div>

        </div>
    );
}