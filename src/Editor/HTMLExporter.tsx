import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import classNames from "classnames";

export function HTMLExporter() {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        setState(htmlString);
      });
    });
  }, [editor]);

  const copyHTML = async () => {
    await navigator.clipboard.writeText(state);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000);
    }
  }, [copied]);

  return (
    <section className="mt-8">
      <h2 className="text-normal font-bold">Exported HTML:</h2>
      <pre className="bg-slate-300 p-4 border rounded text-sm">{state}</pre>
      <footer className="mt-2">
        <button
          onClick={copyHTML}
          className={classNames("rounded px-8 py-2 text-white cursor-pointer", {
            "bg-blue-500 hover:bg-blue-600": !copied,
            "bg-green-500 pointer-events-none": copied,
          })}
        >
          Copy
        </button>
      </footer>
    </section>
  );
}
