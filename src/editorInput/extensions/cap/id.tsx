import { Identifier } from '../../../language/AST/Identifier';

// cap的id由node.id+node.range[0]组成
export const capId = (node: Identifier) => {
    return `${node.id}_${node.range[0]}`;
}