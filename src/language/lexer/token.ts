import { createToken, Lexer } from 'chevrotain';

import { 
    quotedNameReferenceRegex,
    unQuotedNameReferenceRegex,
    functionNameRegex,
    idReferenceRegex,
    stringLiteralRegex, 
    numberLiteralRegex, 
    booleanLiteralRegex,
    whitespaceRegex,
    invalidRegex,
} from './regex';

/**
 * Literal
 */
export const Literal = createToken({ name: 'Literal', pattern: Lexer.NA });
export const String = createToken({ name: 'String', pattern: stringLiteralRegex, categories: [Literal] });
export const Number = createToken({ name: 'Number', pattern: numberLiteralRegex, categories: [Literal] });
export const Boolean = createToken({ name: 'Boolean', pattern: booleanLiteralRegex, categories: [Literal] });

/**
 * Operator
 */
export const LogicOperator = createToken({ name: 'LogicOperator', pattern: Lexer.NA });
export const And = createToken({name: 'And', pattern: /&&/, categories: [LogicOperator]});
export const Or = createToken({name: 'Or', pattern: /\|\|/, categories: [LogicOperator]});

export const ComparisonOperator = createToken({ name: 'ComparisonOperator', pattern: Lexer.NA });
export const Equals = createToken({name: 'Equals', pattern: /=/, categories: [ComparisonOperator]});
export const NotEquals = createToken({name: 'NotEquals', pattern: /<>/, categories: [ComparisonOperator]});
export const GreatorThan = createToken({name: 'GreatorThan', pattern: />|>=/, categories: [ComparisonOperator]});
export const LessThan = createToken({name: 'LessThan', pattern: /<|<=/, categories: [ComparisonOperator]});

export const Concatenate = createToken({ name: "Concatenate", pattern: /&/ });

export const AdditionOperator = createToken({ name: 'AdditionOperator', pattern: Lexer.NA });
export const Add = createToken({ name: "Add", pattern: /\+/, categories: [AdditionOperator] });
export const Minus = createToken({ name: "Minus", pattern: /-/, categories: [AdditionOperator] });


export const MultiplicationOperator = createToken({ name: 'MultiplicationOperator', pattern: Lexer.NA });
export const Multiply = createToken({ name: "Multiply", pattern: /\*/, categories: [MultiplicationOperator] });
export const Divide = createToken({ name: "Divide", pattern: /\//, categories: [MultiplicationOperator] });

/**
 * Identifier
 */
export const Identifier = createToken({ name: 'Identifier', pattern: idReferenceRegex });
export const EscapeName = createToken({ name: 'EscapeName', pattern: quotedNameReferenceRegex });
export const Name = createToken({ name: 'Name', pattern: unQuotedNameReferenceRegex });
export const FunctionName = createToken({ name: 'FunctionName', pattern: functionNameRegex });

export const OpenParen = createToken({ name: 'OpenParen', pattern: /\(/ });
export const CloseParen = createToken({ name: 'CloseParen', pattern: /\)/ });
export const Comma = createToken({ name: 'Comma', pattern: /,/ });
export const Point = createToken({ name: 'Point', pattern: /\./ });

export const Whitespace = createToken({ name: 'Whitespace', pattern: whitespaceRegex, group: Lexer.SKIPPED, });
export const Invalid = createToken({ name: 'Invalid', pattern: invalidRegex });

export const tokens = [
    // note we are placing WhiteSpace first as it is very common thus it will speed up the lexer.
    Whitespace,

    And,
    Or,

    AdditionOperator,
    Add,
    Minus,

    MultiplicationOperator,
    Multiply,
    Divide,

    ComparisonOperator,
    Equals,
    NotEquals,
    GreatorThan,
    LessThan,

    Concatenate,

    OpenParen,
    CloseParen,
    Comma,
    Point,

    Literal,
    String,
    Number,
    Boolean,

    FunctionName,
    EscapeName,
    Identifier,
    Name,

    Invalid,
];

export const lexer = new Lexer(tokens, {
    /**
     * This flag will avoid running the Lexer validations during Lexer initialization.
     * This can substantially improve the Lexer's initialization (constructor) time.
     */
    skipValidations: false,
});