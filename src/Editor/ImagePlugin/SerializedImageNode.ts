import { SerializedElementNode, Spread } from "lexical";
import { ImageNode } from "./ImageNode";

export type SerializedImageNode = Spread<
  {
    version: number;
    source: string;
    type: ReturnType<(typeof ImageNode)["getType"]>;
  },
  SerializedElementNode
>;
