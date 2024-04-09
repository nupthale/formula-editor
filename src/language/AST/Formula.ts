import { ASTNode } from './_Base';

export class Formula extends ASTNode {
    type = 'Formula';

    constructor(public body: ASTNode) {
        super();

        this.range = [body.range[0], body.range[1]];
        this.addParent();
    }

    protected addParent = () => {
        this.body.parent = this;
    }

    public serializeExpr = () => {
        return {
            type: this.type,
            body: this.body.serializeExpr(),
            range: this.range
        }
    }
}