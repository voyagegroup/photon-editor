import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import type {Root as MdastRoot} from 'mdast';
import type {Root as HastRoot, Node as HastNode, Element, Text as HastText} from 'hast';
import {h, text, type VNode, type Props} from 'hyperapp';

export type MarkdownParserInterface = {
  parse(markdown: string): VNode<any>;
};

export class MarkdownParser {
  parse(markdown: string): VNode<any> {
    const remarkAst = this.markdownToAst(markdown);
    const rehypeAst = this.remarkAstToRehypeAst(remarkAst);
    const superfineVdom = this.rehypeAstToSuperfineVdom(rehypeAst);

    return superfineVdom;
  }

  private markdownToAst(markdown: string): MdastRoot {
    return unified().use(remarkParse).parse(markdown);
  }

  private remarkAstToRehypeAst(remarkAst: MdastRoot): MdastRoot {
    return unified().use(remarkToRehype).runSync(remarkAst);
  }

  private rehypeAstToSuperfineVdom(rehypeAst: MdastRoot): VNode<any> {
    const walk = (node: HastNode): VNode<any> | undefined => {
      if (node.type === 'element') {
        const element = node as Element;
        return h(
          element.tagName,
          element.properties as Props<any>,
          (element.children || []).map(walk).filter(child => child !== undefined) as Array<VNode<any>>,
        );
      }

      if (node.type === 'text') {
        const textNode = node as HastText;
        return text(textNode.value);
      }

      return undefined;
    };

    const children = rehypeAst.children.map(walk).filter(child => child !== undefined) as Array<VNode<any>>;
    const vnode = h('div', {}, children);

    return vnode;
  }
}
