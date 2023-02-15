import { LexicalNode, NodeKey, TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// inspire yourself here: https://codesandbox.io/s/objective-diffie-o037k3?file=/src/plugins/MentionsPlugin.tsx:6746-6791
export function StockMentionPlugin() {
  const [editor] = useLexicalComposerContext();

  // 1. intercept the @ symbol
  // 2. do the call
  // 3. show some results
  // 4. add a mention when a result is selected

  return null;
}

class StockMentionNode extends TextNode {
  __ticker!: string;
  __name!: string;

  static getType(): string {
    return "stock-mention";
  }

  constructor(ticker: string, name: string, key?: NodeKey) {
    super(name, key);
    this.__ticker = ticker;
    this.__name = name;
  }

  static clone(node: StockMentionNode): StockMentionNode {
    return new StockMentionNode(node.__ticker, node.__ticker, node.__key);
  }

  getTicker(): string {
    return this.getLatest().__ticker;
  }

  setTicker(newTicker: string): void {
    this.getWritable().__ticker = newTicker;
  }

  getName(): string {
    return this.getLatest().__name;
  }

  setName(newName: string): void {
    this.getWritable().__name = newName;
  }
}

export function $createStockMentionNode(
  ticker: string,
  name: string
): StockMentionNode {
  return new StockMentionNode(ticker, name);
}

export function $isStockMentionNode(
  node: LexicalNode | null | undefined
): node is StockMentionNode {
  return node instanceof StockMentionNode;
}
