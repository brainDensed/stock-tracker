'use client';

import { useFetchTopMovers } from "@/hooks/queries/useFetchStocks";
import TopMoverCard from "./TopMoverCard";
import { StockDetails } from "@/types/topmover";

function Section({ title, data }: { title: string; data: StockDetails[] }) {
    return (
      <div className="bg-white p-3 rounded-md shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
        <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {data?.map((mover) => (
            <div key={mover.ticker} className="snap-start">
              <TopMoverCard mover={mover} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
export default function TopMovers() {
  const { data, isLoading, isError } = useFetchTopMovers();

  if (isLoading) return <p className="text-center mt-10">Fetching today's top movers...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load news.</p>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Top Movers</h2>
      {data && (
        <>
          <Section title="Top Gainers" data={data.top_gainers} />
          <Section title="Top Losers" data={data.top_losers} />
          <Section title="Most Actively Traded" data={data.most_actively_traded} />
        </>
      )}
    </div>
  );
}
