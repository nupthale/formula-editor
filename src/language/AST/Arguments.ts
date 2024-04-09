import { IToken } from 'chevrotain';

import { ASTNode } from './_Base';
import { RangeType } from './interface';

export class Arguments extends ASTNode {
    type = 'Arguments';
    
    constructor(
        public openParen: IToken,
        public args: ASTNode[],
        public delimiters: IToken[],
        public closeParen?: IToken,
    ) {
        super();

        this.range = this.getRange();
        this.addParent();
    }

    private getRange = (): RangeType => {
        const start = this.openParen.startOffset;
        const end = !this.closeParen ? ( this.args?.length ? this.args[this.args.length - 1].range[1] : start + 1 ) : this.closeParen.endOffset!;

        return [start, end];
    }

    protected addParent = () => {
        this.args.forEach(arg => {
            arg.parent = this;
        });
    }

    public serializeExpr = () => {
        return {            
            type: this.type,
            arguments: this.args.map(arg => arg.serializeExpr()),
            delimiters: this.delimiters,
            missingRightParen: !this.closeParen,
            range: this.range
        }
    }
}