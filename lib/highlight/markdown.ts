import {tags} from '@lezer/highlight';
import {HighlightStyle} from '@codemirror/language';

export default HighlightStyle.define([
  {tag: tags.heading, fontSize: '24px'},
  {tag: tags.heading2, fontSize: '22px'},
  {tag: tags.heading3, fontSize: '20px'},
  {tag: tags.heading4, fontSize: '18px'},
  {tag: tags.heading5, fontSize: '16px'},
  {tag: tags.heading6, fontSize: '14px'},
  {tag: [tags.strong, tags.heading, tags.list], fontWeight: 'bold'},
  {tag: tags.emphasis, fontStyle: 'italic'},
  {tag: tags.strikethrough, textDecoration: 'line-through'},
  {tag: [tags.link, tags.quote], color: '#ccc'},
  {tag: [tags.meta, tags.link], color: '#999'},
  {tag: tags.link, color: '#4b96e6'},
]);
