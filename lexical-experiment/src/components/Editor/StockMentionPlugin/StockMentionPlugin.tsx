import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { shouldSearchStocks } from "./shouldSearchStocks";
import { StockMentionNode } from "./StockMentionNode";
import { $createStockMentionNode } from "./$createStockMentionNode";
import { useStockSearch } from "./useStockSearch";
import { Stock } from "./Stock";

export function StockMentionPlugin() {
  const [editor] = useLexicalComposerContext();

  const [query, setQuery] = useState<string | null>("");
  const results = useStockSearch(query);
  const options: StockTypeaheadOption[] = useMemo(
    () => results.map(toStockTypeaheadOption),
    [results]
  );

  useEffect(() => {
    if (!editor.hasNodes([StockMentionNode])) {
      throw new Error(
        "Add the frekken StockMentionNode to the editor nodes come on! 😡"
      );
    }
  }, [editor]);

  const handleStockSelection = useCallback(
    (
      option: StockTypeaheadOption,
      textNodeContainingQuery: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const node = $createStockMentionNode(
          option.ticker,
          option.name,
          option.name
        );

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
      onQueryChange={setQuery}
      menuRenderFn={(anchorElementRef, itemProps) => {
        if (results.length === 0) return null;
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

function toStockTypeaheadOption(stock: Stock): StockTypeaheadOption {
  return new StockTypeaheadOption(stock.ticker, stock.name);
}

class StockTypeaheadOption extends TypeaheadOption {
  constructor(public ticker: string, public name: string) {
    super(name);
  }
}
