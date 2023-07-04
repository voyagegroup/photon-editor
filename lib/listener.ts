import {type EditorView} from '@codemirror/view';
import {EditorSelection} from '@codemirror/state';

const defaultListenerMapping = {
  bold: (view: EditorView) => () => {
    view.dispatch(view.state.changeByRange(range => ({
      changes: [
        {from: range.from, insert: '**'},
        {from: range.to, insert: '**'},
      ],
      range: EditorSelection.range(range.from, range.to + 4),
    })));
  },
} as const;

export type ButtonType = keyof typeof defaultListenerMapping;
export const defaultButtonTypes: ButtonType[] = Object.keys(defaultListenerMapping) as ButtonType[];

export const createDefaultButtonListener = (buttonType: ButtonType, view: EditorView) => defaultListenerMapping[buttonType](view);
