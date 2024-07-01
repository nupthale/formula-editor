import { ASTNode } from '../AST/_Base';

import { Arguments } from '../../language/AST/Arguments';
import { BinaryExpression } from '../../language/AST/BinaryExpression';
import { CallExpression } from '../../language/AST/CallExpression';
import { Formula } from '../../language/AST/Formula';
import { Identifier } from '../../language/AST/Identifier';
import { Invalid } from '../../language/AST/Invalid';
import { Literal } from '../../language/AST/Literal';
import { MemberExpression } from '../../language/AST/MemberExpression';
import { NameIdentifier } from '../../language/AST/NameIdentifier';
import { NullLiteral } from '../../language/AST/NullLiteral';
import { ParenthesizedExpression } from '../../language/AST/ParenthesizedExpression';
import { UnaryExpression } from '../../language/AST/UnaryExpression';

// 默认的visitor，内部只是保持node visit下去， 不做任何处理
export class BaseVisitor<T> {
    protected visit = (node: ASTNode): T => {
       const type = node.type;
       const next = this[`visit${type}` as keyof BaseVisitor<T>];
       
       // @ts-ignore
       return next(node);
    }
   
    public visitFormula = (node: Formula) => {
        
        this.visit(node.body);
    }

    protected visitBinaryExpression = (node: BinaryExpression) => {
        this.visit(node.lhs);
        this.visit(node.rhs);
    }

    protected visitArguments = (node: Arguments) => {
        node.args.map(arg => this.visit(arg));
    }

    protected visitCallExpression = (node: CallExpression) => {
        this.visit(node.callee);
        this.visit(node.argumentList);
    }

    protected visitMemberExpression = (node: MemberExpression) => {
        this.visit(node.object);
        this.visit(node.property);
    }

    protected visitParenthesizedExpression = (node: ParenthesizedExpression) => {
        this.visit(node.expression);
    }

    protected visitUnaryExpression = (node: UnaryExpression) => {
        this.visit(node.operand);
    }

    protected visitIdentifier = (_node: Identifier) => {}
    protected visitInvalid = (_node: Invalid) => {}
    protected visitLiteral = (_node: Literal) => {}
    protected visitNameIdentifier = (_node: NameIdentifier) => {}
    protected visitNullLiteral = (_node: NullLiteral) => {}
}