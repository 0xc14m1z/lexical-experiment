import { ChangeEvent, useCallback, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

export function HTMLImporter() {
  const [editor] = useLexicalComposerContext();
  const [html, setHTMLChange] = useState("");

  const handleHTMLChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setHTMLChange(event.currentTarget.value);
    },
    []
  );

  const importHTML = () => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    });
  };

  return (
    <section className="mt-8">
      <h2 className="text-normal font-bold">Import HTML:</h2>
      <textarea
        value={html}
        onChange={handleHTMLChange}
        className="bg-white border rounded p-4 w-full h-48 block"
      />
      <footer className="mt-2">
        <button
          onClick={importHTML}
          className="rounded px-8 py-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
        >
          Import
        </button>
      </footer>
    </section>
  );
}
