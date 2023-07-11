import {h, app, text, type Action, type VNode, type CustomPayloads} from 'hyperapp';

type HeadingDrawerProps = CustomPayloads<any, {
  levels: number[];
  onSelect: Action<any, number>;
}>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const HeadingDrawer = ({levels = [1, 2, 3], onSelect}: HeadingDrawerProps) => {
  if (!onSelect) {
    throw new Error('onSelect action must be provided to HeadingDrawer component.');
  }

  return h('ul', {}, levels.map(level =>
    h('li', {onclick: [onSelect, level]}, text(`Heading ${level}`)),
  ));
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const HeadingButton = (props: CustomPayloads<any, any>) => {
  const onclick = (state: any): any => ({...state, active: state.active === 'heading' ? '' : 'heading'});

  return h('button', {class: 'toolbar-button heading', onclick}, [
    // eslint-disable-next-line new-cap
    h('div', {style: {display: props.active === 'heading' ? 'block' : 'none'}}, HeadingDrawer(props)),
  ]);
};
