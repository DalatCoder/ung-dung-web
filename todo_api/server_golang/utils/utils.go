package utils

import (
	"encoding/json"
	"net/http"

	"github.com/dalatcoder/todo_api/model"
)

func ResponseHelper(w http.ResponseWriter, status string, data interface{}, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	res := model.Response{
		Status: status,
		Data:   data,
		Msg:    msg,
	}
	json.NewEncoder(w).Encode(res)
}
