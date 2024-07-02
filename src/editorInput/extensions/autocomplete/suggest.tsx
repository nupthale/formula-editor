
import { EditorView } from '@codemirror/view';

import { editorContext } from '../context';

import { NodeVisitor as SuggestNodeVisitor } from '../suggest';
import { updateSuffixText, suffixTextState } from './suffixText';
import { updateNameToId } from '../nameToId';
import { NameIdentifier } from '../../../language/AST/NameIdentifier';
import { getSuffixText } from './index';

export const getDestPos = (isField: boolean, destPos: number) => {
    // 如果是函数， 则光标放到结尾的括号前
    return isField ? destPos : destPos - 1;
}

export const takeSuggest = (view: EditorView) => {
    const context = view.state.field(editorContext);
    const { suggestRef } = context;    

    const suffixText = view.state.field(suffixTextState);
    let destPos = 0;

    if (!suggestRef) return;

    if (suffixText) {
        const { text, pos } = suffixText;

        destPos = getDestPos(suggestRef.isField!, pos + text.length);

        view.dispatch({
            effects: updateSuffixText.of(null),
            changes: [{
                from: pos,
                insert: text,
            }],
        });
    } else if (suggestRef) {
        const suggestText = suggestRef.name;
        const { from, to } = view.state.selection.main;
        if (from !== to) return null;

        // get node by cursor，if node is nameIdentifier, replace node with suggestRef
        const node = SuggestNodeVisitor.getNodeByPos(view.state);

        if (node?.raw instanceof NameIdentifier && node.raw.name && suggestText.includes(node.raw.name)) {
            const suffixText = getSuffixText(node.raw.name, suggestRef);
            destPos = getDestPos(suggestRef.isField!, from + suffixText.length);
            
            view.dispatch({
                effects: updateSuffixText.of(null),
                changes: [{
                    from,
                    to: from + suffixText.length,
                    insert: suffixText,
                }],
            });
        } else {
            destPos = getDestPos(suggestRef.isField!, from + suggestText.length);

            view.dispatch({
                effects: updateSuffixText.of(null),
                changes: [{
                    from,
                    insert: suggestText,
                }],
            });
        }
    }

    view.focus();
    view.dispatch({
        selection: { head: destPos, anchor: destPos },
    });

    updateNameToId(view);    
}