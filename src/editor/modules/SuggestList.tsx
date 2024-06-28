
import { useState } from 'react';

import { FieldType, FunctionType } from '../../editorInput/interface';

export default function SuggestList({ 
    fields,
    functions,
}: {
    fields: FieldType[],
    functions: FunctionType[],
}) {
    const [selectedItem, setSelectedItem] = useState<FieldType | FunctionType>();

    const renderField = (item: FieldType) => {
        return (
            <div 
                className="flex items-center justify-between"
                onMouseOver={() => setSelectedItem(item)}
            >
                <div className="flex items-center pl-1">
                    <span dangerouslySetInnerHTML={{ __html: item.iconSvg || '' }} className="mr-2"></span>
                    {item.name}
                </div>
                <div className="formula-editor-suggest__tabIcon">
                    Tab
                </div>
            </div>
        )
    }

    const renderFunction = (item: FunctionType) => {
        return (
            <div 
                className="flex items-center justify-between" 
                onMouseOver={() => setSelectedItem(item)}
            >
                <div className="flex items-center">
                    <span className="mr-1"></span>
                    {item.name?.toUpperCase()}()
                </div>
                <div className="formula-editor-suggest__tabIcon">
                    Tab
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {
                fields.length ? (
                    <div>
                        <div className="formula-editor-suggest__title">字段引用</div>
                        {
                            fields.map((item, index) => (
                                <div key={index} className={`formula-editor-suggest__item ${selectedItem === item ? 'formula-editor-suggest__item--selected' : ''}`}>
                                    { renderField(item) }
                                </div>
                            ))
                        }
                    </div>
                ) : ''
            }
            {
                functions.length ? (
                    <div>
                        <div className="formula-editor-suggest__title">函数列表</div>
                        {
                            functions.map((item, index) => (
                                <div key={index} className={`formula-editor-suggest__item ${selectedItem === item ? 'formula-editor-suggest__item--selected' : ''}`}>
                                    { renderFunction(item) }
                                </div>
                            ))
                        }
                    </div>
                ) : ''
            }
        </div>
    );
}