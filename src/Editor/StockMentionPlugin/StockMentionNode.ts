import { EditorConfig, NodeKey, TextNode } from "lexical";
import { SerializedStockMentionNode } from "./SerializedStockMentionNode";
import { $createStockMentionNode } from "./$createStockMentionNode";

export class StockMentionNode extends TextNode {
  __ticker!: string;
  __name!: string;

  static getType() {
    return "stockMention" as const;
  }

  constructor(ticker: string, name: string, key?: NodeKey) {
    super(name, key);
    this.__ticker = ticker;
    this.__name = name;
    this.setMode("token");
  }

  static clone(node: StockMentionNode): StockMentionNode {
    return new StockMentionNode(node.__ticker, node.__ticker, node.__key);
  }

  getTicker(): string {
    const self = this.getLatest();
    return self.__ticker;
  }

  setTicker(newTicker: string): this {
    const self = this.getWritable();
    self.__ticker = newTicker;
    return this;
  }

  getName(): string {
    const self = this.getLatest();
    return self.__name;
  }

  setName(newName: string): this {
    const self = this.getWritable();
    self.__name = newName;
    return this;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.className = config.theme[StockMentionNode.getType()];
    dom.textContent = this.__name;
    return dom;
  }

  static importJSON(json: SerializedStockMentionNode): StockMentionNode {
    const node = $createStockMentionNode(json.ticker, json.name);
    node.setTextContent(node.text);
    node.setFormat(node.format);
    node.setDetail(node.detail);
    node.setMode(node.mode);
    node.setStyle(node.style);
    return node;
  }

  exportJSON(): SerializedStockMentionNode {
    return {
      ...super.exportJSON(),
      type: StockMentionNode.getType(),
      version: 1,
      ticker: this.__ticker,
      name: this.__name,
    };
  }

  isTextEntity(): boolean {
    return true;
  }
}
