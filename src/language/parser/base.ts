import { EmbeddedActionsParser, TokenType, IToken } from 'chevrotain';

import { AstRule } from '../interface';
import { ASTNode } from '../AST/_Base';

import { ASTNodeFactory } from './factory';
import { MissingNodeCreator } from './missingNodeCreator';

import { tokens, Comma } from '../lexer/token';

// https://coda.io/welcome
export class BaseParser extends EmbeddedActionsParser {
    protected nodeFactory: ASTNodeFactory;

    constructor(
        public text: string,
    ) {
        super(tokens, {
            maxLookahead: 2
        });

        const missingNodeCreator = new MissingNodeCreator(text);
        this.nodeFactory = new ASTNodeFactory(missingNodeCreator);
    }

    protected binaryRuleAlt1 = (rule: AstRule, operatorToken: TokenType) => {
        let lhs: ASTNode; 

        this.AT_LEAST_ONE(() => {
            const operator = this.CONSUME(operatorToken);
            let rhs: ASTNode;
            this.OPTION(() => {
                rhs = this.SUBRULE(rule);
            });

            lhs = this.ACTION(() => this.nodeFactory.binaryExpression(lhs, operator, rhs));
        });

        return this.ACTION(() => lhs); 
    }

    protected binaryRuleAlt2 = (rule: AstRule, operatorToken: TokenType) => {
        let lhs = this.SUBRULE2(rule);
        this.MANY(() => {
            let rhs: ASTNode;

            const operator = this.CONSUME2(operatorToken);
            this.OPTION2(() => {
                rhs = this.SUBRULE3(rule);
            });

            lhs = this.ACTION(() => this.nodeFactory.binaryExpression(lhs, operator, rhs));
        });

        return this.ACTION(() => lhs);
    }

    protected binaryRule = (rule: AstRule, operatorToken: TokenType) => {
        return this.OR([
            { 
                ALT: () => this.binaryRuleAlt1(rule, operatorToken),
            },
            {
                ALT: () => this.binaryRuleAlt2(rule, operatorToken),
            },
        ]);
    }

    private isASTNode = (node?: ASTNode | IToken): node is ASTNode => {
        return node instanceof ASTNode;
    }

    private isComma = (node?: ASTNode | IToken): node is IToken => {
        return !this.isASTNode(node) && node?.tokenType.name === Comma.name;
    }

    private getPrevToken = (token: IToken) => {
        const input = this.input || [];
        const index = input.findIndex((item) => item === token);
        return input[index - 1];
    }

    private getNextToken = (token: IToken) => {
        const input = this.input || [];
        const index = input.findIndex((item) => item === token);
        return input[index + 1];
    }

    private getPrevTokenEnd = (token: IToken) => {
        var prevToken = this.getPrevToken(token);
        return prevToken ? prevToken.endOffset! : 0;
    }

    private getNextTokenStart = (token: IToken) => {
        var nextToken = this.getNextToken(token);
        return nextToken ? nextToken.startOffset : this.text.length;
    }

    protected fixArguments = (args: (ASTNode | IToken)[]) => {
        const _arguments: (ASTNode | IToken)[] = [];

        args.forEach((arg, index) => {
            const prev = index === 0 ? undefined : args[index - 1];

            if (this.isComma(arg) && (this.isComma(prev) || !prev)) {
                const startOffset = this.getPrevTokenEnd(arg);
                _arguments.push(this.nodeFactory.nullLiteral([startOffset, arg.startOffset]));
            }

            _arguments.push(arg);
        });

        const lastArg = args.slice(-1)[0];
        if (this.isComma(lastArg)) {
            var endOffset = this.getNextTokenStart(lastArg);
            _arguments.push(this.nodeFactory.nullLiteral([lastArg.endOffset!, endOffset]));
        }

        return {
            argumentList: _arguments.filter(arg => this.isASTNode(arg)) as ASTNode[],
            delimiters: _arguments.filter(arg => !this.isASTNode(arg)) as IToken[],
        };
    }
}