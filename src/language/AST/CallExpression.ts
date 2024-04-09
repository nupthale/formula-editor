import { ASTNode } from './_Base';
import { RangeType } from './interface';

export class CallExpression extends ASTNode {
    type = 'CallExpression';
    
    constructor(
        public callee: ASTNode,
        public argumentList: ASTNode,
    ) {
        super();

        this.range = this.getRange();
        this.addParent();
    }

    private getRange = (): RangeType => {
        return [this.callee.range[0], this.argumentList.range[1]];
    }

    protected addParent = () => {
        this.callee.parent = this;
        this.argumentList.parent = this;
    }

    public serializeExpr = () => {
        return {
            type: this.type,
            callee: this.callee?.serializeExpr(),
            arguments: this.argumentList.serializeExpr(),
            range: this.range,
        }
    }
}