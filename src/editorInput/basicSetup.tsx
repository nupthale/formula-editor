import {
    keymap, 
    highlightSpecialChars, 
    drawSelection, 
} from "@codemirror/view";

import { Extension } from "@codemirror/state";

import {
    indentOnInput, 
    bracketMatching,
} from "@codemirror/language";

import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";

import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

export const basicSetup: Extension = (() => [
    highlightSpecialChars(),
    history(),

    drawSelection(),
    indentOnInput(),
    
    bracketMatching(),
    closeBrackets(),
    autocompletion(),

    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap,
    ])
  ])()