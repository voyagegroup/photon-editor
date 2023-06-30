import {h, patch, type VNode, type HtmlOrSvgElementTagNameMap} from 'superfine';

type Options = {
  previewClass?: string;
  editorContainerClass?: string;
  photonEditorClass?: string;
};

export type LayoutInterface = {
  render(options: Options): void;
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

  createRootElement(options: Options) {
    this.rootElement = document.createElement('div');
    if (options.photonEditorClass) {
      this.rootElement.classList.add(options.photonEditorClass);
    }

    this.parentElement.appendChild(this.rootElement);
  }

  createEditorContainer(options: Options) {
    this.editorContainer = document.createElement('div');
    if (options.editorContainerClass) {
      this.editorContainer.classList.add(options.editorContainerClass);
    }

    this.parentElement.appendChild(this.editorContainer);
  }

  createPreviewElement(options: Options) {
    this.previewContainer = document.createElement('div');
    if (options.previewClass) {
      this.previewContainer.classList.add(options.previewClass);
    }

    this.parentElement.appendChild(this.previewContainer);
  }

  mountPreview() {
    if (this.previewContainer) {
      patch(this.previewContainer, h('div', {}));
    }
  }

  render(options: Options) {
    this.createRootElement(options);
    this.createEditorContainer(options);
    this.createPreviewElement(options);

    this.mountPreview();
  }

  public updatePreviewNode(node: VNode<keyof HtmlOrSvgElementTagNameMap>) {
    if (this.previewContainer) {
      patch(this.previewContainer, node);
    }
  }
}
