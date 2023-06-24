import {h, patch} from 'superfine';

export type LayoutInterface = {
  render(): void;
  getEditorContainer(): HTMLElement | undefined;
};

export class DefaultLayout implements LayoutInterface {
  private vdomRoot: HTMLDivElement | undefined;
  private editorContainer: HTMLElement | undefined;

  constructor(private readonly parentElement: HTMLElement) {
    this.parentElement = parentElement;
  }

  getEditorContainer() {
    return this.editorContainer;
  }

  render() {
    const previewVdom = h('div', {className: 'preview'}, [
      // ここにMarkdownのHTML変換結果を追加
    ]);

    const editorContainerVdom = h('div', {className: 'editor-container'});

    const rootVdom = h('div', {className: 'photon-editor'}, [
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
