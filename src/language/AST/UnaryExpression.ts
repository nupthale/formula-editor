import { IToken } from 'chevrotain';

import { ASTNode } from './_Base';

export class UnaryExpression extends ASTNode {
    type = 'UnaryExpression';
    
    constructor(
        public operator: IToken, 
        public operand: ASTNode, 
    ) {
        super();

        this.range = [operator.startOffset, this.operand.range[1]];
        this.addParent();
    }

    protected addParent = () => {
        this.operand.parent = this;
    }

    public serializeExpr = () => {
        return {
            type: this.type,
            operator: this.operator.image,
            operand: this.operand.serializeExpr(),
            range: this.range,
        }
    }
}