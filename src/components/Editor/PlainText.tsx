import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  CONTROLLED_TEXT_INSERTION_COMMAND,
} from "lexical";
import { useEffect } from "react";

export function PlainText() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      CONTROLLED_TEXT_INSERTION_COMMAND,
      (event) => {
        $getSelection()?.insertText(event as string);
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, []);

  return null;
}
