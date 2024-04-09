import { IToken } from 'chevrotain';

import { ASTNode } from './_Base';

export class Invalid extends ASTNode {
    type = 'Invalid';
    
    constructor(
        public text: IToken, 
    ) {
        super();

        this.range = [this.text.startOffset, this.text.endOffset!];
        this.addParent();
    }

    protected addParent = () => {};

    public serializeExpr = () => {
        return {
            type: this.type,    
            text: this.text.image,
            range: this.range
        }
    }
}