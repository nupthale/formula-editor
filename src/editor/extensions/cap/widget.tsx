import { WidgetType } from '@codemirror/view';
import { FieldType } from '../../interface';

export class CapWidget extends WidgetType {
  constructor(
    readonly field: FieldType,
    readonly selected: boolean,
  ) { super() }

  eq(other: CapWidget) { return other.field.id === this.field.id && this.selected === other.selected }

  toDOM() {
    let wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.className = `cm-id-cap ${this.selected ? 'cm-id-cap--selected' : ''}`;
    wrap.id = this.field.id;

    let text = wrap.appendChild(document.createElement('span'));
    text.innerText = this.field.name;

    let icon = wrap.appendChild(document.createElement('span'));
    icon.innerHTML = this.field.iconSvg;

    return wrap
  }

  ignoreEvent() { return false; }
}