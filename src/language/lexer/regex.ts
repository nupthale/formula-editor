/**
 * 函数名需要右侧存在左括号，故意支持了中文，考虑未来支持自定义函数
 * 正则元素
 * 函数名 {required} - 由任意语言的字母、下划线构成；\p{L}任何语言的一个字母
 * 括号 {先行断言} - 括号前可以有任意多个空白符，且支持中文括号\nFF08
 * 
 * 匹配出的funcitonNameToken, 不包括后续的空白符和括号
 * 
 * @example
 * sum() 
 */
// chevrotain不支持unicode的正则，如果要使用，需要在自定义pattern内自己实现
// export const functionNameRegex = /([\p{L}_]+)(?=\s*[(\uFF08])/iu;
export const functionNameRegex = /([a-zA-Z_0-9]+)(?=\s*[(\uFF08])/i;

/**
 * 正则元素， [开始， ]结束
 * fragment {optional} - 除]和换行符外的字符
 * \\. - \\可以跟任意字符，也就是说任何转义的字符
 * 
 * 字符串的引号、名称引用的方括号、以及Invalid token不允许包含 ID 引用
 * 这是为了保证在编辑过程中，ID引用要始终保持不变的原子形态， 不能露出原型
 * 
 * @example
 * 匹配 [abc] [] [\\]] [\\]等
 * 不匹配 [\] 
 */
export const quotedFragment = String.raw`\[(?:(?!\]|\n).)*\]`;

// 允许： 除]和换行符外的字符
export const quotedNameReferenceRegex = RegExp(`${quotedFragment}`, 'i');

// 排除运算符 +\-*/%<>=!&
// 排除括号 [], (), 中文括号\nFF08 \uFF09
// 排序引号 ""
// 排除标点 , . : 中文冒号\uFF1A 中文逗号\uFF0C 中文分号\uFF1B
// 排除特殊符号 | \\
// 排除换行制表符 \n\r\t
export const unQuotedNameReferenceRegex = /([^+\-*/%<>=!:[\]()\\",.|&\uFF08\uFF09\uFF1A\uFF01\uFF0C\uFF1B\n\r\t\$]+)(?<!\s)/iu;

/**
 * ID引用， 这是最终公式里存放的引用形式
 * 
 * @example
 * $$[f3delg:table]
 * $$[id:...customProps]
 */
export const idReferenceFragment = String.raw`\$\$${quotedFragment}`;

export const idReferenceRegex = RegExp(`${idReferenceFragment}`, 'i');

// 需要考虑和名称引用的冲突，比如true1 不能解析为true 和 1 两个token
// 而是一个名为true1的引用， 123abc 也同理， 不能是123 和 abc 两个token
export const numberLiteralRegex = /(\d*\.?\d+)(?:E[+-]?[0-9]+)?(?!\w)/;

export const booleanLiteralRegex = /(true|false)(?!\w)/i;

/**
 * 字符串的引号、名称引用的方括号、以及Invalid token不允许包含 ID 引用
 * 这是为了保证在编辑过程中，ID引用要始终保持不变的原子形态， 不能露出原型
 * 
 * @example
 * 匹配 "\\"" "abc\\*" "\\"
 * 不匹配 "\"
 */
export const stringLiteralRegex = /"(?:(?!\$\$\[.*\]).)*"/;

/**
 * 这里要用\s， 不能是[\r\n\t]， 因为\s包含&nbsp;等空白符，但是直接输入不包含
 */
export const whitespaceRegex = /[\s\r\n\t]/;

// 每个无法识别的符号都是一个invalidToken，如${解释为2个invalidToken
export const invalidRegex = /(?:(?!\$\$\[.*\]).)/;