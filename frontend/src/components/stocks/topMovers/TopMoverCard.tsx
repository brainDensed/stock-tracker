import { StockDetails } from "@/types/topmover";

export default function TopMoverCard({ mover }: { mover: StockDetails }) {
    const isPositive = parseFloat(mover.change_amount) >= 0;

    const changeColor = isPositive ? "text-green-600" : "text-red-600";

    return (
        <div className="min-w-[160px] p-3 rounded-lg shadow-sm bg-white border border-gray-200 text-sm space-y-1">
            <div className="font-medium text-base">{mover.ticker}</div>
            <div className="text-gray-500">Price: ${mover.price}</div>
            <div className={changeColor}>Change: {mover.change_amount}</div>
            <div className={changeColor}>{mover.change_percentage}</div>
            <div className="text-xs text-gray-400">Vol: {mover.volume}</div>
        </div>

    );
}
