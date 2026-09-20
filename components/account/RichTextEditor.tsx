"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (html: string) => void;
};

type ToolbarButton = {
  label: string;
  title: string;
  run: () => void;
  active?: boolean;
  disabled?: boolean;
};

// Free, key-less rich-text editor (Tiptap, MIT) for product descriptions; emits HTML.
export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: value,
    // Render on the client only, so Next.js server rendering doesn't mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "rich-editor-content rich-text", dir: "rtl", "aria-label": label },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.isEmpty ? "" : editor.getHTML()),
  });

  // Follow outside changes: loading a product for editing or resetting the form.
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  const snapshot = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            strike: editor.isActive("strike"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            blockquote: editor.isActive("blockquote"),
            link: editor.isActive("link"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
          }
        : null,
  });

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("آدرس لینک را وارد کنید (برای حذف لینک خالی بگذارید):", previous ?? "https://");
    if (url === null) return;

    const href = url.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!href || href === "https://") chain.unsetLink().run();
    else chain.setLink({ href }).run();
  };

  // The snapshot stays null until the editor's first transaction; show the toolbar right away.
  const state = snapshot ?? {
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    h2: false,
    h3: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    link: false,
    canUndo: false,
    canRedo: false,
  };

  const buttons: ToolbarButton[] =
    editor
      ? [
          { label: "B", title: "پررنگ", active: state.bold, run: () => editor.chain().focus().toggleBold().run() },
          { label: "I", title: "کج", active: state.italic, run: () => editor.chain().focus().toggleItalic().run() },
          { label: "U", title: "زیرخط", active: state.underline, run: () => editor.chain().focus().toggleUnderline().run() },
          { label: "S", title: "خط‌خورده", active: state.strike, run: () => editor.chain().focus().toggleStrike().run() },
          { label: "تیتر", title: "تیتر", active: state.h2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
          { label: "زیرتیتر", title: "زیرتیتر", active: state.h3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
          { label: "•", title: "فهرست نقطه‌ای", active: state.bulletList, run: () => editor.chain().focus().toggleBulletList().run() },
          { label: "۱.", title: "فهرست شماره‌دار", active: state.orderedList, run: () => editor.chain().focus().toggleOrderedList().run() },
          { label: "❝", title: "نقل‌قول", active: state.blockquote, run: () => editor.chain().focus().toggleBlockquote().run() },
          { label: "🔗", title: "لینک", active: state.link, run: setLink },
          { label: "―", title: "خط جداکننده", run: () => editor.chain().focus().setHorizontalRule().run() },
          { label: "↶", title: "واگرد", disabled: !state.canUndo, run: () => editor.chain().focus().undo().run() },
          { label: "↷", title: "انجام دوباره", disabled: !state.canRedo, run: () => editor.chain().focus().redo().run() },
        ]
      : [];

  return (
    <div className="rich-editor">
      <span className="rich-editor-label">{label}</span>
      <div className="rich-editor-box">
        <div className="rich-editor-toolbar" role="toolbar" aria-label={`ابزار ویرایش ${label}`}>
          {buttons.map((button) => (
            <button
              key={button.title}
              type="button"
              title={button.title}
              aria-label={button.title}
              aria-pressed={button.active}
              disabled={button.disabled}
              onClick={button.run}
            >
              {button.label}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
