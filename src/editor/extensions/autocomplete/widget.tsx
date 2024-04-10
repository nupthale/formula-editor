import { WidgetType } from '@codemirror/view';

export class InlineAutoCompleteWidget extends WidgetType {
  constructor(
    readonly text: string,
  ) { super() }

  eq(other: InlineAutoCompleteWidget) { return other.text === this.text }

  toDOM() {
    let wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.className = `cm-inline-autocomplete`;
    wrap.innerText = this.text;

    return wrap
  }

  ignoreEvent() { return true; }
}