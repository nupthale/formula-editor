import { EditorView, Decoration, DecorationSet } from '@codemirror/view';

import { BaseVisitor } from '../../../language/visitor/base';
import { NameIdentifier } from '../../../language/AST/NameIdentifier';
import { astState } from '../ast';
import { editorContext } from '../context';

import { updateSuffixText, suffixTextState, suffixTextDecorationState } from './suffixText';
import { updateNameToId } from '../nameToId';
import { EditorContext, SuggestRefType } from '../../interface';


// 如果是函数， 则补充函数名()， 如果是字段，则补充字段名
export const getSuffixText = (prefixText: string, suggestRef: SuggestRefType) => {
    const prefixTextLen = prefixText.length;

    if (!suggestRef) return '';

    const name = suggestRef.isField ? suggestRef.name : `${suggestRef.name}()`;

    return name.slice(prefixTextLen);
}
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

    protected visitNameIdentifier = (node: NameIdentifier) => {
        const [from] = node.range;
        const fromPos = node.isEscape ? from + 1 : from;
        const endPos = fromPos + node.name.length;

        if (this.cursorPos !== endPos) {
            return;
        }

        const suffixText = getSuffixText(node.name, this.context.suggestRef);

        if (suffixText) {
            this.view.dispatch({
                effects: updateSuffixText.of({
                    text: suffixText,
                    pos: this.cursorPos,
                }),
            });
        }
    }
}

export const getSuggestFields = (context: EditorContext, prefixText: string = '', isRecovered: boolean) => {
    const { fields } = context;
    const prefixTextLen = prefixText.length;

    if (isRecovered) return fields;

    return fields.filter(field => 
        field.name.length >= prefixTextLen && 
        field.name.indexOf(prefixText) === 0
    );
}

export const getSuggestFunctions = (context: EditorContext, prefixText: string = '', isRecovered: boolean) => {
    const { functions } = context;
    const prefixTextLen = prefixText.length;

    if (isRecovered) return functions;

    return functions.filter(func =>
        func.name.length >= prefixTextLen &&
        func.name.indexOf(prefixText) === 0
    );
}

export const getSuggestions = (context: EditorContext, prefixText: string = '', isRecovered: boolean) => {
    const matchedFields = getSuggestFields(context, prefixText, isRecovered);

    const matchedFuncs = getSuggestFunctions(context, prefixText, isRecovered);

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
    
        let text = '';
        let pos = 0;
        let selection = null;

        if (suffixText) {
            text = suffixText.text;
            pos = suffixText.pos;
            const destPos = pos + text.length;
            selection = { head: destPos, anchor: destPos };
        }

        switch(event.key) {
            case ' ':
                if (!suffixText) return;
                view.dispatch({
                    effects: updateSuffixText.of(null),
                });

                break;
            case 'Backspace':
                if (!suffixText) return;
                event.preventDefault();

                view.dispatch({
                    effects: updateSuffixText.of(null),
                });

                break;
            case 'ArrowLeft':
                if (!suffixText) return;

                view.dispatch({
                    effects: updateSuffixText.of(null),
                    changes: [{
                        from: pos,
                        insert: text,
                    }],
                });

                break;    
            case 'ArrowRight':
                if (!suffixText || !selection) return;

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