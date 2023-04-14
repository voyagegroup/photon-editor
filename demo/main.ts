import PhotonEditor from '../lib/index';

const div = document.getElementById('editor');
if (div) {
  const editor = new PhotonEditor(div, {
    value: 'Hello World',
  });
  editor.createEditor();
}
