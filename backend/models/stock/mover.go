package models

type StockDetails struct {
	Ticker           string `json:"ticker"`
	Price            string `json:"price"`
	ChangeAmount     string `json:"change_amount"`
	ChangePercentage string `json:"change_percentage"`
	Volume           string `json:"volume"`
}

type TopMovers struct {
	Metadata           string         `json:"metadata"`
	LastUpdated        string         `json:"last_updated"`
	TopGainers         []StockDetails `json:"top_gainers"`
	TopLosers          []StockDetails `json:"top_losers"`
	MostActivelyTraded []StockDetails `json:"most_actively_traded"`
}
