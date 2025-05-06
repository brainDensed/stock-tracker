import { ParamValue } from "next/dist/server/request/params";
import { Card } from "@/components/ui/card";

const TrackPrice = ({ symbol }: { symbol: ParamValue }) => {
    const formattedSymbol = `NASDAQ:${Array.isArray(symbol) ? symbol[0] : symbol}`;
    return (
        <Card className="p-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Price Chart</h2>
                    <span className="text-muted-foreground">{symbol}</span>
                </div>
                
                <div className="w-full h-[400px] aspect-video rounded-lg overflow-hidden border">
                    <iframe
                        key={Array.isArray(symbol) ? symbol[0] : symbol} // Force refresh when symbol changes
                        src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${formattedSymbol}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=light&style=1&timezone=exchange`}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        allowFullScreen
                        frameBorder="0"
                    />
                </div>
                
                <p className="text-sm text-muted-foreground">
                    Real-time price data provided by TradingView
                </p>
            </div>
        </Card>
    );
}

export default TrackPrice;