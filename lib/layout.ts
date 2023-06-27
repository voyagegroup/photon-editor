import {h, patch, type VNode} from 'superfine';

export type LayoutInterface = {
  render(): void;
  getEditorContainer(): HTMLElement | undefined;
  updatePreviewNode(node: VNode<any>): void;
};

export class DefaultLayout implements LayoutInterface {
  private rootElement: HTMLDivElement | undefined;
  private editorContainer: HTMLElement | undefined;
  private previewContainer: HTMLDivElement | undefined;
  private readonly previewVdom: any;

  constructor(private readonly parentElement: HTMLElement) {
    this.parentElement = parentElement;
  }

  getEditorContainer() {
    return this.editorContainer;
  }

  createRootElement() {
    this.rootElement = document.createElement('div');
    this.parentElement.appendChild(this.rootElement);
  }

  createEditorContainer() {
    this.editorContainer = document.createElement('div');
    this.editorContainer.classList.add('editor-container');

    this.parentElement.appendChild(this.editorContainer);
  }

  createPreviewElement() {
    this.previewContainer = document.createElement('div');
    this.previewContainer.classList.add('preview');

    this.parentElement.appendChild(this.previewContainer);
  }

  mountPreview() {
    if (this.previewContainer) {
      patch(this.previewContainer, h('div', {}));
    }
  }

  render() {
    this.createRootElement();
    this.createEditorContainer();
    this.createPreviewElement();

    this.mountPreview();
  }

  public updatePreviewNode(node: VNode<any>) {
    if (this.previewContainer) {
      patch(this.previewContainer, node);
    }
  }
}
