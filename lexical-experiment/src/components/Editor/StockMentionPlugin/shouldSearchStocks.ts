import { QueryMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";

export function shouldSearchStocks(text: string): QueryMatch | null {
  const match = /@(\w+)$/.exec(text);
  if (!match) return null;

  const { 0: replaceableString, 1: matchingString, index: leadOffset } = match;

  return {
    leadOffset,
    matchingString,
    replaceableString,
  };
}
