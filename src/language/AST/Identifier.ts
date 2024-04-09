import { IToken } from 'chevrotain';
import { ASTNode } from './_Base';

import { FunctionName } from '../lexer/token';

// $$[id:type:...customProps] 或者 functionName
export class Identifier extends ASTNode {
    type = 'Identifier';

    attrs: string[] = [];

    constructor(public reference: IToken) {
        super();

        this.initProps();

        this.range = [this.reference.startOffset, this.reference.endOffset!];
        this.addParent();
    }

    get refType() {
        return this.reference.tokenType.name;
    }

    get callable() {
        return this.refType === FunctionName.name;
    }

    get id() {
        return this.refType === FunctionName.name ? this.reference.image : this.attrs[0];
    }

    protected addParent = () => {};

    private initProps = () => {
        this.attrs = this.reference.image.slice(3, -1).split(':');
    }

    public serializeExpr = () => {
        return this.refType === FunctionName.name ? {
            type: this.type,
            refType: this.refType,
            id: this.id,
            range: this.range,
        } : {
            type: this.type,
            refType: this.refType,
            id: this.id,
            attrs: this.attrs,
            range: this.range,
        }
    }
}