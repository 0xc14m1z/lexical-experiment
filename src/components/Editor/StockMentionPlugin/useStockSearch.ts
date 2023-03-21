import { useEffect, useState } from "react";
import { Stock } from "./Stock";

export function useStockSearch(query: string | null) {
  const [results, setResults] = useState<Stock[]>([]);

  useEffect(() => {
    async function search(query: string) {
      const stocks = await searchStocks(query);
      setResults(stocks);
    }

    if (query && query.trim().length > 1) {
      void search(query);
    }
  }, [query]);

  return results ?? [];
}

interface StockDto {
  "1. symbol": string;
  "2. name": string;
}

function toStock(dto: StockDto): Stock {
  return {
    ticker: dto["1. symbol"],
    name: dto["2. name"],
  };
}

async function searchStocks(query: string): Promise<Stock[]> {
  const endpoint = `https://stock-api-ahead.vercel.app/api/search?query=${query}`;
  const response = await fetch(endpoint);
  const rawData: { bestMatches: StockDto[] } = await response.json();
  return rawData.bestMatches.map(toStock);
}
