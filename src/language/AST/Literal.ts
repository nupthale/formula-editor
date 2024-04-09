import { IToken } from 'chevrotain';

import { ASTNode } from './_Base';

// 包含使用场景函数调用多个逗号， 比如sum(,,,,)这个时候补充literal，只是image为空
export class Literal extends ASTNode {
    type = 'Literal';

    constructor(
        public text: IToken,
    ) {
        super();

        this.range = [text.startOffset, text.endOffset!];
        this.addParent();
    }

    get raw() {
        return this.text.image;
    }

    get value() {
        switch(this.text.tokenType.name) {
            case 'Number':
                return Number(this.raw);
            case 'Boolean':
                return this.raw.toLowerCase() === 'true';
            default:
                return this.raw;        
        }
    }

    protected addParent = () => {};

    serializeExpr = () => {
        return {
            type: this.type,
            value: this.value,
            raw: this.raw,
            range: this.range
        }
    }
}