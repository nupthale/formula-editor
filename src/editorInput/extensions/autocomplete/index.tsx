import { EditorView, Decoration, DecorationSet } from '@codemirror/view';

import { BaseVisitor } from '../../../language/visitor/base';
import { NameIdentifier } from '../../../language/AST/NameIdentifier';
import { astState } from '../ast';
import { editorContext } from '../context';

import { updateSuffixText, suffixTextState, suffixTextDecorationState } from './suffixText';
import { updateNameToId } from '../nameToId';
import { EditorContext } from '../../interface';

class Visitor extends BaseVisitor<void> {
    public widget: DecorationSet = Decoration.none;

    private context: EditorContext;

    constructor(
        private view: EditorView, 
        private cursorPos: number,
    ) {
        super();

        const { ast } = this.view.state.field(astState);
        this.context = this.view.state.field(editorContext);

        if (ast) {
            this.visitFormula(ast);
        }
    }

    private getSuffixText = (prefixText: string) => {
        const prefixTextLen = prefixText.length;
        return this.context.suggestRef?.name.slice(prefixTextLen);
    }

    protected visitNameIdentifier = (node: NameIdentifier) => {
        const [from, to] = node.range;
        const fromPos = node.isEscape ? from + 1 : from;
        const endPos = fromPos + node.name.length;

        if (this.cursorPos !== endPos || from > to) {
            return;
        }

        const suffixText = this.getSuffixText(node.name);

        if (suffixText) {
            this.view.dispatch({
                effects: updateSuffixText.of({
                    text: suffixText,
                    pos: endPos,
                }),
            });
        }
    }
}

export const getSuggestFields = (context: EditorContext, prefixText: string = '') => {
    const { fields } = context;
    const prefixTextLen = prefixText.length;

    return  fields.filter(field => 
        field.name.length >= prefixTextLen && 
        field.name.indexOf(prefixText) === 0
    );
}

export const getSuggestFunctions = (context: EditorContext, prefixText: string = '') => {
    const { functions } = context;
    const prefixTextLen = prefixText.length;

    return functions.filter(func =>
        func.name.length >= prefixTextLen &&
        func.name.indexOf(prefixText) === 0
    );
}

export const getSuggestions = (context: EditorContext, prefixText: string = '') => {
    const matchedFields = getSuggestFields(context, prefixText);

    const matchedFuncs = getSuggestFunctions(context, prefixText);

    return [...matchedFields, ...matchedFuncs];
}

export const updateAutocomplete = (view: EditorView) => {
    const state = view.state;
        const { from, to } = state.selection.main;
 
        if (from !== to) return;

        new Visitor(view, from);
}


 /**
 * 如果光标位于一个name后，则找到可以提示的field和function，
 * 并生成一个decoration，放在name后
 * 1. 如果选择了field或者function，则插入文本，去除decoration
 * 2. 如果按左/右键，则补全当前匹配的字段/函数
 * 3. 如果blur，则去除decoration
 * */ 
export const autocompleteHandler = EditorView.domEventHandlers({
    keyup(event, view) {
        if (event.key === 'Backspace') {
            return;
        }

        updateAutocomplete(view);
    },
    
    keydown(event, view) {
        const state = view.state;
        const { from, to } = state.selection.main;
 
        if (from !== to) return;
        
        const context = view.state.field(editorContext);
        const suffixText = view.state.field(suffixTextState);
        
        if (suffixText === null) {
            return;
        }

        const { text, pos } = suffixText;
        const destPos = pos + text.length;
        const selection = { head: destPos, anchor: destPos };
        
        switch(event.key) {
            case ' ':
                view.dispatch({
                    effects: updateSuffixText.of(null),
                });

                break;
            case 'Backspace':
                event.preventDefault();

                view.dispatch({
                    effects: updateSuffixText.of(null),
                });

                break;
            case 'ArrowLeft':
                view.dispatch({
                    effects: updateSuffixText.of(null),
                    changes: [{
                        from: pos,
                        insert: text,
                    }],
                });

                break;    
            case 'ArrowRight':
                event.preventDefault();
               
                view.dispatch({
                    effects: updateSuffixText.of(null),
                    changes: [{
                        from: pos,
                        insert: text,
                    }],
                    selection,
                });

                updateNameToId(view);

                break; 
            case 'ArrowUp':
            case 'ArrowDown':
            case 'Tab':
                // 如果有suffixText则preventDefault
                if (context.suggestRef) {
                    event.preventDefault();
                }
                
                break;               
            default:
                view.dispatch({
                    effects: updateSuffixText.of(null),
                });

                break;          
        }
    },
  });

export const autocomplete = [
    suffixTextState,
    suffixTextDecorationState,
    autocompleteHandler,
];