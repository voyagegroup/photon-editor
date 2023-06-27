/* eslint-disable @typescript-eslint/naming-convention */
declare module 'superfine' {
  import type {Children, Child} from 'superfine';

  type HtmlOrSvgElementTagNameMap = HTMLElementTagNameMap & Pick<SVGElementTagNameMap, Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>>;

  export type VNode<TTagName extends keyof HtmlOrSvgElementTagNameMap> = {
    readonly name: TTagName;
  };

  export function text<TTagName extends keyof HtmlOrSvgElementTagNameMap>(
    value: string,
    node?: Node
  ): VNode<TTagName>;

  export type Props<TTagName extends keyof HtmlOrSvgElementTagNameMap> = {
    readonly [TAttributeName in keyof HtmlOrSvgElementTagNameMap[TTagName]]?: HtmlOrSvgElementTagNameMap[TTagName][TAttributeName];
    readonly is?: string;
  } & {
    readonly key?: number | string | undefined;
  };

  export function patch<TTagName extends keyof HtmlOrSvgElementTagNameMap>(
    rootElement: HtmlOrSvgElementTagNameMap[TTagName],
    vNode: VNode<TTagName>
  ): HtmlOrSvgElementTagNameMap[TTagName];

  export function h(
    tagName: 'svg',
    props: Props<'svg'>,
    children?: Children<keyof SVGElementTagNameMap>
  ): VNode<'svg'>;

  export function h<TTagName extends keyof HTMLElementTagNameMap>(
    tagName: TTagName,
    props: Props<TTagName>,
    children?: Children<(keyof HTMLElementTagNameMap) | 'svg'>
  ): VNode<TTagName>;

  export type {Children, Child, TTagName, VNode};
}
