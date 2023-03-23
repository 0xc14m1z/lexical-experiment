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
  public static getType(): "gpt-generated-content" {
    return "gpt-generated-content";
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLSpanElement {
    const container = document.createElement("span");
    container.classList.add(
      "relative",
      "py-1",
      "-mt-1",
      "inline-flex",
      "leading-none",
      "border",
      "rounded",
      "inline-flex",
      "items-baseline",
      "focus-within:border-slate-300",
      "before:px-1",
      "before:content-['prompt']",
      "before:text-xs",
      "before:text-slate-400"
    );
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
