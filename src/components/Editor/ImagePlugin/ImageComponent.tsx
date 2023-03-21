import { useEffect } from "react";
import classNames from "classnames";
import {
  $createRangeSelection,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_NORMAL,
  EditorConfig,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalEditor,
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

function moveCursorBefore(
  event: KeyboardEvent,
  editor: LexicalEditor
): boolean {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) return false; // not a node selection? keep going...

  const [firstSelectedNode] = selection.getNodes();

  const previousNode = firstSelectedNode.getPreviousSibling();
  if (!previousNode) return false; // there are no nodes before? nothing i can do...

  event.preventDefault();
  editor.update(() => {
    const newSelection = $createRangeSelection();
    $setSelection(newSelection);
    firstSelectedNode.selectPrevious();
  });

  return true;
}

function moveCursorAfter(event: KeyboardEvent, editor: LexicalEditor): boolean {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) return false; // not a node selection? keep going...

  const [firstSelectedNode] = selection.getNodes();

  const nextNode = firstSelectedNode.getNextSibling();
  if (!nextNode) return false; // there are no nodes after? nothing i can do...

  event.preventDefault();
  editor.update(() => {
    const newSelection = $createRangeSelection();
    $setSelection(newSelection);
    nextNode.selectPrevious();
  });

  return true;
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

  function handleDelete(event: KeyboardEvent): boolean {
    if (!isEditable) return false;
    if (!isSelected) return false;

    const node = $getNodeByKey(nodeKey);
    if (!node) return false;

    event.preventDefault();
    editor.update(() => {
      node.selectNext();
      node.remove(true);
    });
    return true;
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        moveCursorBefore,
        COMMAND_PRIORITY_NORMAL
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        moveCursorAfter,
        COMMAND_PRIORITY_NORMAL
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, handleDelete]);

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
