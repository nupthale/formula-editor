import { IToken } from 'chevrotain';

import {
    LogicOperator,
    ComparisonOperator,
    Concatenate,
    AdditionOperator,
    MultiplicationOperator,
    Point,
    OpenParen,
    CloseParen,
    Literal,
    Name, 
    EscapeName,
    Identifier,
    FunctionName,
    Comma,
    Invalid,
} from '../lexer/token';

import { AstRule } from '../interface';
import { ASTNode } from '../AST/_Base';
import { Arguments } from '../AST/Arguments';
import { BaseParser } from './base';
import { CallExpression } from '../AST/CallExpression';

export class Parser extends BaseParser {
    public parse = () => {
        const body = this.formula();
        return this.nodeFactory.formula(body);
    }

    /**
     * formula
     * : logical logical* EOF
     */
    public formula = this.RULE<AstRule>('formula', () => {
        let lhs: ASTNode = this.SUBRULE(this.logical);

        let rhs: ASTNode;
        this.MANY(() => {
            rhs = this.SUBRULE2(this.logical);

            this.ACTION(() => {
                lhs = this.nodeFactory.binaryExpression(lhs, null, rhs);
            });
        });

        return this.ACTION(() => {
            return lhs;
        });
    });

    /**
     * logical
     * : comparison (LogicOperator comparison?)*
     * | (LogicaOperator comparison?)+ 
     */
    private logical: AstRule = this.RULE<AstRule>('logical', () => {
        return this.binaryRule(this.comparison, LogicOperator);
    });

    /**
     * comparison
     * : concatenation (ComparisonOperator concatenation?)*
     * | (ComparisonOperator concatenation?)+
     */
    private comparison: AstRule = this.RULE<AstRule>('comparison', () => {
        return this.binaryRule(this.concatenation, ComparisonOperator);
    });

    /**
     * concatenation
     * : addition (Concatenate addition?)*
     * | (Concatenate addition?)+
     */  
    private concatenation: AstRule = this.RULE<AstRule>('concatenation', () => {
        return this.binaryRule(this.addition, Concatenate);
    });

    /**
     * addition和其他binary不同，只有一条规则的原因：
     * addition和prefix是有交集，addition如果缺左值，则识别为prefix
     * 
     * addition
     * : multiplication (AdditionOperator multiplication?)*
     */   
    private addition: AstRule = this.RULE<AstRule>('addition', () => {
        return this.binaryRuleAlt2(this.multiplication, AdditionOperator);
    });

    /**
     * multiplication
     * : primary (MultiplicationOperator primary?)*
     * | (MultiplicationOperator primary?)+
     */
    private multiplication: AstRule = this.RULE<AstRule>('multiplication', () => {
        return this.binaryRule(this.primary, MultiplicationOperator);
    });

    /**
     * primary
     * : primaryPrime ('.' identifier?)*
     * | ('.' identifier?)+
     */
    private primary: AstRule = this.RULE<AstRule>('primary', () => {
        return this.OR([
            { 
                ALT: () => {
                    let object = this.SUBRULE(this.primaryPrime);
                    this.MANY(() => {
                        const point = this.CONSUME(Point);
                        let property: ASTNode;

                        this.OPTION(() => {
                            property = this.SUBRULE(this.identifier);
                        });

                        this.ACTION(() => {
                            if (property instanceof CallExpression) {
                                object = this.nodeFactory.callExpression(
                                    this.nodeFactory.memberExpression(object, point, property.callee), 
                                    property.argumentList,
                                );
                            } else {
                                object = this.nodeFactory.memberExpression(object, point, property);
                            }
                        });
                    });

                    return this.ACTION(() => object);
                } 
            },
            { 
                ALT: () => {
                    let object: ASTNode;

                    this.AT_LEAST_ONE(() => {
                        const point = this.CONSUME2(Point);
                        let property: ASTNode;

                        this.OPTION2(() => {
                            property = this.SUBRULE2(this.identifier);
                        });

                        object = this.ACTION(() => this.nodeFactory.memberExpression(object, point, property));
                    });
                    
                    return this.ACTION(() => object);
                } 
            },
        ]); 
    });

    /**
     * primaryPrime
     * : parenthesized
     * | literal
     * | identifier
     * | invalid
     * | prefix
     */
    private primaryPrime: AstRule = this.RULE<AstRule>('primaryPrime', () => {
        return this.OR([
            { ALT: () => this.SUBRULE(this.parenthesized) },
            { ALT: () => this.SUBRULE(this.literal) },
            { ALT: () => this.SUBRULE(this.identifier) },
            { ALT: () => this.SUBRULE(this.invalid) },
            { ALT: () => this.SUBRULE(this.prefix) },
        ]);
    });

    /**
     * prefix
     * : ('+' | '-')+ primary? 
     */
    private prefix: AstRule = this.RULE<AstRule>('prefix', () => {
        let operators: IToken[] = [];
        let operand: ASTNode;

        this.AT_LEAST_ONE(() => {
            const operator = this.CONSUME(AdditionOperator);

            this.ACTION(() => operators.push(operator));
        }); 

        this.OPTION(() => {
            operand = this.SUBRULE(this.primary);
        });

        return this.ACTION(() => {
            operators.reverse().forEach(operator => {
                operand = this.nodeFactory.unaryExpression(operator, operand);
            });

            return operand;
        });
    });

    /**
     * parenthesized
     * : '(' formula? ')'?
     */
    private parenthesized: AstRule = this.RULE<AstRule>('parenthesized', () => {
        const openParen = this.CONSUME(OpenParen);
        let expression: ASTNode | null = null;
        let closeParen: IToken | null = null;
        
        this.OPTION(() => {
            expression = this.SUBRULE(this.formula);
        });

        this.OPTION2(() => {
            closeParen = this.CONSUME(CloseParen);
        });

        return this.ACTION(() => this.nodeFactory.parenthesizedExpression(openParen, expression, closeParen));
    });

    /**
     * literal
     * : NUMBER | BOOLEAN | STRING
     */
    private literal: AstRule = this.RULE<AstRule>('literal', () => {
        const text = this.CONSUME(Literal);

        return this.ACTION(() => this.nodeFactory.literal(text));
    });

    /**
     * identifier
     * : reference 
     * | call
     */
    private identifier: AstRule = this.RULE<AstRule>('identifier', () => {
        return this.OR([
            { ALT: () => this.SUBRULE(this.reference) },
            { ALT: () => this.SUBRULE(this.call) },
        ]);
    });

    /**
     * reference
     * : NAME | ESCAPENAME | IDENTIFIER
     */
    private reference: AstRule = this.RULE<AstRule>('reference', () => {
        return this.OR([
            { 
                ALT: () => {
                    const name = this.CONSUME(Name);
                    return this.ACTION(() => this.nodeFactory.nameIdentifier(name));
                } 
            },
            { 
                ALT: () => {
                    const name = this.CONSUME(EscapeName);
                    return this.ACTION(() => this.nodeFactory.nameIdentifier(name));
                } 
            },
            { 
                ALT: () => {
                    const reference = this.CONSUME(Identifier);
                    return this.ACTION(() => this.nodeFactory.identifier(reference));
                } 
            }
        ]);
    });

    /**
     * call
     * : FUNCIONNAME arguments
     */
    private call: AstRule = this.RULE<AstRule>('call', () => {
        const functionName = this.CONSUME(FunctionName);
        let callee = this.ACTION(() => this.nodeFactory.identifier(functionName));

        const argumentList = this.SUBRULE(this.arguments) as Arguments;

        return this.ACTION(() => this.nodeFactory.callExpression(callee, argumentList));
    });

    /**
     * arguments
     * : '(' formula? (',' formula?)* ')'?
     */
    private arguments: AstRule = this.RULE<AstRule>('arguments', () => {
        const openParen = this.CONSUME(OpenParen);
        const _arguments: (ASTNode | IToken)[] = [];
        let closeParen: IToken;

        this.OPTION(() => {
            _arguments.push(this.SUBRULE(this.formula));
        });

        this.MANY(() => {
            _arguments.push(this.CONSUME(Comma));

            this.OPTION2(() => _arguments.push(this.SUBRULE2(this.formula)));
        });

        this.OPTION3(() => closeParen = this.CONSUME(CloseParen));

        return this.ACTION(() => {
            const { argumentList, delimiters } = this.fixArguments(_arguments);

            return this.nodeFactory.arguments(openParen, argumentList, delimiters, closeParen);
        });
    });

    /**
     * invalid
     * : INVALID
     */
    private invalid: AstRule = this.RULE<AstRule>('invalid', () => {
        const invalid = this.CONSUME(Invalid);
        return this.ACTION(() => this.nodeFactory.invalidExpression(invalid));
    });

    constructor(
        public text: string,
    ) {
        super(text);

        this.performSelfAnalysis();
    }
}