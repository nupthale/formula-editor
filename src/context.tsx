import { EditorContext } from './editor/interface';

export const editorContext: EditorContext = {
    fields: [{
        id: '1',
        name: '项目',
        type: 'string',
        iconSvg: '<?xml version="1.0" encoding="UTF-8"?><svg width="12" height="12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 42L8.94118 30M32 42L27.0588 30M27.0588 30L25 25L18 8L11 25L8.94118 30M27.0588 30H8.94118" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M28 10L44 10" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M32 20L44 20" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M36 30L44 30" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M40 40H44" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/></svg>',
        category: '组1',
        description: '数据表 的一列，返回当前行中该列对应的值，可用于公式计算',
    }, {
        id: '2',
        name: '金额',
        type: 'number',
        iconSvg: '<?xml version="1.0" encoding="UTF-8"?><svg width="12" height="12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="none" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20 16H25H27C29.2091 16 31 17.7909 31 20C31 22.2091 29.2091 24 27 24H20V16Z" fill="none"/><path d="M20 16V24H27C29.2091 24 31 22.2091 31 20V20C31 17.7909 29.2091 16 27 16H25M20 16H16M20 16V12M20 16H25M25 16V12" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20 24H29C31.2091 24 33 25.7909 33 28C33 30.2091 31.2091 32 29 32H25H20V24Z" fill="none"/><path d="M20 32V24H29C31.2091 24 33 25.7909 33 28V28C33 30.2091 31.2091 32 29 32H25M20 32V36M20 32H16H25M20 32H25M25 32V36" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/></svg>',
        category: '组1',
        description: '数据表 的一列，返回当前行中该列对应的值，可用于公式计算',
    }, {
        id: '3',
        name: '项目一号文',
        type: 'number',
        iconSvg: '<?xml version="1.0" encoding="UTF-8"?><svg width="12" height="12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="none" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20 16H25H27C29.2091 16 31 17.7909 31 20C31 22.2091 29.2091 24 27 24H20V16Z" fill="none"/><path d="M20 16V24H27C29.2091 24 31 22.2091 31 20V20C31 17.7909 29.2091 16 27 16H25M20 16H16M20 16V12M20 16H25M25 16V12" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20 24H29C31.2091 24 33 25.7909 33 28C33 30.2091 31.2091 32 29 32H25H20V24Z" fill="none"/><path d="M20 32V24H29C31.2091 24 33 25.7909 33 28V28C33 30.2091 31.2091 32 29 32H25M20 32V36M20 32H16H25M20 32H25M25 32V36" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/></svg>',
        category: '组1',
        description: '数据表 的一列，返回当前行中该列对应的值，可用于公式计算',
    }, {
        id: '4',
        name: '项目二号文',
        type: 'number',
        iconSvg: '<?xml version="1.0" encoding="UTF-8"?><svg width="12" height="12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="none" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20 16H25H27C29.2091 16 31 17.7909 31 20C31 22.2091 29.2091 24 27 24H20V16Z" fill="none"/><path d="M20 16V24H27C29.2091 24 31 22.2091 31 20V20C31 17.7909 29.2091 16 27 16H25M20 16H16M20 16V12M20 16H25M25 16V12" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20 24H29C31.2091 24 33 25.7909 33 28C33 30.2091 31.2091 32 29 32H25H20V24Z" fill="none"/><path d="M20 32V24H29C31.2091 24 33 25.7909 33 28V28C33 30.2091 31.2091 32 29 32H25M20 32V36M20 32H16H25M20 32H25M25 32V36" stroke="#BFBE99" stroke-width="4" stroke-linecap="round" stroke-linejoin="miter"/></svg>',
        category: '组1',
        description: '数据表 的一列，返回当前行中该列对应的值，可用于公式计算',
    }],
    functions: [{
        name: 'sum',
        params: [{
            name: '值1',
            type: 'number',
            description: '第一个参数，数字类型',
        }, {
            name: 'value2',
            type: 'number',
            description: '第二个参数，数字类型',
        }],
        fixedParamsLen: false,
        example: 'sum(1, 2, 3) = 6',
    }, {
        name: 'sumif',
        params: [{
            name: 'value1',
            type: 'number',
            description: '第一个参数，数字类型',
        }, {
            name: 'value2',
            type: 'number',
            description: '第二个参数，数字类型',
        }],
        fixedParamsLen: false,
        example: 'sumif(1, 2, 3) = 6',
    }],
};