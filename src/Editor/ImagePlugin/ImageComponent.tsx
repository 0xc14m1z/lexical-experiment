import { useEffect } from "react";
import classNames from "classnames";
import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  EditorConfig,
  KEY_ARROW_LEFT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import useLexicalEditable from "@lexical/react/useLexicalEditable";

interface Props {
  source: string;
  nodeKey: string;
  editorConfig: EditorConfig;
}

export function ImageComponent({ source, nodeKey, editorConfig }: Props) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, select] = useLexicalNodeSelection(nodeKey);
  const isEditable = useLexicalEditable();

  function handleClick() {
    editor.update(() => {
      select(true);
    });
  }

  function handleDelete(): boolean {
    console.log("handleDelete", { isSelected });
    if (!isEditable) return false;
    if (!isSelected) return false;

    const node = $getNodeByKey(nodeKey);
    if (!node) return false;

    editor.update(() => {
      node.selectEnd();
      node.remove(true);
    });
    return true;
  }

  function moveSelectionBefore() {
    if (isSelected) {
      console.log("moveSelectionBefore");
      const node = $getNodeByKey(nodeKey);
      if (node) {
        editor.update(() => {
          node.selectStart();
        });
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        moveSelectionBefore,
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  const theme = editorConfig.theme.customImage ?? {};
  const containerTheme = theme.container ?? {};
  const imageTheme = theme.image ?? {};

  return (
    <figure
      onClick={handleClick}
      className={classNames(containerTheme.idle, {
        [containerTheme.edit]: isEditable,
        [containerTheme.selected]: isSelected,
      })}
    >
      <img
        alt="i'm playiiiiing!"
        src={source}
        className={classNames(imageTheme.idle, {
          [imageTheme.edit]: isEditable,
          [imageTheme.selected]: isSelected,
        })}
      />
    </figure>
  );
}
