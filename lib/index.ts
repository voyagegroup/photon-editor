import {defaultKeymap} from '@codemirror/commands';
import {EditorState} from '@codemirror/state';
import {keymap, EditorView} from '@codemirror/view';
import {markdown} from '@codemirror/lang-markdown';

type Options = {
  value: string | undefined;
};

class PhotonEditor {
  private editor: EditorView | undefined;

  constructor(
    private readonly element: HTMLElement,
    private readonly options: Options,
  ) {
    this.element = element;
    this.options = options;
  }

  createEditor() {
    this.editor = new EditorView({
      state: EditorState.create({
        doc: this.options.value,
        extensions: [
          markdown(),
          keymap.of(defaultKeymap),
        ],
      }),
      parent: this.element,
    });
  }

  getValue() {
    return this.editor?.state.doc.toString();
  }

  setValue(value: string) {
    this.editor?.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: value,
      },
    });
  }
}

export default PhotonEditor;
