import { StateField } from '@codemirror/state';

import { parse } from '../../language/index';
import { Formula } from '../../language/AST/Formula';
import { BaseVisitor } from '../../language/visitor/base';
import { Identifier } from '../../language/AST/Identifier';

import { EditorContext, LintErrorType } from '../interface';
import { editorContext } from './context';

const parseDoc = (doc: string, context: EditorContext) => {
    const { ast } = parse(doc);
    const visitor = new Visitor(ast!, context);
    const errors = visitor.errors;

    return {
        ast,
        errors,
    };
}

class Visitor extends BaseVisitor<void> {

    public errors: LintErrorType[] = [];

    constructor(private formula: Formula, private context: EditorContext) {
        super();

        this.visitFormula(this.formula);
    }

    private getFieldById = (id: string) => {
        return this.context.fields.find(field => field.id === id);
    }

    private getFunctionById = (id: string) => {
        return this.context.functions.find(func => func.name === id);
    }

    protected visitIdentifier = (node: Identifier) => {
        const [from, to] = node.range;

        if (node.callable) {
            const func = this.getFunctionById(node.id);

            if (!func) {
                this.errors.push({
                    range: node.range,
                    message: '未支持的函数',
                });
            }
            return;
        }

        const field = this.getFieldById(node.id);

        if (!field) {
            this.errors.push({
                range: [from, to],
                message: '未识别的字段',
            });
        }
    }
}

export const astState = StateField.define<{ ast: Formula | null, errors: LintErrorType[] }>({
    create(state) {
        const context = state.field(editorContext);

        const doc = state.doc.toString();
        return parseDoc(doc, context);
    },
    update(value, tr) {
        if (!tr.docChanged) return value;

        const context = tr.state.field(editorContext);
        const doc = tr.state.doc.toString();
        return parseDoc(doc, context);
    },
});