import { StateField } from '@codemirror/state';
import { parse } from '../../language/index';
import { Formula } from '../../language/AST/Formula';

const parseDoc = (doc: string) => {
    const { ast } = parse(doc);
    return ast;
}

export const astState = StateField.define<Formula | null>({
    create(state) {
        const doc = state.doc.toString();
        return parseDoc(doc);
    },
    update(value, tr) {
        if (!tr.docChanged) return value;

        const doc = tr.state.doc.toString();
        return parseDoc(doc);
    },
});