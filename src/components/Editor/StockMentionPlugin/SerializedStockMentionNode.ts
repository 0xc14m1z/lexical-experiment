import { SerializedTextNode, Spread } from "lexical";
import { StockMentionNode } from "./StockMentionNode";

export type SerializedStockMentionNode = Spread<
  {
    ticker: string;
    name: string;
    type: ReturnType<(typeof StockMentionNode)["getType"]>;
    version: 1;
  },
  SerializedTextNode
>;
