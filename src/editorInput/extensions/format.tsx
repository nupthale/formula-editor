// 可配合prettier实现
// https://medium.com/@fvictorio/how-to-write-a-plugin-for-prettier-a0d98c845e70
import { KeyBinding, Command, EditorView } from '@codemirror/view';
import prettier, { doc, Plugin } from 'prettier';
import * as prettierPluginEstree from 'prettier/plugins/estree';

import { parse } from '../../language/index';

import { ASTNode } from '../../language/AST/_Base';
import { BinaryExpression } from '../../language/AST/BinaryExpression';
import { Arguments } from '../../language/AST/Arguments';
import { CallExpression } from '../../language/AST/CallExpression';
import { MemberExpression } from '../../language/AST/MemberExpression';
import { ParenthesizedExpression } from '../../language/AST/ParenthesizedExpression';
import { UnaryExpression } from '../../language/AST/UnaryExpression';
import { Identifier } from '../../language/AST/Identifier';
import { NameIdentifier } from '../../language/AST/NameIdentifier';
import { Invalid } from '../../language/AST/Invalid';
import { Literal } from '../../language/AST/Literal';
import { NullLiteral } from '../../language/AST/NullLiteral';
import { Formula } from '../../language/AST/Formula';

const { builders } = doc;
const { group, line, softline, join, indent } = builders;

const formulaPlugin: Plugin = {
    printers: {
        'formula-printer': {
            print: (path, _options, print) => {
                const node = path.node as ASTNode;

                if (node instanceof Formula) {
                    return group(
                        path.call(print, 'body'),
                    );
                }

                if (node instanceof BinaryExpression) {
                    return group([
                        path.call(print, 'lhs'),
                        ' ',
                        node.operator?.image || '',
                        indent(
                            group([
                                line,
                                path.call(print, 'rhs')
                            ])
                        ),
                       
                    ]);
                }

                if (node instanceof Arguments) {
                    return group([
                        softline,
                        join(group([',', line]), path.map(print, 'args')),
                    ]);
                }

                if (node instanceof CallExpression) {
                    return group([
                        path.call(print, 'callee'),
                        '(',
                        indent(
                            group([
                                path.call(print, 'argumentList'),
                            ])
                        ),
                        softline,
                        ')',
                    ]);
                }

                if (node instanceof MemberExpression) {
                    return group([
                        path.call(print, 'object'),
                        softline,
                        '.',
                        path.call(print, 'property'),
                    ]);
                }

                if (node instanceof ParenthesizedExpression) {
                    return group([
                        '(',
                        softline,
                        path.call(print, 'expression'),
                        softline,
                        ')'
                    ]);
                }

                if (node instanceof UnaryExpression) {
                    return group([
                        node.operator?.image,
                        path.call(print, "operand"),
                    ]);
                }

                if (node instanceof Identifier) {
                    if (node.callable) return node.id;
                    return `$$[${node.attrs.join(':')}]`;
                }

                if (node instanceof NameIdentifier) {
                    return node.name;
                }

                if (node instanceof Invalid) {
                    return node.text.image;
                }

                if (node instanceof Literal) {
                    return `${node.value}`;
                }

                if (node instanceof NullLiteral) {
                    return '';
                }

                throw new Error(`Unknown node type: ${node.type}`);
            },
        },
    },
    parsers: {
        'formula-parser': {
            async parse(text: string) {
                const { ast } = parse(text);

                return ast;
            },
            astFormat: "formula-printer",
            locStart(node: ASTNode) {
                return node.range[0];
            },
            locEnd(node: ASTNode) {
                return node.range[1];
            }
        }
    }
};

export const format = async (text: string) => {
    const formatText = await prettier.format(text, {
        parser: 'formula-parser',
        plugins: [formulaPlugin, prettierPluginEstree],
    });

    return formatText;
}

format('$$[32:number]+$$sum1(1 + 1) +abc').then(text => {
    console.info('###', text);
});

export const formatCommand: Command = (view: EditorView) => {
    const text = view.state.doc.toString();

    if (!text?.trim?.()?.length) return false;

    format(text).then((formatText) => {
        view.dispatch({
            changes: {
                from: 0,
                to: text.length,
                insert: formatText,
            },
        });
    });

    return true;
}

export const formatKeyBinding: KeyBinding[] = [
    { key: 'Ctrl-f', mac: 'Cmd-f', run: formatCommand, preventDefault: true },
];

