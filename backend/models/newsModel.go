package models

import (
	"time"
)

type News struct {
	Meta Meta   `json:"meta"`
	Data []Data `json:"data"`
}

type Meta struct {
	Found    int64 `json:"found"`
	Returned int64 `json:"returned"`
	Limit    int64 `json:"limit"`
	Page     int64 `json:"page"`
}

type Data struct {
	Uuid        string    `json:"uuid"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Keywords    string    `json:"keywords"`
	Snippet     string    `json:"snippet"`
	Url         string    `json:"url"`
	ImageURL    string    `json:"image_url"`
	Language    string    `json:"language"`
	PublishedAt time.Time `json:"published_at"`
	Source      string    `json:"source"`
	Entities    []Entity  `json:"entities"`
}

type Entity struct {
	Symbol         string  `json:"symbol"`
	Name           string  `json:"name"`
	Country        string  `json:"country"`
	Type           string  `json:"type"`
	Industry       string  `json:"industry"`
	MatchScore     float64 `json:"match_score"`
	SentimentScore float64 `json:"sentiment_score"`
}
