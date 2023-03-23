import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createGPTGeneratedContentNode,
  GPTGeneratedContentNode,
} from "@/components/Editor/GPTContentGenerationPlugin/GPTGeneratedContentNode";
import { TextNode } from "lexical";

export function GPTContentGenerationPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GPTGeneratedContentNode])) {
      throw new Error(
        "GPTContentGenerationPlugin: you must add the GPTGeneratedContentNode node to your editor"
      );
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (node: TextNode) => {
      const text = node.getTextContent();
      if (text.endsWith("!gpt")) {
        const updatedText = text.slice(0, -"!gpt".length);
        node.setTextContent(updatedText);
        node.insertAfter($createGPTGeneratedContentNode());
      }
    });
  }, [editor]);

  return null;
}
