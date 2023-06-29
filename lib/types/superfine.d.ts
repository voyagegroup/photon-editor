/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
declare module 'superfine' {
  type HtmlOrSvgElementTagNameMap = HTMLElementTagNameMap &
  Pick<SVGElementTagNameMap, Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>>;

  export type TTagName = keyof HtmlOrSvgElementTagNameMap | string;

  export type Props<TTagName extends keyof HtmlOrSvgElementTagNameMap> = {
    readonly [TAttributeName in keyof HtmlOrSvgElementTagNameMap[TTagName]]?: HtmlOrSvgElementTagNameMap[TTagName][TAttributeName];
  } & {
    readonly is?: string;
    readonly key?: number | string | undefined;
  };

  export type VNode<TTagName extends keyof HtmlOrSvgElementTagNameMap | string> = {
    readonly tag: TTagName extends keyof HtmlOrSvgElementTagNameMap ? TTagName : string;
    readonly props: Props<keyof HtmlOrSvgElementTagNameMap> | Record<string, unknown>;
    readonly key: number | string | undefined;
    readonly children: Children<keyof HtmlOrSvgElementTagNameMap | string>;
    readonly type: TTagName extends keyof HtmlOrSvgElementTagNameMap ? number : 3;
    readonly node?: Node;
  };

  type Children<TTagName extends keyof HtmlOrSvgElementTagNameMap | string> = VNode<TTagName> | ReadonlyArray<VNode<TTagName>>;

  export function h<TTagName extends keyof HtmlOrSvgElementTagNameMap>(
    tagName: TTagName,
    props: Props<keyof HtmlOrSvgElementTagNameMap> | Record<string, unknown>,
    children?: Children<keyof HtmlOrSvgElementTagNameMap | string>,
  ): VNode<TTagName>;

  export function patch<TTagName extends keyof HtmlOrSvgElementTagNameMap>(
    rootElement: HtmlOrSvgElementTagNameMap[TTagName],
    vNode: VNode<keyof HtmlOrSvgElementTagNameMap>,
  ): VNode<TTagName>;

  export function text(value: string, node?: Node): VNode<string>;
}
