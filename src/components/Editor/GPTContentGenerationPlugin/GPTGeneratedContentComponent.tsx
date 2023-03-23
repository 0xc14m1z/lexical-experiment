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
        flushSync(() => setIsLoading(true));

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
              const textNodes = response.split("\n").map($createTextNode);
              const node = $getNodeByKey(nodeKey)!;
              textNodes.forEach((textNode) => node.insertBefore(textNode));
              node.selectPrevious();
              node.remove();
            });
          });
      }
    },
    [editor, nodeKey, prompt]
  );

  // handle clipboard
  // handle moving the selection before/after
  // handle blur or typing ESC

  return (
    <>
      <input
        type="text"
        value={prompt}
        size={prompt.length || 1}
        onChange={updatePrompt}
        onKeyDown={handleEnter}
        className="outline-none disabled:text-slate-600"
        autoFocus
        disabled={isLoading}
      />
      {isLoading ? (
        <span className="absolute top-0 left-0 w-full h-full bg-slate-200 rounded animate-pulse" />
      ) : null}
    </>
  );
}
