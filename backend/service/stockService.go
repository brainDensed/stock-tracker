package service

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/brainDensed/stock-tracker/models"
)

func FetchStock(symbol string, timeSeries string) any {
	ALPHA_VANTAGE_API_KEY := os.Getenv("ALPHA_VANTAGE_API_KEY")
	ALPHA_VANTAGE_URL := fmt.Sprintf("https://www.alphavantage.co/query?function=%s&symbol=%s&apikey=%s", timeSeries, symbol, ALPHA_VANTAGE_API_KEY)
	res, err := http.Get(ALPHA_VANTAGE_URL)
	if err != nil {
		fmt.Println("Error fetching stock data")
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return nil
	}

	var stockData map[string]any
	if err := json.Unmarshal([]byte(body), &stockData); err != nil {
		fmt.Println("Error decoding stock data:", err)
		return nil
	}
	return stockData
}

func FetchTopMovers() any {
	var ALPHA_VANTAGE_API_KEY = os.Getenv("ALPHA_VANTAGE_API_KEY")
	ALPHA_VANTAGE_URL := fmt.Sprintf("https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=%s", ALPHA_VANTAGE_API_KEY)
	res, err := http.Get(ALPHA_VANTAGE_URL)
	if err != nil {
		fmt.Println("Error fetching stock data")
	}
	defer res.Body.Close()

	var topMovers models.TopMovers
	err = json.NewDecoder(res.Body).Decode(&topMovers)
	if err != nil {
		fmt.Println("Error decoding top movers response:", err)
		return nil
	}
	return topMovers
}
