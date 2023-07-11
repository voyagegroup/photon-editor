import {h, app, text, type VNode, type CustomPayloads} from 'hyperapp';
import {type Emitter} from 'mitt';

import {HeadingButton} from './components/HeadingDrawer';

import './styles/default.css';

type ToolbarItem = string | {
  component: ((props: CustomPayloads<any, any>) => VNode<any>);
  props: CustomPayloads<any, any>;
};

type Options = {
  previewClass?: string;
  editorContainerClass?: string;
  editorPreviewContainerClass?: string;
  photonEditorClass?: string;
  toolbarItems?: ToolbarItem[][];
};

export type LayoutInterface = {
  emitter: Emitter<any>;

  render(options: Options): void;
  getEditorContainer(): HTMLElement | undefined;
  getPreviewContainer(): HTMLDivElement | undefined;
};

const defaultOptions: Options = {
  previewClass: 'preview',
  editorContainerClass: 'editor-container',
  editorPreviewContainerClass: 'editor-preview-container',
  photonEditorClass: 'photon-editor',
  toolbarItems: [
    [
      {component: HeadingButton, props: {levels: [1, 2, 3, 4, 5, 6], onSelect(ev: any) {
        console.log(ev);
      }}},
      'bold',
      'italic',
      'strike',
    ],
    ['hr', 'quote'],
    ['ul', 'ol', 'task'],
    ['table', 'image', 'link'],
    ['code', 'codeblock'],
  ],
};

export class DefaultLayout implements LayoutInterface {
  private rootElement: HTMLDivElement | undefined;
  private editorContainer: HTMLElement | undefined;
  private previewContainer: HTMLDivElement | undefined;
  private editorPreviewContaienr: HTMLDivElement | undefined;
  private toolbarContainer: HTMLDivElement | undefined;

  constructor(readonly emitter: Emitter<any>, private readonly parentElement: HTMLElement) {
    this.emitter = emitter;
    this.parentElement = parentElement;
  }

  getEditorContainer() {
    return this.editorContainer;
  }

  getPreviewContainer() {
    return this.previewContainer;
  }

  createRootElement(options: Options) {
    this.rootElement = document.createElement('div');
    if (options.photonEditorClass) {
      this.rootElement.classList.add(options.photonEditorClass);
    }

    this.parentElement.appendChild(this.rootElement);
  }

  createEditorPreviewContainer(rootElement: HTMLDivElement, options: Options) {
    this.editorPreviewContaienr = document.createElement('div');
    if (options.editorPreviewContainerClass) {
      this.editorPreviewContaienr.classList.add(options.editorPreviewContainerClass);
    }

    rootElement.appendChild(this.editorPreviewContaienr);
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

  createToolbarContainer(rootElement: HTMLDivElement) {
    this.toolbarContainer = document.createElement('div');
    this.toolbarContainer.classList.add('toolbar');
    rootElement.insertBefore(this.toolbarContainer, rootElement.firstChild);
  }

  initializeToolbar(options: Options) {
    if (!this.toolbarContainer) {
      return;
    }

    const toolbarComponent = (props: CustomPayloads<any, any>) => {
      const toolbarItems = options.toolbarItems ?? [];
      const toolbarChildren: Array<VNode<any>> = [];

      for (const itemGroup of toolbarItems) {
        const groupChildren: Array<VNode<any>> = [];

        for (const item of itemGroup) {
          if (typeof item === 'string') {
            const buttonNode = h(
              'button',
              {
                class: `toolbar-button ${item}`,
                onclick: () => {
                  this.emitter.emit(`toolbarButton:${item}:clicked`);
                },
              },
              [],
            );
            groupChildren.push(buttonNode);
          } else {
            groupChildren.push(item.component({...props, ...item.props}));
          }
        }

        toolbarChildren.push(h('div', {}, groupChildren));
      }

      return toolbarChildren;
    };

    app({
      init: {
        active: '',
        params: {
        },
      },
      view: state => h('div', {}, toolbarComponent(state)),
      node: this.toolbarContainer,
    });
  }

  render(options: Partial<Options> = {}) {
    options = {
      previewClass: options.previewClass ?? defaultOptions.previewClass,
      editorContainerClass: options.editorContainerClass ?? defaultOptions.editorContainerClass,
      photonEditorClass: options.photonEditorClass ?? defaultOptions.photonEditorClass,
      editorPreviewContainerClass: options.editorPreviewContainerClass ?? defaultOptions.editorPreviewContainerClass,
      toolbarItems: options.toolbarItems ?? defaultOptions.toolbarItems,
    };

    this.createRootElement(options);
    if (this.rootElement) {
      this.createEditorPreviewContainer(this.rootElement, options);

      this.createToolbarContainer(this.rootElement);
      this.initializeToolbar(options);
    }

    if (this.editorPreviewContaienr) {
      this.createEditorContainer(this.editorPreviewContaienr, options);
      this.createPreviewElement(this.editorPreviewContaienr, options);
    }
  }
}
