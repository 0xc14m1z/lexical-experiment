import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { StateLogger } from "./StateLogger";
import { StockMentionPlugin, StockMentionNode } from "./StockMentionPlugin";
import { ImageNode, ImagePlugin } from "./ImagePlugin";

import { HTMLExporter } from "./HTMLExporter";
import { HTMLImporter } from "./HTMLImporter";

export function Editor() {
  const initialConfig: InitialConfigType = {
    namespace: "LexicalEditor",
    onError: console.error,
    nodes: [StockMentionNode, ImageNode],
    theme: {
      link: "inline-block text-blue-500 underline bg-yellow-200 px-1 rounded",
      stockMention: "inline-block bg-blue-200 px-1 rounded",
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="bg-white border border-2 rounded p-4 focus-within:border-blue-500">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>

      <StockMentionPlugin />
      <ImagePlugin />

      <StateLogger />
      <HTMLExporter />
      <HTMLImporter />
    </LexicalComposer>
  );
}
