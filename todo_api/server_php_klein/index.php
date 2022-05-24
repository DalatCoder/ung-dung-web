<?php

use Todo\TodoController;

require_once __DIR__ . '/vendor/autoload.php';

$klein = new \Klein\Klein();
$controller = new TodoController();

$klein->respond('GET', '/api/v1/todos', [$controller, 'handle_get_all_todos']);
$klein->respond('GET', '/api/v1/todos/detail/[i:id]', [$controller, 'handle_get_todo_by_id']);
$klein->respond('POST', '/api/v1/todos/create', [$controller, 'handle_create_new_todo']);
$klein->respond('PUT', '/api/v1/todos/update/[i:id]', [$controller, 'handle_update_todo_by_id']);
$klein->respond('PUT', '/api/v1/todos/complete/[i:id]', [$controller, 'handle_make_todo_complete']);
$klein->respond('PUT', '/api/v1/todos/incomplete/[i:id]', [$controller, 'handle_make_todo_incomplete']);
$klein->respond('DELETE', '/api/v1/todos/delete/[i:id]', [$controller, 'handle_delete_todo_by_id']);

$klein->dispatch();
