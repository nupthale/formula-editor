import { useState, useRef } from 'react';

import { EditorContext, NodeDescType } from '../editorInput/interface';
import EditorInput from '../editorInput';

import { useNodeDesc } from './hooks/useNodeDesc';
import { useSuggest } from './hooks/useSuggest';
import { useEditorRef } from './hooks/useEditorRef';

import SuggestList from './modules/SuggestList';

import { FieldType, FunctionType} from '../editorInput/interface';

export default function Editor({
    defaultDoc,
    context,
    onChange,
}: {
    defaultDoc: string,
    context: Omit<EditorContext, 'suggestRef'>,
    onChange: (doc: string) => void,
}) {
    // 当前光标位置
    const [cursorPos, setCursorPos] = useState(0);

    // 当前Suggest区域，选中的字段、函数
    const [suggestItem, onSelectSuggestItem] = useState<FieldType | FunctionType>();

    // 当前ast node
    const [node, setNode] = useState<NodeDescType | null>(null);
    
    const nodeDesc = useNodeDesc({ node, context });

    const { editorRef, handleTakeSuggest } = useEditorRef();

    const { suggestInfo, handleKeyDown } = useSuggest({ 
        cursorPos, 
        node, 
        context, 
        suggestItem, 
        onSelectSuggestItem, 
        onTakeSuggest: handleTakeSuggest,
    });
    
    return (
        <div className="formula-editor" onKeyDown={handleKeyDown}>
            {/* 编辑区 */}
            <div className="formula-editor__head">
                <EditorInput 
                    ref={editorRef}
                    context={context} 
                    defaultDoc={defaultDoc}
                    suggestRef={suggestItem} 
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
                                <SuggestList 
                                    fields={suggestInfo.fields} 
                                    functions={suggestInfo.functions} 
                                    suggestItem={suggestItem}
                                    onTakeSuggest={handleTakeSuggest}
                                    onSelectSuggestItem={onSelectSuggestItem}
                                />
                            </div>
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