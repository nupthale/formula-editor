import { useState, useMemo } from 'react';

import { EditorContext, NodeDescType, SuggestRefType } from '../editorInput/interface';
import EditorInput from '../editorInput';

import { useNodeDesc } from './hooks/useNodeDesc';
import { useSuggest } from './hooks/useSuggest';
import { useEditorRef } from './hooks/useEditorRef';

import SuggestList from './modules/SuggestList';

export default function Editor({
    debug,
    defaultDoc,
    context: propContext,
    onChange,
}: {
    debug?: boolean,
    defaultDoc: string,
    context: Omit<EditorContext, 'suggestRef'>,
    onChange: (doc: string) => void,
}) {
    // 当前光标位置
    const [cursorPos, setCursorPos] = useState(0);

    const context = useMemo(() => {
        const _context = { ...propContext };
        _context.fields?.map(field => field.isField = true);
        _context.functions?.map(func => func.isField = false);

        return _context;
    }, [propContext]);

    // 当前Suggest区域，选中的字段、函数
    const [suggestItem, onSelectSuggestItem] = useState<SuggestRefType>();

    // 当前ast node
    const [node, setNode] = useState<NodeDescType | null>(null);
    
    const nodeDesc = useNodeDesc({ node, context, cursorPos });

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

                {/* debug */}
                {
                    debug ? (
                        <div className="formula-editor-debug flex items-center gap-4">
                            <span>光标位置: {cursorPos}</span>
                            {node?.raw.type ? (<span>当前叶节点类型: {node?.raw.type}</span>) : ''}
                            {suggestItem?.name ? (<span>选中提示项：{suggestItem?.name}</span>) : '' }
                        </div>
                    ) : ''
                }
            </div>

            <div className="formula-editor__footer">
                <div>帮助文档</div>
                <button onClick={() => editorRef.current?.format()}>格式化</button>
            </div>

        </div>
    );
}