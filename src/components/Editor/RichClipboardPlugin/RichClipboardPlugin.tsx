import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  COPY_COMMAND,
  PASTE_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $insertDataTransferForRichText,
  copyToClipboard,
} from "@lexical/clipboard";

export function RichClipboardPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        COPY_COMMAND,
        (event: ClipboardEvent) => {
          copyToClipboard(
            editor,
            event instanceof ClipboardEvent ? event : null
          );
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        PASTE_COMMAND,
        (event: ClipboardEvent) => {

          if (!event.clipboardData) return false;

          const selection = $getSelection();

          // how to handle non-range selections (node and grid)?
          if ($isRangeSelection(selection)) {
            $insertDataTransferForRichText(
              event.clipboardData,
              selection,
              editor
            );
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}
