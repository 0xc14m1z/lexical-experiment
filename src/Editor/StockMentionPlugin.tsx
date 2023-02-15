import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import {
  $createTextNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
  TextNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  QueryMatch,
  TypeaheadOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

// inspire yourself here: https://codesandbox.io/s/objective-diffie-o037k3?file=/src/plugins/MentionsPlugin.tsx:6746-6791
export function StockMentionPlugin() {
  const [editor] = useLexicalComposerContext();

  const [query, setQuery] = useState<string>("");
  const handleQuery = useCallback((query: string | null) => {
    setQuery(query ?? "");
  }, []);

  const [results, setResults] = useState<Stock[]>([]);
  const options: StockOption[] = useMemo(
    () => results.map(toStockOption),
    [results]
  );

  useEffect(() => {
    if (!editor.hasNodes([StockMentionNode])) {
      throw new Error(
        "Add the frekken StockMentionNode to the editor nodes come on! 😡"
      );
    }
  }, [editor]);

  useEffect(() => {
    async function search(query: string) {
      const stocks = await searchStocks(query);
      setResults(stocks);
    }

    if (query && query.trim().length > 1) {
      search(query).finally();
    }
  }, [query]);

  const shouldSearchStocks = useCallback((text: string): QueryMatch | null => {
    const match = /@(\w+)$/.exec(text);
    if (!match) return null;

    const {
      0: replaceableString,
      1: matchingString,
      index: leadOffset,
    } = match;

    return {
      leadOffset,
      matchingString,
      replaceableString,
    };
  }, []);

  const handleStockSelection = useCallback(
    (
      option: StockOption,
      textNodeContainingQuery: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const node = $createStockMentionNode(option.ticker, option.name);
        if (textNodeContainingQuery) {
          textNodeContainingQuery.replace(node);
        }
        node.select();
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={handleQuery}
      menuRenderFn={(anchorElementRef, itemProps, matchingString) => {
        return (
          <ul className="bg-white rounded shadow py-2">
            {options.map((option, index) => (
              <li
                key={option.ticker}
                className={classNames(
                  "px-4 py-2",
                  itemProps.selectedIndex === index
                    ? "bg-blue-500 text-white"
                    : "bg-white text-slate-500"
                )}
                onClick={() => {
                  itemProps.setHighlightedIndex(index);
                  itemProps.selectOptionAndCleanUp(option);
                }}
                onMouseEnter={() => {
                  itemProps.setHighlightedIndex(index);
                }}
              >
                {option.name} ({option.ticker})
              </li>
            ))}
          </ul>
        );
      }}
      onSelectOption={handleStockSelection}
      options={options}
      triggerFn={shouldSearchStocks}
    />
  );
}

export class StockMentionNode extends TextNode {
  __ticker!: string;
  __name!: string;

  static getType() {
    return "stock-mention" as const;
  }

  constructor(ticker: string, name: string, key?: NodeKey) {
    super(name, key);
    this.__ticker = ticker;
    this.__name = name;
    this.setMode("token");
  }

  static clone(node: StockMentionNode): StockMentionNode {
    return new StockMentionNode(node.__ticker, node.__ticker, node.__key);
  }

  getTicker(): string {
    return this.getLatest().__ticker;
  }

  setTicker(newTicker: string): void {
    this.getWritable().__ticker = newTicker;
  }

  getName(): string {
    return this.getLatest().__name;
  }

  setName(newName: string): void {
    this.getWritable().__name = newName;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.className = config.theme[StockMentionNode.getType()];
    dom.textContent = this.__name;
    return dom;
  }

  static importJSON(json: SerializedStockMentionNode): StockMentionNode {
    const node = $createStockMentionNode(json.ticker, json.name);
    node.setTextContent(node.text);
    node.setFormat(node.format);
    node.setDetail(node.detail);
    node.setMode(node.mode);
    node.setStyle(node.style);
    return node;
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

  isTextEntity(): boolean {
    return true;
  }
}

export type SerializedStockMentionNode = Spread<
  {
    ticker: string;
    name: string;
    type: ReturnType<(typeof StockMentionNode)["getType"]>;
    version: 1;
  },
  SerializedTextNode
>;

export function $createStockMentionNode(
  ticker: string,
  name: string
): StockMentionNode {
  return new StockMentionNode(ticker, name);
}

export function $isStockMentionNode(
  node: LexicalNode | null | undefined
): node is StockMentionNode {
  return node instanceof StockMentionNode;
}

interface Stock {
  ticker: string;
  name: string;
}

interface StockDto {
  "1. symbol": string;
  "2. name": string;
}

async function searchStocks(query: string): Promise<Stock[]> {
  const endpoint = `https://stock-api-ahead.vercel.app/api/search?query=${query}`;
  const response = await fetch(endpoint);
  const rawData: { bestMatches: StockDto[] } = await response.json();
  return rawData.bestMatches.map(toStock);
}

function toStock(dto: StockDto): Stock {
  return {
    ticker: dto["1. symbol"],
    name: dto["2. name"],
  };
}

function toStockOption(stock: Stock): StockOption {
  return new StockOption(stock.ticker, stock.name);
}

class StockOption extends TypeaheadOption {
  constructor(public ticker: string, public name: string) {
    super(name);
  }
}
