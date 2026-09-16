import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { FontFamily, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { FontSize } from './anotacoesExtensions.js';
import { loadAnotacoesContent } from './anotacoesContent.js';

export function AnotacoesEditor({ content = '', editable = true, onChange, onEditorReady }) {
  const lastContent = useRef(content);
  const userEdited = useRef(false);
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontFamily, Color, FontSize, Underline, TextAlign.configure({ types: ['paragraph', 'heading'] }), Table.configure({ allowTableNodeSelection: true }), TableRow, TableHeader, TableCell],
    content: loadAnotacoesContent(content),
    editable,
    onUpdate: ({ editor: currentEditor }) => { userEdited.current = true; onChange?.(currentEditor.getHTML()); },
  });

  useEffect(() => {
    if (editor && onEditorReady) onEditorReady(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor || userEdited.current || content === lastContent.current) return;
    editor.commands.setContent(loadAnotacoesContent(content), false);
    lastContent.current = content;
  }, [content, editor]);

  useEffect(() => { editor?.setEditable(editable); }, [editor, editable]);

  return (
    <div className="ficha-anotacoes-editor" data-testid="anotacoes-editor">
      <EditorContent editor={editor} placeholder="Anotações do paciente..." />
    </div>
  );
}
