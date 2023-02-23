import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createRangeSelection,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COPY_COMMAND,
  createEditor,
  EditorState,
  GridSelection,
  NodeSelection,
  RangeSelection,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import {
  $insertDataTransferForRichText,
  copyToClipboard__EXPERIMENTAL,
} from "@lexical/clipboard";
import { UpdateListener } from "lexical/LexicalEditor";

type Selection = RangeSelection | GridSelection | NodeSelection | null;

export function StateLogger() {
  const [editor] = useLexicalComposerContext();
  const [serializedState, setSerializedState] = useState<string>("");
  const [serializedSelection, setSerializedSelection] = useState<string>("");
  const [serializedClipboard, setSerializedClipboard] = useState<string>("");

  function trackState() {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const jsonState = editorState.toJSON();
        const serializedState = JSON.stringify(jsonState, null, 2);
        setSerializedState(serializedState);
      });
    });
  }

  function trackSelection() {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        const jsonSelection = selectionToJSON(selection);
        const serializedSelection = JSON.stringify(jsonSelection, null, 2);
        setSerializedSelection(serializedSelection);
      });
    });
  }

  function trackClipboard() {
    return editor.registerCommand(
      COPY_COMMAND,
      (event: ClipboardEvent) => {
        copyToClipboard__EXPERIMENTAL(
          editor,
          event instanceof ClipboardEvent ? event : null
        ).then(() => {
          if (!event.clipboardData) return;

          const clipboardEditor = createEditor(editor._config);
          const root = document.createElement("div");
          clipboardEditor.setRootElement(root);
          let removeListener = () => {};
          const storeClipboard: UpdateListener = ({ editorState }) => {
            const jsonClipboard = editorState.toJSON();
            const serializedClipboard = JSON.stringify(jsonClipboard, null, 2);
            setSerializedClipboard(serializedClipboard);

            removeListener();
          };

          removeListener =
            clipboardEditor.registerUpdateListener(storeClipboard);

          clipboardEditor.update(() => {
            $insertDataTransferForRichText(
              event.clipboardData!,
              $createRangeSelection(),
              clipboardEditor
            );
          });
        });
        return true;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }

  useEffect(() => {
    return mergeRegister(trackState(), trackSelection(), trackClipboard());
  }, [editor]);

  return (
    <section className="mt-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="row-span-3">
          <h2 className="text-normal font-bold">State:</h2>
          <pre className="bg-slate-300 p-4 border rounded text-sm overflow-x-scroll">
            {serializedState}
          </pre>
        </div>
        <div className="align-self-start">
          <h2 className="text-normal font-bold">Selection:</h2>
          <pre className="bg-slate-300 p-4 border rounded text-sm overflow-x-scroll">
            {serializedSelection}
          </pre>
        </div>
        <div className="align-self-start">
          <h2 className="text-normal font-bold">Clipboard:</h2>
          <pre className="bg-slate-300 p-4 border rounded text-sm overflow-x-scroll">
            {serializedClipboard}
          </pre>
        </div>
      </div>
    </section>
  );
}

function selectionToJSON(selection: Selection): any {
  if (!selection) return null;

  if ($isRangeSelection(selection)) {
    const { anchor, focus } = selection;
    return {
      anchor: {
        key: anchor.key,
        offset: anchor.offset,
        type: anchor.type,
      },
      focus: {
        key: focus.key,
        offset: focus.offset,
        type: focus.type,
      },
    };
  }

  if ($isNodeSelection(selection)) {
    return {
      nodes: selection
        .getNodes()
        .map((node) => ({ ...node.exportJSON(), key: node.getKey() })),
    };
  }

  return {};
}
