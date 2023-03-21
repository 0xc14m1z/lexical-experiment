import { StockMentionNode } from "./StockMentionNode";

export function $createStockMentionNode(
  ticker: string,
  name: string,
  label: string
): StockMentionNode {
  const node = new StockMentionNode(ticker, name, label);
  node.setMode("segmented").setDetail("directionless");
  return node;
}
