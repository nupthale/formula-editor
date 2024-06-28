
import { useMemo } from 'react';

import { NameIdentifier } from '../../language/AST/NameIdentifier';

import { NodeDescType, EditorContext, FieldType, FunctionType } from '../../editorInput/interface';
import { suggest } from '../../editorInput/extensions/suggest';

export const useSuggest = ({ 
    cursorPos, 
    node, 
    context 
}: { 
    cursorPos: number, 
    node: NodeDescType | null, 
    context: EditorContext 
}) => {

    const suggestInfo = useMemo(() => {
        let suggestFields: FieldType[] = [];
        let suggestFunctions: FunctionType[] = [];

        if (!node) return {
            fields: [],
            functions: [],
        };

        const { raw } = node;
        
        if (raw instanceof NameIdentifier) {
            suggestFields = context.fields.filter(item => item.name.includes(raw.name));
            suggestFunctions = context.functions.filter(item => item.name.includes(raw.name));
        }

        return {
            matches: suggestFields.length || suggestFunctions.length,
            fields: suggestFields,
            functions: suggestFunctions,
        }
    }, [node, cursorPos]);

    return {
        suggestInfo,
    };
}