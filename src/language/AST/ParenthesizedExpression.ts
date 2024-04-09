import { IToken } from 'chevrotain';

import { ASTNode } from './_Base';
import { RangeType } from './interface';


export class ParenthesizedExpression extends ASTNode {
    type = 'ParenthesizedExpression';
    
    constructor(
        public openParen: IToken, 
        public expression: ASTNode, 
        public closeParen: IToken | null,
    ) {
        super();

        this.range = this.getRange();
        this.addParent();
    }

    protected getRange = (): RangeType => {
        const endOffset = this.closeParen ? this.closeParen.endOffset! : this.expression.range[1];

        return [this.openParen.startOffset, endOffset];
    }

    protected addParent = () => {
        this.expression.parent = this;
    }

    public serializeExpr = () => {
        return {
            type: this.type,
            openParen: this.openParen.image,
            expression: this.expression.serializeExpr(),
            closeParen: this.closeParen?.image,
            range: this.range
        }
    }
}