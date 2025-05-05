"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";

interface StockOverview {
    Symbol: string;
    Name: string;
    Description: string;
    Exchange: string;
    Currency: string;
    Country: string;
    Sector: string;
    Industry: string;
    MarketCapitalization: string;
    PERatio: string;
    EPS: string;
    DividendYield: string;
    "52WeekHigh": string;
    "52WeekLow": string;
    AnalystRating: string;
}

const Overview = () => {
    const { slug } = useParams();
    const { data: overview, isLoading } = useQuery<StockOverview>({
        queryKey: ["stockOverview", slug],
        queryFn: async () => {
            const { data } = await api.get(`/stock/overview?function=OVERVIEW&symbol=${slug}`);
            return data;
        },
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{overview?.Name} ({overview?.Symbol})</h1>
                <span className="text-lg text-muted-foreground">{overview?.Exchange}</span>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-semibold">Company Overview</h2>
                <p className="text-muted-foreground mb-6">{overview?.Description}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <InfoItem label="Sector" value={overview?.Sector} />
                    <InfoItem label="Industry" value={overview?.Industry} />
                    <InfoItem label="Country" value={overview?.Country} />
                    <InfoItem label="Market Cap" value={overview?.MarketCapitalization} />
                    <InfoItem label="P/E Ratio" value={overview?.PERatio} />
                    <InfoItem label="EPS" value={overview?.EPS} />
                    <InfoItem label="Dividend Yield" value={overview?.DividendYield} />
                    <InfoItem label="52 Week High" value={overview?.["52WeekHigh"]} />
                    <InfoItem label="52 Week Low" value={overview?.["52WeekLow"]} />
                </div>
            </Card>
        </div>
    );
};

const InfoItem = ({ label, value }: { label: string; value?: string }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "N/A"}</p>
    </div>
);

export default Overview;