import { ChangeEvent, useCallback, useState, KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { $createTextNode, $getNodeByKey, EditorConfig, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface Props {
  config: EditorConfig;
  nodeKey: NodeKey;
}

export function GPTGeneratedContentComponent({ nodeKey }: Props) {
  const [editor] = useLexicalComposerContext();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updatePrompt = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.currentTarget.value);
  }, []);

  const handleEnter = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        flushSync(() => {
          setIsLoading(true);
        });
        fetch(window.origin + "/api/gpt", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: prompt,
        })
          .then((response) => response.text())
          .then((response) => {
            editor.update(() => {
              const textNode = $createTextNode(response);
              const node = $getNodeByKey(nodeKey);
              node?.replace(textNode);
            });
          });
      }
    },
    [editor, nodeKey, prompt]
  );

  return (
    <span className="border rounded inline-flex items-center focus-within:border-blue-400">
      <span className="text-xs text-slate-400 px-2">
        {isLoading ? "loading" : "prompt"}
      </span>
      <input
        type="text"
        value={prompt}
        size={prompt.length || 1}
        onChange={updatePrompt}
        onKeyDown={handleEnter}
        className="outline-none rounded"
        autoFocus
        disabled={isLoading}
      />
    </span>
  );
}
