import { IToken } from 'chevrotain';

import { ASTNode } from './_Base';

export class BinaryExpression extends ASTNode {
    type = 'BinaryExpression';
    
    constructor(
        public lhs: ASTNode, 
        public operator: IToken | null, 
        public rhs: ASTNode,
    ) {
        super();

        this.range = [lhs.range[0], rhs.range[1]];
        this.addParent();
    }

    protected addParent = () => {
        this.lhs.parent = this;
        this.rhs.parent = this;
    }

    public serializeExpr = () => {
        return {
            type: this.type,
            lhs: this.lhs.serializeExpr(),
            operator: this.operator?.image || '',
            rhs: this.rhs.serializeExpr(),
            range: this.range
        }
    }
}