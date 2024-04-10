import { useState, useMemo } from 'react';
import ReactJson from 'react-json-view';
import { NodeDescType } from './editor/interface';

import Editor from './editor';
import { parse } from './language/index';

import { useNodeDesc } from './hooks/useNodeDesc';

import { TreeView } from './components/TreeView';
import { editorContext } from './context';

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
  // 当前ast node
  const [node, setNode] = useState<NodeDescType | null>(null);

  const [json, ast] = useMemo(() => {
    const { errors, ast, astJson } = parse(doc);

    return [errors?.length ? { errors } : astJson, ast];
  }, [doc]);

  const nodeDesc = useNodeDesc({ node });

  return (
    <div>
      {/* 编辑区 */}
      <div>
        <Editor context={editorContext} defaultDoc={doc} onChange={setDoc} onNodeChange={setNode} />
      </div>

      {/* 提示区 */}
      {
        nodeDesc && (
          <div className="description">
            {nodeDesc}
          </div>
        )
      }

      {/* ast区 */}
      <div className="flex w-full h-full">
        <div className="w-6/12">
          { json ? <ReactJson src={json}></ReactJson> : '' }
        </div>
        <div className="w-6/12">
          { ast ? <TreeView formula={ast} ></TreeView> : '' }
        </div>
      </div>
    </div>
  )
}

export default App
