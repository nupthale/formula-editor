
import { IToken } from 'chevrotain';

import { ASTNode } from '../AST/_Base';
import { BinaryExpression } from '../AST/BinaryExpression';

import { MissingNodeCreator } from './missingNodeCreator';
import { UnaryExpression } from '../AST/UnaryExpression';
import { MemberExpression } from '../AST/MemberExpression';
import { ParenthesizedExpression } from '../AST/ParenthesizedExpression';
import { Invalid } from '../AST/Invalid';
import { Literal } from '../AST/Literal';
import { NullLiteral } from '../AST/NullLiteral';
import { RangeType } from '../AST/interface';
import { NameIdentifier } from '../AST/NameIdentifier';
import { CallExpression } from '../AST/CallExpression';
import { Arguments } from '../AST/Arguments';
import { Identifier } from '../AST/Identifier';
import { Formula } from '../AST/Formula';

export class ASTNodeFactory {
    constructor(
        private missingNodeCreator: MissingNodeCreator,
    ) {
    }

    formula = (body: ASTNode) => {
        return new Formula(body);
    }

    // 只有两种情况， 要么operator存在，另外两个缺少； 要么另外两个存在， operator不存在
    binaryExpression = (lhs: ASTNode | null, operator: IToken | null, rhs: ASTNode | null) => {
        if (operator) {
            if (!lhs) {
                lhs = this.missingNodeCreator.create(operator);
            }
    
            if (!rhs) {
                rhs = this.missingNodeCreator.create(operator, 'right');
            }
        }

        return new BinaryExpression(lhs!, operator, rhs!);
    }

    unaryExpression = (operator: IToken, operand: ASTNode | null) => {
        if (!operand) {
            operand = this.missingNodeCreator.create(operator, 'right');
        }

        return new UnaryExpression(operator, operand);
    }

    memberExpression = (object: ASTNode | null, point: IToken, property: ASTNode | null) => {
        if (!object) {
            object = this.missingNodeCreator.create(point);
        } 

        if (!property) {
            property = this.missingNodeCreator.create(point, 'right');
        }

        return new MemberExpression(object, point, property);
    }

    parenthesizedExpression = (openParen: IToken, expression: ASTNode | null, closeParen: IToken | null) => {
        if (!expression) {
            expression = this.missingNodeCreator.create(openParen, 'right');
        }

        return new ParenthesizedExpression(openParen, expression, closeParen);
    }

    invalidExpression = (text: IToken) => {
        return new Invalid(text);
    }

    literal = (text: IToken) => {
        return new Literal(text);
    }

    nullLiteral = (range: RangeType) => {
        return new NullLiteral(range);
    }

    nameIdentifier = (nameToken: IToken) => {
        return new NameIdentifier(nameToken);
    }

    callExpression = (callee: ASTNode, argumentList: Arguments) => {
        return new CallExpression(callee, argumentList);
    }

    arguments = (openParen: IToken, args: ASTNode[], delimiters: IToken[], closeParen?: IToken) => {
        return new Arguments(openParen, args, delimiters, closeParen);
    }

    identifier = (reference: IToken) => {
        return new Identifier(reference);
    }
}