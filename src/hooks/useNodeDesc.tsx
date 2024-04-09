import { useMemo } from 'react';

import { FieldType, NodeDescType } from '../editor/interface';
import { Identifier } from '../language/AST/Identifier';
import { NameIdentifier } from '../language/AST/NameIdentifier';
import { CallExpression } from '../language/AST/CallExpression';
import { MemberExpression } from '../language/AST/MemberExpression';

import { editorContext } from '../context';

export const useNodeDesc = ({ node }: { node: NodeDescType | null }) => {
    const renderFunction = (id: string, argIndex?: number) => {
        const functionItem = editorContext.functions.find(item => item.name === id);

        if (!functionItem) {
            return <div>未识别的函数</div>
        }

        return (
            <div className="flex">
                <div>{functionItem.name}</div>
                <div>(</div>
                {
                    functionItem.params.map((param, index) => (
                        <div className="flex">
                            <div className={`nodeDesc__functionParam ${index === argIndex ? 'nodeDesc__functionParam--selected' : ''}`}>{param.name}</div>
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
                            <div className={`nodeDesc__functionParam ${argIndex && argIndex >= functionItem.params.length ? 'nodeDesc__functionParam--selected' : ''}`}>...value</div>
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
            const field = editorContext.fields.find(item => item.id === raw.id);

            return renderField(field);
        }
        
        if (raw instanceof NameIdentifier) {
            const field = editorContext.fields.find(item => item.name === raw.name);

            return renderField(field);
        }
    }, [node]);
}