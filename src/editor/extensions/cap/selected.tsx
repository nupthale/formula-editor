import { StateField, StateEffect } from '@codemirror/state';

export const selectCap = StateEffect.define<string | undefined>({
    map: (value) => (value)
  })

export const selectedCapIdState = StateField.define<string | undefined>({
    create() {
        return undefined;
    },
    update(value, tr) {
        let id;
        let isSelectCap = false;

        for (let e of tr.effects) {
            if (e.is(selectCap)) {
                isSelectCap = true;
                id = e.value;
            }
        }

        return isSelectCap ? id : value;
    },
});
  