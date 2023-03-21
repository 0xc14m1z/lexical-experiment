import { LexicalNode } from "lexical";
import { StockMentionNode } from "./StockMentionNode";

export function $isStockMentionNode(
  node: LexicalNode | null | undefined
): node is StockMentionNode {
  return node instanceof StockMentionNode;
}
