import { useState, useMemo } from 'react';
import ReactJson from 'react-json-view';

import Editor from './editor';
import { parse } from './language/index';

import { TreeView } from './components/TreeView';
import { editorContext } from './context';

import './editor/index.less';
import './App.css'

// console.info('####', lexer.tokenize('"$$$[1] + sum(1, 2)').tokens);
// console.info('####', lexer.tokenize('"sum() + $$[]').tokens);
// console.info('####', lexer.tokenize('[abc] + sum() + true + 123()').tokens);
// console.info('####', lexer.tokenize('sum()').tokens);

// console.info('####', parse('1 + 2'));
// console.info('####', parse('[abc] + sum() + true + 123()'));

// const { errors, ast, astJson } = parse('[abc] + sum() + true + dd()');
// const json = errors?.length ? { errors } : astJson;

function App() {
  const [doc, setDoc] = useState('$$[32:number] + $$sum1(1 + 1) + abc + $$[1:number] + $$[31:number] + 项');
  // const [doc, setDoc] = useState('1 +  sum(1, $$[1:string], $$[1:string], $$[1:string], $$[1:string], $$[1:string], $$[1:string])  + sum(1, sum(xiang))   ');

  const [json, ast] = useMemo(() => {
    const { errors, ast, astJson } = parse(doc);

    return [errors?.length ? { errors } : astJson, ast];
  }, [doc]);

  return (
    <div className="flex w-full h-full">
      <div className="w-4/12 h-full overflow-auto	">
        { json ? <ReactJson src={json}></ReactJson> : '' }
      </div>
      <div className="w-4/12 h-full editorSection">
        <Editor context={editorContext} defaultDoc={doc} onChange={setDoc} debug />
      </div>
      <div className="w-4/12 h-full overflow-auto">
        { ast ? <TreeView formula={ast} ></TreeView> : '' }
      </div>
    </div>
  )
}

export default App
