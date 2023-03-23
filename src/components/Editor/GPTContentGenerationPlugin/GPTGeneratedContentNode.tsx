import { ReactNode } from "react";
import {
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
} from "lexical";
import { GPTGeneratedContentComponent } from "@/components/Editor/GPTContentGenerationPlugin/GPTGeneratedContentComponent";

export class GPTGeneratedContentNode extends DecoratorNode<ReactNode> {
  _prompt: string;

  public setPrompt(newPrompt: string): void {
    const self = this.getWritable();
    self._prompt = newPrompt;
  }

  public static getType(): "gpt-generated-content" {
    return "gpt-generated-content";
  }

  constructor(key?: NodeKey) {
    super(key);
    this._prompt = "";
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLSpanElement {
    const container = document.createElement("span");
    container.className = "inline-flex leading-none";
    return container;
  }

  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return false;
  }

  static clone(node: GPTGeneratedContentNode): GPTGeneratedContentNode {
    return new GPTGeneratedContentNode(node.__key);
  }

  exportJSON(): any {
    return {
      type: GPTGeneratedContentNode.getType(),
      prompt: this._prompt,
    };
  }

  exportDOM(): DOMExportOutput {
    return {
      element: null,
    };
  }

  decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
    return (
      <GPTGeneratedContentComponent config={config} nodeKey={this.__key} />
    );
  }
}

export function $createGPTGeneratedContentNode(
  key?: NodeKey
): GPTGeneratedContentNode {
  return new GPTGeneratedContentNode(key);
}

export function isGPTGeneratedContentNode(
  node: LexicalNode
): node is GPTGeneratedContentNode {
  return node.getType() === GPTGeneratedContentNode.getType();
}
