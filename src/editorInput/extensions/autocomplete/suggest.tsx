
import { EditorView } from '@codemirror/view';

import { editorContext } from '../context';

import { updateSuffixText, suffixTextState } from './suffixText';
import { updateNameToId } from '../nameToId';

export const takeSuggest = (view: EditorView) => {
    const context = view.state.field(editorContext);
    const { suggestRef } = context;    

    const suffixText = view.state.field(suffixTextState);
    let destPos = 0;
    const isFunction = context.functions?.find(func => func === suggestRef);

    if (suffixText) {
        const { text, pos } = suffixText;
        destPos = pos + text.length + (isFunction ? 1 : 0);
      

        view.dispatch({
            effects: updateSuffixText.of(null),
            changes: [{
                from: pos,
                insert: isFunction ? `${text}()` : text,
            }],
        });
    } else if (suggestRef) {
        const suggestText = suggestRef.name;
        const { from, to } = view.state.selection.main;
        if (from !== to) return null;

        destPos = from + suggestText.length + (isFunction ? 1 : 0);
    
        // 如果要变胶囊，需要加个visitor，把对应name直接替换为id触发后续idToName即可
        view.dispatch({
            effects: updateSuffixText.of(null),
            changes: [{
                from,
                insert: isFunction ? `${suggestText}()` : suggestText,
            }],
        });
    }

    view.focus();
    view.dispatch({
        selection: { head: destPos, anchor: destPos },
    });

    updateNameToId(view);    
}