import { useEffect } from "react";
import classNames from "classnames";
import {
  $createNodeSelection,
  $createRangeSelection,
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isDecoratorNode,
  $isElementNode,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  EditorConfig,
  KEY_ARROW_LEFT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import useLexicalEditable from "@lexical/react/useLexicalEditable";
import { ImageNode } from "./ImageNode";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

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
    if (!isSelected) return false;

    const node = $getNodeByKey<ImageNode>(nodeKey);
    if (!node) return false;

    // take the previous sibling node
    const previousSibling = node.getPreviousSibling();

    // if it doesn't exist
    if (!previousSibling) {
      // create an empty text node and select it to show the caret there
      editor.update(() => {
        const previousNode = $createTextNode("");
        node.insertBefore(previousNode);
        previousNode.select();
      });

      return true;
    } else {
      if ($isTextNode(previousSibling) || $isElementNode(previousSibling)) {
        editor.update(() => {
          previousSibling.select();
        });
        return true;
      } else if ($isDecoratorNode(previousSibling)) {
        editor.update(() => {
          const selection = $createNodeSelection();
          selection.add(previousSibling.getKey());
          $setSelection(selection);
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
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, moveSelectionBefore, handleDelete]);

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
