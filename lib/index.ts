/**
 * PhotonEditor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

import {defaultKeymap} from '@codemirror/commands';
import {EditorState} from '@codemirror/state';
import {keymap, EditorView} from '@codemirror/view';
import {markdown} from '@codemirror/lang-markdown';
import {syntaxHighlighting} from '@codemirror/language';
import mitt, {type Emitter} from 'mitt';

import markdownHighlight from './highlight/markdown';
import {type LayoutInterface, DefaultLayout} from './layout';
import {type MarkdownParserInterface, MarkdownParser} from './parser';

type Options = {
  value: string | undefined;
  previewClass?: string;
  editorContainerClass?: string;
  photonEditorClass?: string;
};

/**
 * Represents the main PhotonEditor class.
 */
class PhotonEditor {
  private readonly emitter: Emitter<any>;
  private editor: EditorView | undefined;
  private readonly layout: LayoutInterface;
  private readonly parser: MarkdownParserInterface;

  /**
   * Creates a new instance of PhotonEditor.
   *
   * @param {HTMLElement} element - The DOM element to attach the editor to.
   * @param {Options} options - An object containing initial editor options.
   * @param {LayoutInterface} [layout] - An optional custom layout object.
   */
  constructor(
    private readonly element: HTMLElement,
    private readonly options: Options,
    parser?: MarkdownParserInterface,
    layout?: LayoutInterface,
  ) {
    this.emitter = mitt();

    this.layout = layout ?? new DefaultLayout(this.emitter, this.element);
    this.parser = parser ?? new MarkdownParser();
  }

  on(eventName: string, callback: (event: any) => void) {
    this.emitter.on(eventName, callback);
  }

  getEmitter(): Emitter<any> {
    return this.emitter;
  }

  /**
   * Creates the editor within the specified container element.
   */
  createEditor() {
    this.waitForContainerReady(editorContainer => {
      this.editor = new EditorView({
        state: EditorState.create({
          doc: this.options.value,
          extensions: [
            markdown(),
            keymap.of(defaultKeymap),
            syntaxHighlighting(markdownHighlight),
            EditorView.updateListener.of(this.handleEditorUpdate.bind(this)),
          ],
        }),
        parent: editorContainer,
      });
    });
    this.layout.render({
      previewClass: this.options.previewClass,
      editorContainerClass: this.options.editorContainerClass,
      photonEditorClass: this.options.photonEditorClass,
    });
  }

  /**
   * Returns the editor's current value as a string.
   *
   * @returns {string | undefined}
   */
  getValue() {
    return this.editor?.state.doc.toString();
  }

  /**
   * Sets the editor's value given a new input value.
   *
   * @param {string} value - The content to set as the new editor value.
   */
  setValue(value: string) {
    this.editor?.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: value,
      },
    });
  }

  /**
   * Waits for the editor's container DOM element to become available, then
   * executes a callback function on it.
   *
   * @private
   * @param {(element: HTMLElement) => void} callback - The callback function for the ready event.
   */
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

  private async handleEditorUpdate(update: any) {
    if (update.changes.length) {
      await this.renderMarkdownToPreviewNode(this.getValue() ?? '');
    }
  }

  private async renderMarkdownToPreviewNode(markdown: string) {
    this.layout.updatePreviewNode(await this.parser.parse(markdown));
  }
}

export default PhotonEditor;
