import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import type {Root as MdastRoot} from 'mdast';
import type {Root as HastRoot, Node as HastNode, Element, Text as HastText} from 'hast';
import {h, text, type VNode, type TTagName, type Props} from 'superfine';

type HtmlElementProperties = Record<string, keyof HTMLElementTagNameMap>;

export type MarkdownParserInterface = {
  parse(markdown: string): Promise<VNode<TTagName>>;
};

export class MarkdownParser {
  async parse(markdown: string): Promise<VNode<TTagName>> {
    const remarkAst = this.markdownToAst(markdown);
    const rehypeAst = await this.remarkAstToRehypeAst(remarkAst);
    const superfineVdom = this.rehypeAstToSuperfineVdom(rehypeAst);

    return superfineVdom;
  }

  private markdownToAst(markdown: string): MdastRoot {
    return unified().use(remarkParse).parse(markdown);
  }

  private async remarkAstToRehypeAst(remarkAst: MdastRoot): Promise<HastRoot> {
    return unified().use(remarkToRehype).run(remarkAst) as Promise<HastRoot>;
  }

  private rehypeAstToSuperfineVdom(rehypeAst: HastRoot): VNode<TTagName> {
    const walk = (node: HastNode): VNode<TTagName> | undefined => {
      if (node.type === 'element') {
        const element = node as Element;
        return h(
          element.tagName,
          element.properties as Props<TTagName>,
          (element.children || []).map(walk).filter((child: VNode<TTagName> | undefined) => child !== undefined),
        );
      }

      if (node.type === 'text') {
        const textNode = node as HastText;
        return text(textNode.value);
      }

      return undefined;
    };

    const children = rehypeAst.children.map(walk).filter((el: VNode<keyof HTMLElementTagNameMap> | undefined) => el !== undefined);
    const vnode = h('div', {}, children);

    return vnode;
  }
}
