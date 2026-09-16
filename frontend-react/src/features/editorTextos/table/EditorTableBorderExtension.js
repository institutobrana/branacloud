import { Extension } from '@tiptap/core';

export const EditorTableBorderExtension = Extension.create({
  name: 'editorTableBorder',
  addGlobalAttributes() {
    return [{
      types: ['table'],
      attributes: {
        borderVisible: {
          default: true,
          parseHTML: element => element.getAttribute('data-et-border-visible') !== 'false',
          renderHTML: attributes => ({ 'data-et-border-visible': String(attributes.borderVisible !== false) }),
        },
      },
    }];
  },
});
