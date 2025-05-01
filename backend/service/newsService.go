package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/brainDensed/stock-tracker/models"
)

func FetchNews(symbols []string) (*models.News, error) {
	MAUX_KEY := os.Getenv("MARKETAUX_API_KEY")
	joinedSymbols := strings.Join(symbols, ",")
	MAUX_URL := fmt.Sprintf("https://api.marketaux.com/v1/news/all?symbols=%s&filter_entities=true&language=en&api_token=%s", joinedSymbols, MAUX_KEY)
	res, err := http.Get(MAUX_URL)
	if err != nil {
		fmt.Println("Error fetching news:", err)
		return nil, err
	}
	defer res.Body.Close()

	var news models.News
	err = json.NewDecoder(res.Body).Decode(&news)
	if err != nil {
		fmt.Println("Error decoding news response:", err)
		return nil, err
	}
	return &news, nil
}
