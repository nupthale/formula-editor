import { useMemo } from 'react';
import Tree, { RawNodeDatum } from 'react-d3-tree';

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
import { ASTNode } from '../../language/AST/_Base';

class Visitor {
     private visit = (node: ASTNode): RawNodeDatum => {
        const type = node.type;
        const next = this[`visit${type}` as keyof Visitor];
        
        // @ts-ignore
        return next(node);
     }
    
     public visitFormula = (node: Formula) => {
        return {
            name: node.type,
            attributes: {
                propKeys: '["body"]',
                range: node.range.join(','),
            },
            children: [
                this.visit(node.body),
            ],
        }        
     }

     protected visitBinaryExpression = (node: BinaryExpression) => {
        const prop = node.serializeExpr();
        
        return {
            name: node.type,
            attributes: {
                operator: prop.operator,
                propKeys: '["lhs", "rhs"]',
                range: node.range.join(','),
            },
            children: [
                this.visit(node.lhs),
                this.visit(node.rhs),
            ],
        }
     }

     protected visitArguments = (node: Arguments) => {
        return {
            name: node.type,
            attributes: {
                missingRightParen: !node.closeParen,
                propKeys: '["arguments"]',
                range: node.range.join(','),
            },
            children: node.args.map(arg => this.visit(arg)),
        }
     }

     protected visitCallExpression = (node: CallExpression) => {
        return {
            name: node.type,
            attributes: {
                propKeys: '["callee", "arguments"]',
                range: node.range.join(','),
            },
            children: [
                this.visit(node.callee),
                this.visit(node.argumentList),
            ],
        }
     }

     protected visitIdentifier = (node: Identifier) => {
        const props = node.serializeExpr();

        return {
            name: node.type,
            attributes: {
                refType: props.refType,
                id: props.id,
                range: node.range.join(','),
            },
        }
     }

     protected visitInvalid = (node: Invalid) => {
        return {
            name: node.type,
            attributes: {
                text: node.text.image,
                range: node.range.join(','),
            },
        }
     }

     protected visitLiteral = (node: Literal) => {
        return {
            name: node.type,
            attributes: {
                value: node.value,
                range: node.range.join(','),
            },
        }
     }

     protected visitMemberExpression = (node: MemberExpression) => {
        return {
            name: node.type,
            attributes: {
                propKeys: '["object", "property"]',
                range: node.range.join(','),
            },
            children: [
                this.visit(node.object),
                this.visit(node.property),
            ],
        }
     }

     protected visitNameIdentifier = (node: NameIdentifier) => {
        return {
            name: node.type,
            attributes: {
                name: node.name,
                range: node.range.join(','),
            },
        }
     }

     protected visitNullLiteral = (node: NullLiteral) => {
        return {
            name: node.type,
            attributes: {
                range: node.range.join(','),
            },
        }
     }

     protected visitParenthesizedExpression = (node: ParenthesizedExpression) => {
        return {
            name: node.type,
            attributes: {
                propKeys: '["expression"]',
                range: node.range.join(','),
            },
            children: [
                this.visit(node.expression),
            ],
        }
     }

     protected visitUnaryExpression = (node: UnaryExpression) => {
        const prop = node.serializeExpr();

        return {
            name: node.type,
            attributes: {
                operator: prop.operator,
                propKeys: '["operand"]',
                range: node.range.join(','),
            },
            children: [
                this.visit(node.operand),
            ],
        }
     }
}

const toTreeData = (json: Formula) => {
    const visitor = new Visitor();
    const data = visitor.visitFormula(json);

    return data;
}   


export const TreeView = ({ formula }: { formula: Formula }) => {
    const data = useMemo(() => {
        return toTreeData(formula);
    }, [formula]);

    const bodyRect = document.body.getBoundingClientRect();
    const dimensions = {
        width: bodyRect.width / 3,
        height: bodyRect.height,
    };

    return <Tree data={data} orientation='vertical' dimensions={dimensions} translate={{ x: dimensions.width / 2, y: 80 }}></Tree>;
}