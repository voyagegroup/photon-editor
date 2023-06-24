import {defaultKeymap} from '@codemirror/commands';
import {EditorState} from '@codemirror/state';
import {keymap, EditorView} from '@codemirror/view';
import {markdown} from '@codemirror/lang-markdown';
import {syntaxHighlighting} from '@codemirror/language';
import markdownHighlight from './highlight/markdown';

import {h, patch} from 'superfine';

type Options = {
  value: string | undefined;
  previewClass?: string;
  editorContainerClass?: string;
  photonEditorClass?: string;
};

type LayoutInterface = {
  render(): void;
  getEditorContainer(): HTMLElement | undefined;
};

class DefaultLayout implements LayoutInterface {
  private vdomRoot: HTMLElement | undefined;
  private editorContainer: HTMLElement | undefined;

  constructor(private readonly parentElement: HTMLElement) {
    this.parentElement = parentElement;
  }

  getEditorContainer() {
    return this.editorContainer;
  }

  render() {
    const previewVdom = h('div', {class: 'preview'}, [
      // ここにMarkdownのHTML変換結果を追加
    ]);

    const editorContainerVdom = h('div', {class: 'editor-container'});

    const rootVdom = h('div', {class: 'photon-editor'}, [
      editorContainerVdom,
      previewVdom,
    ]);

    if (this.vdomRoot) {
      patch(this.vdomRoot, rootVdom);
    } else {
      this.vdomRoot = document.createElement('div');
      this.parentElement.appendChild(this.vdomRoot);
      patch(this.vdomRoot, rootVdom);
    }

    const editorContainer = this.vdomRoot.querySelector('.editor-container');
    if (editorContainer !== null) {
      this.editorContainer = editorContainer as HTMLElement;
    }
  }
}

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
    this.layout.render();
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
