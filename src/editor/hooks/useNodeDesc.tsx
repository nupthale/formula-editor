import { useMemo } from 'react';

import { FieldType, NodeDescType, EditorContext } from '../../editorInput/interface';
import { Identifier } from '../../language/AST/Identifier';
import { NameIdentifier } from '../../language/AST/NameIdentifier';
import { CallExpression } from '../../language/AST/CallExpression';
import { MemberExpression } from '../../language/AST/MemberExpression';
import { Arguments } from '../../language/AST/Arguments';

export const useNodeDesc = ({ node, context, cursorPos }: { node: NodeDescType | null, context: EditorContext, cursorPos: number }) => {
    const renderFunction = (id: string, argIndex?: number) => {
        const functionItem = context.functions.find(item => item.name === id);

        if (!functionItem) {
            return <div>未识别的函数</div>
        }

        return (
            <div className="flex items-center">
                <div className="formula-editor-nodeDesc__identifier mr-0.5">{functionItem.name?.toUpperCase()}</div>
                <div>(</div>
                {
                    functionItem.params.map((param, index) => (
                        <div className="flex" key={param.name + index}>
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

    const renderField = (field?: FieldType, showIfUnrecognized: boolean = false) => {
        if (!field) {
            return showIfUnrecognized ? <div>未识别的字段</div> : '';
        }

        return (
            <div className="flex flex-col">
                <div className="formula-editor-nodeDesc__identifier">{field.name}</div>
                <div className="formula-editor-nodeDesc__description mt-1">{field.description}</div>
            </div>
        );
    }
    
    // 不考虑MemberExpression
    return useMemo(() => {
        if (!node) return '';

        const { raw, extra } = node;

        if (raw instanceof CallExpression) {
            if (raw.callee instanceof Identifier) {
                const id = raw.callee.id;

                return renderFunction(id, 0);
            }
        }
        
        if (raw instanceof Identifier) {
            const field = context.fields.find(item => item.id === raw.id);

            return renderField(field, true);
        }
        
        if (raw instanceof NameIdentifier) {
            const field = context.fields.find(item => item.name === raw.name);

            return renderField(field);
        }

        if (extra?.func) {
            if (extra?.func.callee instanceof Identifier) {
                const id = extra?.func.callee.id;

                return renderFunction(id, extra?.argIndex);
            }
        }
    }, [node]);
}