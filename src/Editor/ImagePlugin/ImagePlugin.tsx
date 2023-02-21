import { useEffect } from "react";
import { $insertNodes, COMMAND_PRIORITY_HIGH, PASTE_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ImageNode } from "./ImageNode";
import { $createImageNode } from "./$createImageNode";

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error(
        "ImagePlugin: add the ImageNode in the editor configuration"
      );
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent, editor) => {
        if (!event.clipboardData) return false;

        const urls = Array.from(event.clipboardData.items)
          .filter((item) => item.type.startsWith("image/"))
          .map((item) => item.getAsFile())
          .filter(Boolean)
          .map((file) => URL.createObjectURL(file!));

        if (urls.length > 0) {
          editor.update(() => {
            const nodes = urls.map($createImageNode);
            $insertNodes(nodes);
          });

          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}
