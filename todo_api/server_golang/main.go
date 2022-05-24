package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/dalatcoder/todo_api/model"
	"github.com/dalatcoder/todo_api/utils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

var databaseConnectionString string = "root:@tcp(127.0.0.1:3306)/todos?parseTime=true"

func returnAllTodos(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}
	defer db.Close()

	results, err := db.Query("SELECT * FROM todos")
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	todos := make([]model.Todo, 0)

	for results.Next() {
		var todo model.Todo
		err = results.Scan(&todo.Id, &todo.UserId, &todo.Title, &todo.Content, &todo.CompletedAt, &todo.CreatedAt)

		if err != nil {
			utils.ResponseHelper(w, "fail", nil, err.Error(), 400)
			return
		}

		todos = append(todos, todo)
	}

	utils.ResponseHelper(w, "success", todos, "Lấy danh sách công việc thành công", 200)
}

func returnSingleTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]
	id, _ := strconv.Atoi(key)

	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	defer db.Close()

	var todo model.Todo

	err = db.QueryRow("SELECT * FROM todos where id = ?", id).Scan(&todo.Id, &todo.UserId, &todo.Title, &todo.Content, &todo.CompletedAt, &todo.CreatedAt)
	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 500)
		return
	}

	utils.ResponseHelper(w, "success", todo, "Tìm thấy công việc", 200)
}

func createNewTodo(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	var todo model.Todo

	err := json.Unmarshal(reqBody, &todo)
	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 400)
		return
	}

	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	defer db.Close()

	sql := "INSERT INTO todos(title, content) VALUES ('" + todo.Title + "', '" + todo.Content.String + "')"
	res, err := db.Exec(sql)

	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	todoId, err := res.LastInsertId()
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	var newTodo model.Todo

	err = db.QueryRow("SELECT * FROM todos where id = ?", todoId).Scan(&newTodo.Id, &newTodo.UserId, &newTodo.Title, &newTodo.Content, &newTodo.CompletedAt, &newTodo.CreatedAt)
	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 500)
		return
	}

	utils.ResponseHelper(w, "success", newTodo, "Tạo công việc thành công", 201)
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	str := vars["id"]
	id, err := strconv.Atoi(str)

	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 400)
		return
	}

	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	defer db.Close()

	sql := "DELETE FROM todos WHERE id = " + strconv.Itoa(id)
	_, err = db.Exec(sql)

	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	utils.ResponseHelper(w, "success", nil, "Đã xóa thành công", 200)
}

func updateTodo(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	var todo model.Todo

	err := json.Unmarshal(reqBody, &todo)
	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 400)
		return
	}

	vars := mux.Vars(r)
	key := vars["id"]
	todoId, _ := strconv.Atoi(key)

	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	defer db.Close()

	sql := "UPDATE todos SET title = '" + todo.Title + "', content = '" + todo.Content.String + "' WHERE id = " + strconv.Itoa(todoId)
	_, err = db.Exec(sql)

	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	var updatedTodo model.Todo

	err = db.QueryRow("SELECT * FROM todos where id = ?", todoId).Scan(&updatedTodo.Id, &updatedTodo.UserId, &updatedTodo.Title, &updatedTodo.Content, &updatedTodo.CompletedAt, &updatedTodo.CreatedAt)
	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 500)
		return
	}

	utils.ResponseHelper(w, "success", updatedTodo, "Cập nhật công việc thành công", 201)
}

func completeTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]
	todoId, _ := strconv.Atoi(key)

	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	defer db.Close()

	sql := "UPDATE todos SET completed_at = NOW() WHERE id = " + strconv.Itoa(todoId)
	_, err = db.Exec(sql)

	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	var updatedTodo model.Todo

	err = db.QueryRow("SELECT * FROM todos where id = ?", todoId).Scan(&updatedTodo.Id, &updatedTodo.UserId, &updatedTodo.Title, &updatedTodo.Content, &updatedTodo.CompletedAt, &updatedTodo.CreatedAt)
	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 500)
		return
	}

	utils.ResponseHelper(w, "success", updatedTodo, "Cập nhật trạng thái công việc thành công", 200)
}

func inCompleteTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]
	todoId, _ := strconv.Atoi(key)

	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	defer db.Close()

	sql := "UPDATE todos SET completed_at = NULL WHERE id = " + strconv.Itoa(todoId)
	_, err = db.Exec(sql)

	if err != nil {
		utils.ResponseHelper(w, "error", nil, err.Error(), 500)
		return
	}

	var updatedTodo model.Todo

	err = db.QueryRow("SELECT * FROM todos where id = ?", todoId).Scan(&updatedTodo.Id, &updatedTodo.UserId, &updatedTodo.Title, &updatedTodo.Content, &updatedTodo.CompletedAt, &updatedTodo.CreatedAt)
	if err != nil {
		utils.ResponseHelper(w, "fail", nil, err.Error(), 500)
		return
	}

	utils.ResponseHelper(w, "success", updatedTodo, "Cập nhật trạng thái công việc thành công", 200)
}

func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/api/v1/todos", returnAllTodos).Methods("GET")
	router.HandleFunc("/api/v1/todos/detail/{id}", returnSingleTodo).Methods("GET")
	router.HandleFunc("/api/v1/todos/create", createNewTodo).Methods("POST")
	router.HandleFunc("/api/v1/todos/update/{id}", updateTodo).Methods("PUT")
	router.HandleFunc("/api/v1/todos/complete/{id}", completeTodo).Methods("PUT")
	router.HandleFunc("/api/v1/todos/incomplete/{id}", inCompleteTodo).Methods("PUT")
	router.HandleFunc("/api/v1/todos/delete/{id}", deleteTodo).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":5000", cors.AllowAll().Handler(router)))
	// log.Fatal(http.ListenAndServe(":5000", router))
}

func main() {
	fmt.Println("Server starting at http://localhost:5000")
	handleRequests()
}
