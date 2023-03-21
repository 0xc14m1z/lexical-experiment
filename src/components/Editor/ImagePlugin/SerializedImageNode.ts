import { SerializedDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { ImageNode } from "./ImageNode";

export interface SerializedImageNode extends SerializedDecoratorBlockNode {
  version: number;
  source: string;
  type: ReturnType<(typeof ImageNode)["getType"]>;
}
