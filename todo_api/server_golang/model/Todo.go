package model

import (
	"time"

	"gopkg.in/guregu/null.v4"
)

type Todo struct {
	Id          int         `json:"id"`
	UserId      int         `json:"user_id"`
	Title       string      `json:"title"`
	Content     null.String `json:"content"`
	CompletedAt null.Time   `json:"completed_at"`
	CreatedAt   time.Time   `json:"created_at"`
}
