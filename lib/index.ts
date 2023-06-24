import {defaultKeymap} from '@codemirror/commands';
import {EditorState} from '@codemirror/state';
import {keymap, EditorView} from '@codemirror/view';
import {markdown} from '@codemirror/lang-markdown';
import {syntaxHighlighting} from '@codemirror/language';
import markdownHighlight from './highlight/markdown';
import {type LayoutInterface, DefaultLayout} from './layout';

type Options = {
  value: string | undefined;
  previewClass?: string;
  editorContainerClass?: string;
  photonEditorClass?: string;
};

class PhotonEditor {
  private editor: EditorView | undefined;
  private readonly layout: LayoutInterface;

  constructor(
    private readonly element: HTMLElement,
    private readonly options: Options,
    layout: LayoutInterface,
  ) {
    this.element = element;
    this.options = options;
    this.layout = layout || new DefaultLayout(this.element);
  }

  createEditor() {
    this.waitForContainerReady(editorContainer => {
      this.editor = new EditorView({
        state: EditorState.create({
          doc: this.options.value,
          extensions: [
            markdown(),
            keymap.of(defaultKeymap),
            syntaxHighlighting(markdownHighlight),
          ],
        }),
        parent: editorContainer,
      });
    });
    this.layout.render();
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

  private waitForContainerReady(callback: (element: HTMLElement) => void) {
    const observer = new MutationObserver(() => {
      const editorContainer = this.layout.getEditorContainer();

      if (editorContainer) {
        observer.disconnect();
        callback(editorContainer);
      }
    });

    observer.observe(this.element, {childList: true, subtree: true});
  }
}

export default PhotonEditor;
