<?php

use Todo\TodoController;

require_once __DIR__ . '/vendor/autoload.php';

$klein = new \Klein\Klein();
$controller = new TodoController();

# cors middleware
$klein->respond('*', function ($request, $response) {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');
        header('Access-Control-Max-Age: 1728000');
        header('Content-Length: 0');
        header('Content-Type: text/plain');
        die();
    }

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
});

$klein->respond('GET', '/api/v1/todos', [$controller, 'handle_get_all_todos']);
$klein->respond('GET', '/api/v1/todos/detail/[i:id]', [$controller, 'handle_get_todo_by_id']);
$klein->respond('POST', '/api/v1/todos/create', [$controller, 'handle_create_new_todo']);
$klein->respond('PUT', '/api/v1/todos/update/[i:id]', [$controller, 'handle_update_todo_by_id']);
$klein->respond('PUT', '/api/v1/todos/complete/[i:id]', [$controller, 'handle_make_todo_complete']);
$klein->respond('PUT', '/api/v1/todos/incomplete/[i:id]', [$controller, 'handle_make_todo_incomplete']);
$klein->respond('DELETE', '/api/v1/todos/delete/[i:id]', [$controller, 'handle_delete_todo_by_id']);

$klein->dispatch();
