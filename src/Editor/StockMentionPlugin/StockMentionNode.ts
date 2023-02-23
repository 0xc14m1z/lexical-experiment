import {
  DOMConversion,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  NodeKey,
  TextNode,
} from "lexical";
import { SerializedStockMentionNode } from "./SerializedStockMentionNode";
import { $createStockMentionNode } from "./$createStockMentionNode";

export class StockMentionNode extends TextNode {
  __ticker: string;
  __name: string;

  static getType() {
    return "stockMention" as const;
  }

  constructor(ticker: string, name: string, label: string, key?: NodeKey) {
    super(label, key);
    this.__ticker = ticker;
    this.__name = name;
  }

  static clone(node: StockMentionNode): StockMentionNode {
    return new StockMentionNode(
      node.__ticker,
      node.__name,
      node.__text,
      node.__key
    );
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.className = config.theme[StockMentionNode.getType()] ?? "";
    element.setAttribute("data-type", StockMentionNode.getType());
    element.setAttribute("data-ticker", this.__ticker);
    element.setAttribute("data-name", this.__name);
    element.textContent = this.__text;
    return element;
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

  static importJSON(json: SerializedStockMentionNode): StockMentionNode {
    const node = $createStockMentionNode(json.ticker, json.name, json.text);
    node.setFormat(node.format);
    node.setStyle(node.style ?? "");
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-type", StockMentionNode.getType());
    element.setAttribute("data-ticker", this.__ticker);
    element.setAttribute("data-name", this.__name);
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span(node: HTMLElement): DOMConversion | null {
        if (!node.hasAttribute("data-type")) return null;
        if (node.getAttribute("data-type") !== StockMentionNode.getType())
          return null;

        return {
          priority: 1,
          conversion(element: HTMLElement): DOMConversionOutput {
            const ticker = element.getAttribute("data-ticker")!;
            const name = element.getAttribute("data-name")!;
            const node = $createStockMentionNode(
              ticker,
              name,
              element.textContent ?? name
            );

            return {
              node,
            };
          },
        };
      },
    };
  }
}
