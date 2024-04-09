import { RangeType } from "./interface";

export abstract class ASTNode {
    type = 'Base';

    range: RangeType = [0, 0];

    parent: ASTNode | null = null;

    protected abstract addParent(): void;

    public abstract serializeExpr(): Record<string, any>;
}