import { IToken } from 'chevrotain';

import { ASTNode } from './_Base';

export class MemberExpression extends ASTNode {
    type = 'MemberExpression';
    
    constructor(
        public object: ASTNode, 
        public point: IToken,
        public property: ASTNode, 
    ) {
        super();

        this.range = [this.object.range[0], this.property.range[1]];
        this.addParent();
    }

    protected addParent = () => {
        this.object.parent = this;
        this.property.parent = this;
    }

    public serializeExpr = () => {
        return {
            type: this.type,
            object: this.object.serializeExpr(),
            point: this.point.image,
            property: this.property.serializeExpr(),
            range: this.range,
        }
    }
}