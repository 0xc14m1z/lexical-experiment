import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { AutoLinkNode } from "@lexical/link";

import { StateLogger } from "./StateLogger";
import { StockMentionNode, StockMentionPlugin } from "./StockMentionPlugin";

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
      // attributes: { rel: 'noopener', target: '_blank' }, // Optional link attributes
    };
  },
];

export function Editor() {
  const initialConfig: InitialConfigType = {
    namespace: "LexicalEditor",
    onError: console.error,
    nodes: [AutoLinkNode, StockMentionNode],
    theme: {
      link: "inline-block text-blue-500 underline bg-yellow-200 px-1 rounded",
      "stock-mention": "inline-block bg-blue-200 px-1 rounded",
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={
          <ContentEditable className="bg-white border rounded p-4" />
        }
        placeholder={<div>Write, come on!</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <AutoLinkPlugin matchers={MATCHERS} />
      <StockMentionPlugin />
      <StateLogger />
    </LexicalComposer>
  );
}
