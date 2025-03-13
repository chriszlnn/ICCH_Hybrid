"use client";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, LinkIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
//import PassMD from "./pass-md";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: (markdown: string) => Promise<void>; // Optional save callback
  onUpload?: (markdown: string) => Promise<void>; // Optional upload callback
  onSaveMarkdown?: (markdown: string) => void; // New prop to pass Markdown on save
}

// Custom extension to disable the default heading behavior
const CustomHeading = Extension.create({
  name: "customHeading",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          headingLevel: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-heading-level"),
            renderHTML: (attributes) => {
              if (!attributes.headingLevel) {
                return {}
              }
              return {
                "data-heading-level": attributes.headingLevel,
                class: `inline-heading inline-heading-${attributes.headingLevel}`,
              }
            },
          },
        },
      },
    ]
  },
})

export default function WysiwygEditor({ value, onChange, onSave, onUpload }: WysiwygEditorProps) {
  const [isSaving, setIsSaving] = useState(false); // Track save/upload status
  const [lastSaved, setLastSaved] = useState<Date | null>(null); // Track last save time

  // Convert markdown to HTML
  const getHtmlFromMarkdown = async (markdown: string): Promise<string> => {
    const rawHtml = await marked(markdown); // Await the result
    return DOMPurify.sanitize(rawHtml); // Sanitize the HTML
  };

  // Convert HTML to markdown
  const getMarkdownFromHtml = (html: string): string => {
    return html
      .replace(/<span data-heading-level="1"[^>]*class="[^"]*inline-heading[^"]*"[^>]*>(.*?)<\/span>/g, "# $1")
      .replace(/<span data-heading-level="2"[^>]*class="[^"]*inline-heading[^"]*"[^>]*>(.*?)<\/span>/g, "## $1")
      .replace(/<span data-heading-level="3"[^>]*class="[^"]*inline-heading[^"]*"[^>]*>(.*?)<\/span>/g, "### $1")
      .replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n")
      .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
      .replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n")
      .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<em>(.*?)<\/em>/g, "*$1*")
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)")
      .replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
        return content.replace(/<li>(.*?)<\/li>/g, "- $1\n");
      })
      .replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
        let index = 1;
        return content.replace(/<li>(.*?)<\/li>/g, () => {
          return `${index++}. $1\n`;
        });
      })
      .replace(/<[^>]*>/g, "")
      .replace(/\n\n\n+/g, "\n\n")
      .trim();
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading to use our custom implementation
      }),
      TextStyle.configure({
        HTMLAttributes: {
          class: "text-style",
        },
      }),
      CustomHeading,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
    ],
    content: value, // Initialize with the provided value
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = getMarkdownFromHtml(html);
      console.log("Generated HTML:", html); // Log raw HTML output
      console.log("Generated Markdown:", markdown); 
      onChange(markdown); // Notify parent of content change
    },
  });

  useEffect(() => {
    const updateEditorContent = async () => {
      if (editor) {
        const html = await getHtmlFromMarkdown(value); // Await the result
        const currentHtml = editor.getHTML();

        if (html !== currentHtml) {
          editor.commands.setContent(html);
        }
      }
    };

    updateEditorContent(); // Call the async function
  }, [editor, value]);

  const handleSave = async () => {
    
    console.log("handleSave triggered");
    if (!editor) {
      console.warn("Editor not initialized.");
      return;
    }
 
      
  

    setIsSaving(true);
    try {
      const html = editor.getHTML();
      const markdown = getMarkdownFromHtml(html);
  
      // Log the generated formatted Markdown file
      console.log("Generated Formatted Markdown File:", markdown);
  
      if (onSave) {
        await onSave(markdown); // Call the onSave callback
      }
      if (onUpload) {
        await onUpload(markdown); // Call the onUpload callback
      }
      setLastSaved(new Date());
       // Update last saved time
    } catch (error) {
      console.error("Error saving/uploading content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  // Apply heading style to selected text only
  const applyInlineHeading = (level: 1 | 2 | 3) => {
    const isActive = editor.isActive("textStyle", { headingLevel: level.toString() });

    if (isActive) {
      // Remove the heading style
      editor.chain().focus().unsetMark("textStyle").run();
    } else {
      // First clear any existing heading styles
      editor.chain().focus().unsetMark("textStyle").run();

      // Then apply the new heading style to the selected text
      editor.chain().focus().setMark("textStyle", { headingLevel: level.toString() }).run();
    }

    // Force editor to update
    setTimeout(() => {
      editor.commands.focus();
    }, 0);
  };

  const formatters = [
    {
      icon: <Bold className="h-4 w-4" />,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      id: "bold",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      id: "italic",
    },
  ];

  return (
    <div className="border-t">
      {/* Save/Upload Status */}
      <div className="p-2 bg-muted/30 border-b">
        {isSaving ? (
          <span className="text-sm text-gray-500">Saving...</span>
        ) : (
          lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )
        )}
      </div>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted/30 border-b">
        {formatters.map((formatter) => (
          <Button
            key={formatter.id}
            type="button"
            variant={formatter.isActive ? "default" : "ghost"}
            size="sm"
            onClick={formatter.action}
            className={cn("h-8 px-2", formatter.isActive && "bg-primary text-primary-foreground")}
          >
            {formatter.icon}
            <span className="sr-only">{formatter.label}</span>
          </Button>
        ))}
        {/* Save Button */}
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleSave}
          className="h-8 px-2"
        >
          <Save className="h-4 w-4" />
          <span className="sr-only">Save</span>
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[300px] p-4 prose prose-sm max-w-none focus:outline-none" />
    </div>
  );
}