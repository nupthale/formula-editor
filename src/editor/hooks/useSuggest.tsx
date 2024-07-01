
import { useMemo, KeyboardEvent } from 'react';

import { NameIdentifier } from '../../language/AST/NameIdentifier';

import { NodeDescType, EditorContext, FieldType, FunctionType } from '../../editorInput/interface';

import { getSuggestions, getSuggestFields, getSuggestFunctions} from '../../editorInput/extensions/autocomplete/index';

export const useSuggest = ({ 
    cursorPos, 
    node, 
    context,
    suggestItem,
    onTakeSuggest,
    onSelectSuggestItem,
}: { 
    cursorPos: number, 
    node: NodeDescType | null, 
    context: EditorContext,
    suggestItem?: FieldType | FunctionType | null,
    onTakeSuggest: () => void,
    onSelectSuggestItem: (item: FieldType | FunctionType) => void,
}) => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!node?.raw) return;

        const suggestions = getSuggestions(context, (node?.raw as NameIdentifier).name);
        const selectedIndex = suggestions.findIndex(item => item === suggestItem);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();

                onSelectSuggestItem(
                    suggestions[Math.min(selectedIndex + 1, suggestions.length - 1)],
                );

                break;
            case 'ArrowUp':
                e.preventDefault();

                onSelectSuggestItem(
                    suggestions[Math.max(selectedIndex - 1, 0)],
                );

                break;
            case 'Tab':
                e.preventDefault();
                onTakeSuggest();

                break;
            default:
                break;
        }
    }

    const suggestInfo = useMemo(() => {
        if (!node || !(node?.raw instanceof NameIdentifier)) {
            return {
                fields: [],
                functions: [],
            }
        };

        const prefixText = (node?.raw as NameIdentifier).name;
        let suggestFields: FieldType[] = getSuggestFields(context, prefixText);
        let suggestFunctions: FunctionType[] = getSuggestFunctions(context, prefixText);

        onSelectSuggestItem(suggestFields?.[0] || suggestFunctions?.[0]);
        
        return {
            matches: suggestFields.length || suggestFunctions.length,
            fields: suggestFields,
            functions: suggestFunctions,
        }
    }, [context, node, cursorPos]);

    return {
        suggestInfo,
        handleKeyDown,
    };
}