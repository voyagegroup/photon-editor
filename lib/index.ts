import {defaultKeymap} from '@codemirror/commands';
import {EditorState} from '@codemirror/state';
import {keymap, EditorView} from '@codemirror/view';
import {markdown} from '@codemirror/lang-markdown';
import {syntaxHighlighting} from '@codemirror/language';
import markdownHighlight from './highlight/markdown';

import {h, patch} from 'superfine';

type Options = {
  value: string | undefined;
  toolbarClass?: string;
  previewClass?: string;
  editorContainerClass?: string;
  photonEditorClass?: string;
};

type LayoutInterface = {
  create(): void;
  getEditorContainer(): HTMLElement | undefined;
};

class DefaultLayout implements LayoutInterface {
  private vdomRoot: HTMLElement | undefined;
  private editorContainer: HTMLElement | undefined;

  constructor(private readonly parentElement: HTMLElement) {
    this.parentElement = parentElement;
  }

  create() {
    this.render();
  }

  getEditorContainer() {
    return this.editorContainer;
  }

  private render() {
    const toolbarVdom = h('div', {class: 'toolbar'}, [
      // ここにツールバーのコンテンツを追加
    ]);

    const previewVdom = h('div', {class: 'preview'}, [
      // ここにMarkdownのHTML変換結果を追加
    ]);

    const editorContainerVdom = h('div', {class: 'editor-container'});

    const rootVdom = h('div', {class: 'photon-editor'}, [
      toolbarVdom,
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
    this.layout.create();
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

    // Observer構成オブジェクト
    const config = {childList: true, subtree: true};

    // 対象の要素とその子孫を監視を開始
    observer.observe(this.element, config);
  }
}

export default PhotonEditor;
