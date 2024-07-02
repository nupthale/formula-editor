
import { useMemo, KeyboardEvent } from 'react';

import { NameIdentifier } from '../../language/AST/NameIdentifier';
import { NullLiteral } from '../../language/AST/NullLiteral';
import { Arguments } from '../../language/AST/Arguments';

import { NodeDescType, EditorContext, FieldType, FunctionType, SuggestRefType } from '../../editorInput/interface';

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
    suggestItem?: SuggestRefType,
    onTakeSuggest: () => void,
    onSelectSuggestItem: (item: SuggestRefType) => void,
}) => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!node?.raw) return;

        const suggestions = getSuggestions(context, (node?.raw as NameIdentifier).name, (node?.raw as NameIdentifier).isRecovered);
        const selectedIndex = suggestions.findIndex(item => item === suggestItem);
        
        switch (e.key) {
            case 'ArrowDown':
                if (suggestInfo?.matches) {
                    e.preventDefault();

                    onSelectSuggestItem(
                        suggestions[Math.min(selectedIndex + 1, suggestions.length - 1)],
                    );
                }

                break;
            case 'ArrowUp':
                if (suggestInfo?.matches) {
                    e.preventDefault();

                    onSelectSuggestItem(
                        suggestions[Math.max(selectedIndex - 1, 0)],
                    );
                }

                break;
            case 'Tab':
                if (suggestInfo?.matches) {
                    e.preventDefault();
                    onTakeSuggest();
                }

                break;
            default:
                break;
        }
    }

    /**
     * 提示场景
     * 1. NameIdentifier, 根据name提示
     * 2. 函数Sum()，光标位于括号内，提示全部
     * 3. 函数Sum(,,),NullLiteral的场景，提示全部
     * 4. MemberExpression， A.B， 暂不实现
     */
    const suggestInfo = useMemo(() => {
        onSelectSuggestItem(null);

        if (!node?.raw) {
            return {
                matches: false,
                fields: [],
                functions: [],
            }
        };

        if (node.raw instanceof NameIdentifier) {
            const prefixText = (node?.raw as NameIdentifier).name;
            let suggestFields: FieldType[] = getSuggestFields(context, prefixText, node.raw.isRecovered);
            let suggestFunctions: FunctionType[] = getSuggestFunctions(context, prefixText, node.raw.isRecovered);

            onSelectSuggestItem(suggestFields?.[0] || suggestFunctions?.[0]);
            
            return {
                matches: suggestFields.length || suggestFunctions.length,
                fields: suggestFields,
                functions: suggestFunctions,
            }
        } else if (node.raw instanceof NullLiteral) {
            onSelectSuggestItem(context.fields?.[0]);

            return {
                matches: true,
                fields: context.fields,
                functions: context.functions,
            }
        } else if (node.raw instanceof Arguments && node.raw.args.length === 0) {
            onSelectSuggestItem(context.fields?.[0]);

            return {
                matches: true,
                fields: context.fields,
                functions: context.functions,
            };
        }
    }, [context, node, cursorPos]);

    return {
        suggestInfo,
        handleKeyDown,
    };
}