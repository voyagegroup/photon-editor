/* eslint-disable @typescript-eslint/naming-convention */
declare module 'superfine' {
  type HtmlOrSvgElementTagNameMap = HTMLElementTagNameMap & Pick<SVGElementTagNameMap, Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>>;
  export type TTagName = keyof HtmlOrSvgElementTagNameMap | 'text';

  export type Props<TTagName> = {
    readonly [TAttributeName in keyof HtmlOrSvgElementTagNameMap[TTagName]]?: HtmlOrSvgElementTagNameMap[TTagName][TAttributeName];
  } & {
    readonly is?: string;
    readonly key?: number | string | undefined;
  };

  export type VNode<TTagName> = {
    readonly tag: TTagName;
    readonly props: Props<keyof HtmlOrSvgElementTagNameMap> | Record<string, unknown>;
    readonly key: number | string | undefined;
    readonly children?: Children<TTagName>;
    readonly type: number;
    readonly node?: Node;
  };

  export type Children<TTagName> =
      | VNode<TTagName>
      | ReadonlyArray<VNode<TTagName>>;

  export function h<TTagName>(
    tagName: TTagName,
    props: Props<keyof HtmlOrSvgElementTagNameMap> | Record<string, unknown>,
    children?: Children<TTagName>
  ): VNode<TTagName>;

  export function patch<TTagName>(
    rootElement: HtmlOrSvgElementTagNameMap[TTagName],
    vNode: VNode<TTagName>
  ): VNode<TTagName>;

  export function text(value: string, node?: Node): VNode<'text'>;
}
