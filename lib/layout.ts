import {h, patch, type VNode, type HtmlOrSvgElementTagNameMap} from 'superfine';
import './styles/default.css';

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

const defaultOptions: Options = {
  previewClass: 'preview',
  editorContainerClass: 'editor-container',
  photonEditorClass: 'parent-container',
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

  createEditorContainer(rootElement: HTMLDivElement, options: Options) {
    this.editorContainer = document.createElement('div');
    if (options.editorContainerClass) {
      this.editorContainer.classList.add(options.editorContainerClass);
    }

    rootElement.appendChild(this.editorContainer);
  }

  createPreviewElement(rootElement: HTMLDivElement, options: Options) {
    this.previewContainer = document.createElement('div');
    if (options.previewClass) {
      this.previewContainer.classList.add(options.previewClass);
    }

    rootElement.appendChild(this.previewContainer);
  }

  mountPreview() {
    if (this.previewContainer) {
      patch(this.previewContainer, h('div', {}));
    }
  }

  render(options: Partial<Options> = {}) {
    options = {
      previewClass: options.previewClass ?? defaultOptions.previewClass,
      editorContainerClass: options.editorContainerClass ?? defaultOptions.editorContainerClass,
      photonEditorClass: options.photonEditorClass ?? defaultOptions.photonEditorClass,
    };

    this.createRootElement(options);
    if (this.rootElement) {
      this.createEditorContainer(this.rootElement, options);
      this.createPreviewElement(this.rootElement, options);
    }

    this.mountPreview();
  }

  public updatePreviewNode(node: VNode<keyof HtmlOrSvgElementTagNameMap>) {
    if (this.previewContainer) {
      patch(this.previewContainer, node);
    }
  }
}
