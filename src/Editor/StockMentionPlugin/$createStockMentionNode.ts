import { StockMentionNode } from "./StockMentionNode";

export function $createStockMentionNode(
  ticker: string,
  name: string
): StockMentionNode {
  const node = new StockMentionNode(ticker, name);
  node.setMode("token").setDetail("directionless");
  return node;
}
