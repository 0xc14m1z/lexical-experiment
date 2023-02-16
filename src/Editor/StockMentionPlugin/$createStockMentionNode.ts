import { StockMentionNode } from "./StockMentionNode";

export function $createStockMentionNode(
  ticker: string,
  name: string
): StockMentionNode {
  return new StockMentionNode(ticker, name);
}
