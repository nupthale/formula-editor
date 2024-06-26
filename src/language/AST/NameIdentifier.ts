import { IToken } from 'chevrotain';
import { ASTNode } from './_Base';

import { EscapeName } from '../lexer/token';

export class NameIdentifier extends ASTNode {
    type = 'NameIdentifier';

    constructor(public nameToken: IToken, public isRecovered: boolean = false) {
        super();

        this.range = [this.nameToken.startOffset, this.nameToken.endOffset!];
        this.addParent();
    }

    get isEscape() {
        return this.nameToken.tokenType.name === EscapeName.name;
    }

    get name() {
        const image = this.nameToken.image;

        if (this.nameToken.tokenType.name === EscapeName.name) {
            return image.slice(1, -1);
        }
        
        return image;
    }

    protected addParent = () => {};

    public serializeExpr = () => {
        return {
            type: this.type,
            name: this.name,
            range: this.range,
        }
    }
}