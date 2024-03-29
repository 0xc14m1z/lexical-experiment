import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import { StateLogger } from "./StateLogger";
import { StockMentionPlugin, StockMentionNode } from "./StockMentionPlugin";
import { ImageNode, ImagePlugin } from "./ImagePlugin";

import { HTMLExporter } from "./HTMLExporter";
import { HTMLImporter } from "./HTMLImporter";
import { RichClipboardPlugin } from "./RichClipboardPlugin";
import { YoutubePreviewPlugin } from "./YoutubePreviewPlugin";
import { LinkPlugins } from "./LinkPlugins";
import {
  GPTContentGenerationPlugin,
  GPTGeneratedContentNode,
} from "./GPTContentGenerationPlugin";

export default function Editor() {
  const initialConfig: InitialConfigType = {
    namespace: "LexicalEditor",
    onError: console.error,
    nodes: [
      StockMentionNode,
      ImageNode,
      LinkNode,
      AutoLinkNode,
      GPTGeneratedContentNode,
    ],
    theme: {
      stockMention: "inline-block bg-blue-200 px-1 rounded",
      customImage: {
        container: {
          idle: "rounded",
          edit: "p-8 border border-2",
          selected: "border-blue-300",
        },
        image: {
          idle: "max-h-96 mx-auto",
        },
      },
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
        <YoutubePreviewPlugin />
      </div>

      <RichClipboardPlugin />
      <StockMentionPlugin />
      <ImagePlugin />
      <LinkPlugins />
      <GPTContentGenerationPlugin />

      <StateLogger editorConfig={initialConfig} />
      <HTMLExporter />
      <HTMLImporter />
    </LexicalComposer>
  );
}
