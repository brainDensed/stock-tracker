export interface StockDetails {
	ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
}

export interface TopMovers {
    metadata: string;
    last_updated: string;
    top_gainers: StockDetails[];
    top_losers: StockDetails[];
    most_actively_traded: StockDetails[];
}
