import { lexer } from './lexer/token';
import { Parser } from './parser/parser';

const parser = new Parser('');

const tokenize = (text: string) => {
    const lexingResult = lexer.tokenize(text);
    const tokens = lexingResult.tokens;

    return tokens.map((token, index) => {
        if (index === tokens.length - 1) {
            token.endOffset = text.length;
        } else {
            token.endOffset = token.startOffset + token.image.length;
        }

        return token;
    });
}

export const parse = (text: string) => {
    if (!text.trim()) {
        return {
            ast: null,
            astJson: null,
            errors: [],
        };
    }

   
    parser.text = text;

    parser.input = tokenize(text);
    const ast = parser.parse();

    return {
        ast,
        astJson: ast.serializeExpr(),
        errors: parser.errors,
    };
}