import { ASTNode } from './_Base';
import { RangeType } from './interface';

// 使用场景函数调用多个逗号， 比如sum(,,,,)这个时候补充literal，只是image为空
export class NullLiteral extends ASTNode {
    type = 'Literal';

    constructor(
        public range: RangeType,
    ) {
        super();

        this.range = range;
        this.addParent();
    }

    protected addParent = () => {};

    serializeExpr = () => {
        return {
            type: this.type,
            value: null,
            raw: '',
            range: this.range
        }
    }
}