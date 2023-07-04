import {type EditorView} from '@codemirror/view';
import {EditorSelection} from '@codemirror/state';

const defaultListenerMapping = {
  bold: (view: EditorView) => () => {
    wrapWithChars('**', view);
    view.focus();
  },
  italic: (view: EditorView) => () => {
    wrapWithChars('_', view);
    view.focus();
  },
  strike: (view: EditorView) => () => {
    wrapWithChars('~', view);
    view.focus();
  },
  hr: (view: EditorView) => () => {
    insertLine('---', view);
    view.focus();
  },
  quote: (view: EditorView) => () => {
    insertLine('> ', view);
    view.focus();
  },
  ul: (view: EditorView) => () => {
    insertLine('- ', view);
    view.focus();
  },
  ol: (view: EditorView) => () => {
    insertLine('1. ', view);
    view.focus();
  },
  task: (view: EditorView) => () => {
    insertLine('- [ ] ', view);
    view.focus();
  },
  code: (view: EditorView) => () => {
    wrapWithChars('`', view);
    view.focus();
  },
  codeblock: (view: EditorView) => () => {
    wrapWithChars('```', view);
    view.focus();
  },
} as const;

function wrapWithChars(chars: string, view: EditorView) {
  const {state} = view;

  state.changeByRange(range => {
    const changes = [
      {from: range.from, insert: chars},
      {from: range.to, insert: chars},
    ];

    view.dispatch({
      changes,
      selection: {anchor: range.to + (2 * chars.length)},
      scrollIntoView: true,
    });

    return {
      changes,
      range: EditorSelection.range(range.from, range.to + (2 * chars.length)),
    };
  });
}

function insertLine(line: string, view: EditorView) {
  const {state} = view;

  state.changeByRange(range => {
    const insertPos = range.from;
    const changes = {from: insertPos, insert: '\n' + line};

    view.dispatch({
      changes,
      selection: {anchor: insertPos + line.length + 1},
      scrollIntoView: true,
    });

    return {changes, range: EditorSelection.range(insertPos, insertPos + line.length + 1)};
  });
}

export type ButtonType = keyof typeof defaultListenerMapping;
export const defaultButtonTypes: ButtonType[] = Object.keys(defaultListenerMapping) as ButtonType[];

export const createDefaultButtonListener = (buttonType: ButtonType, view: EditorView) => defaultListenerMapping[buttonType](view);
