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
  copyToClipboard,
} from "@lexical/clipboard";
import { InitialConfigType } from "@lexical/react/LexicalComposer";

type Selection = RangeSelection | GridSelection | NodeSelection | null;

interface Props {
  editorConfig: InitialConfigType;
}

export function StateLogger({ editorConfig }: Props) {
  const [editor] = useLexicalComposerContext();
  const [serializedState, setSerializedState] = useState<string>("");
  const [serializedSelection, setSerializedSelection] = useState<string>("");
  const [serializedClipboard, setSerializedClipboard] = useState<string>("");

  function trackState() {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const jsonState = editorState.toJSON().root;
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
        copyToClipboard(
          editor,
          event instanceof ClipboardEvent ? event : null
        ).then(() => {
          clipboardToJSON(editorConfig, event.clipboardData).then(
            (jsonClipboard) => {
              const serializedClipboard = JSON.stringify(
                jsonClipboard,
                null,
                2
              );
              setSerializedClipboard(serializedClipboard);
            }
          );
        });
        return false;
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

function clipboardToJSON(
  editorConfig: InitialConfigType,
  dataTransfer: DataTransfer | null
): Promise<any> {
  return new Promise((resolve) => {
    if (!dataTransfer) return resolve(null);

    // create a temporary editor where to "dump" the copied piece of state
    // that is going to be used just for visualization
    const clipboardEditor = createEditor({
      namespace: editorConfig.namespace,
      nodes: editorConfig.nodes,
      theme: editorConfig.theme,
    });
    const root = document.createElement("div");
    clipboardEditor.setRootElement(root);

    // simulate a paste in the temporary editor to trigger an update...
    clipboardEditor.registerUpdateListener(storeClipboard);
    clipboardEditor.update(() => {
      $insertDataTransferForRichText(
        dataTransfer,
        $createRangeSelection(),
        clipboardEditor
      );
    });

    // ...and extract the updated state
    function storeClipboard({ editorState }: { editorState: EditorState }) {
      resolve(editorState.toJSON().root);
    }
  });
}
