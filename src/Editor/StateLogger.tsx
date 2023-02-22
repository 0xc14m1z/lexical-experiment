import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  GridSelection,
  NodeSelection,
  RangeSelection,
} from "lexical";

type Selection = RangeSelection | GridSelection | NodeSelection | null;

export function StateLogger() {
  const [editor] = useLexicalComposerContext();
  const [serializedState, setSerializedState] = useState<string>("");
  const [serializedSelection, setSerializedSelection] = useState<string>("");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        setSerializedState(JSON.stringify(editorState.toJSON(), null, 2));
        setSerializedSelection(
          JSON.stringify(selectionToJSON($getSelection()), null, 2)
        );
      });
    });
  }, []);

  return (
    <section className="mt-8">
      <div className="grid grid-cols-2">
        <div>
          <h2 className="text-normal font-bold">State:</h2>
          <pre className="bg-slate-300 p-4 border rounded text-sm overflow-x-scroll">
            {serializedState}
          </pre>
        </div>
        <div>
          <h2 className="text-normal font-bold">Selection:</h2>
          <pre className="bg-slate-300 p-4 border rounded text-sm overflow-x-scroll">
            {serializedSelection}
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
