
import { EditorView } from '@codemirror/view';

import { editorContext } from '../context';

import { NodeVisitor as SuggestNodeVisitor } from '../suggest';
import { updateSuffixText, suffixTextState } from './suffixText';
import { updateNameToId } from '../nameToId';
import { NameIdentifier } from '../../../language/AST/NameIdentifier';

export const takeSuggest = (view: EditorView) => {
    const context = view.state.field(editorContext);
    const { suggestRef } = context;    

    const suffixText = view.state.field(suffixTextState);
    let destPos = 0;

    if (suffixText) {
        const { text, pos } = suffixText;
        destPos = pos + text.length;
      
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

        if (node?.raw instanceof NameIdentifier && suggestText.includes(node.raw.name)) {
            destPos = node.raw.range[0] + suggestText.length;

            view.dispatch({
                effects: updateSuffixText.of(null),
                changes: [{
                    from: node.raw.range[0],
                    to: node.raw.range[1],
                    insert: suggestText,
                }],
            });
        } else {
            destPos = from + suggestText.length;
    
            // 如果要变胶囊，需要加个visitor，把对应name直接替换为id触发后续idToName即可
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