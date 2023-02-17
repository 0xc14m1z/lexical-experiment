import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function StateLogger() {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<string>("");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        setState(JSON.stringify(editorState.toJSON(), null, 2));
      });
    });
  }, []);

  return (
    <section className="mt-8">
      <h2 className="text-normal font-bold">Lexical state:</h2>
      <pre className="bg-slate-300 p-4 border rounded text-sm">{state}</pre>
    </section>
  );
}
