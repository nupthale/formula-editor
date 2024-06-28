import { useMemo } from 'react';

import { FieldType, NodeDescType, EditorContext } from '../../editorInput/interface';
import { Identifier } from '../../language/AST/Identifier';
import { NameIdentifier } from '../../language/AST/NameIdentifier';
import { CallExpression } from '../../language/AST/CallExpression';
import { MemberExpression } from '../../language/AST/MemberExpression';

export const useNodeDesc = ({ node, context }: { node: NodeDescType | null, context: EditorContext }) => {
    const renderFunction = (id: string, argIndex?: number) => {
        const functionItem = context.functions.find(item => item.name === id);

        if (!functionItem) {
            return <div>未识别的函数</div>
        }

        return (
            <div className="flex items-center">
                <div className="formula-editor-nodeDesc__functionName mr-0.5">{functionItem.name?.toUpperCase()}</div>
                <div>(</div>
                {
                    functionItem.params.map((param, index) => (
                        <div className="flex">
                            <div className={`formula-editor-nodeDesc__functionParam ${index === argIndex ? 'formula-editor-nodeDesc__functionParam--selected' : ''}`}>
                                <div className="relative">{param.name}</div>
                            </div>
                            {
                                index === functionItem.params.length - 1 ? '' : ','
                            }
                        </div>
                    ))
                }
                {
                    !functionItem.fixedParamsLen ? (
                        <div className="flex">
                            <div>,</div>
                            <div className={`formula-editor-nodeDesc__functionParam ${argIndex && argIndex >= functionItem.params.length ? 'formula-editor-nodeDesc__functionParam--selected' : ''}`}>
                                <div className="relative">...其余的值</div>
                            </div>
                        </div>
                    ) : ''
                }
                <div>)</div>
            </div>
        );
    }

    const renderField = (field?: FieldType) => {
        if (!field) {
            return <div>未识别的字段</div>
        }

        return (
            <div className="flex">
                <div>{field.name} - {field.description}</div>
            </div>
        );
    }
    
    return useMemo(() => {
        if (!node) return '';

        const { raw } = node;
        if (raw instanceof MemberExpression) {
            const { property } = raw;
            const id = (property as Identifier).id;

            return renderFunction(id);
        }
        
        if (raw instanceof CallExpression) {
            if (raw.callee instanceof Identifier) {
                const id = raw.callee.id;
                const argIndex = node?.extra?.argIndex;

                return renderFunction(id, argIndex);
            }

            // MemberExpression
            if (raw.callee instanceof MemberExpression) {
                const id = (raw.callee.property as Identifier).id;
                const argIndex = node?.extra?.argIndex;

                return renderFunction(id, argIndex);
            }
        }
        
        if (raw instanceof Identifier) {
            const field = context.fields.find(item => item.id === raw.id);

            return renderField(field);
        }
        
        if (raw instanceof NameIdentifier) {
            const field = context.fields.find(item => item.name === raw.name);

            return renderField(field);
        }
    }, [node]);
}