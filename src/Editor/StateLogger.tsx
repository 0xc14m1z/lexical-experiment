import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

export function StateLogger() {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<string>("");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      setState(JSON.stringify(editorState.toJSON(), null, 2));
    });
  }, []);

  return (
    <pre className="mt-8 bg-slate-300 p-4 border rounded text-sm">{state}</pre>
  );
}
