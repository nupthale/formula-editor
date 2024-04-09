import { IToken, createTokenInstance } from 'chevrotain';

import { NameIdentifier } from '../AST/NameIdentifier';
import { Name } from '../lexer/token';


export class MissingNodeCreator {
    constructor(private text: string) {}

    getPrevTokenEnd = (token: IToken) => {
        return token?.endOffset || 0;
    }

    getNextTokenStart = (token: IToken) => {
        return token ? token.startOffset : this.text.length;
    }

    create(refToken: IToken, direction = 'left') {
        const startOffset = direction === 'left' ? this.getPrevTokenEnd(refToken) : refToken.startOffset + refToken.image.length;
        const endOffset = direction === 'left' ? refToken.startOffset : this.getNextTokenStart(refToken)

        const nameToken = createTokenInstance(Name, '', startOffset, endOffset, 0, 0, 0, 0);

        return new NameIdentifier(nameToken, true);
    }
}