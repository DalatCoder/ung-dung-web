<?php

namespace Todo;

use PDO;

class TodoController
{
    private $db;
    private $pdo;

    public function __construct()
    {
        $this->db = new DB();
        $this->pdo = $this->db->open_connection();
    }

    public function handle_get_all_todos($request, $response)
    {
        $sql = "SELECT * FROM todos";

        $statement = $this->pdo->query($sql);
        $todos = $statement->fetchAll(PDO::FETCH_ASSOC);

        $response->code(200);
        return $response->json(Utils::get_response_structure('success', $todos, 'ok'));
    }

    public function handle_get_todo_by_id($request, $response)
    {
        $todo_id = $request->id ?? null;

        $sql = "SELECT * FROM todos WHERE id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);
        $statement->execute();
        $todo = $statement->fetch(PDO::FETCH_ASSOC);

        $response->code(200);
        return $response->json(Utils::get_response_structure('success', $todo, 'ok'));
    }

    public function handle_create_new_todo($request, $response)
    {
        $body = $request->body();
        $body = json_decode($body);

        $title = $body->title ?? null;
        $content = $body->content ?? null;

        $sql = "INSERT INTO todos(title, content) VALUES (:title, :content)";

        $statement = $this->pdo->prepare($sql);

        $statement->bindParam(':title', $title);
        $statement->bindParam(':content', $content);

        $statement->execute();

        $todo_id = $this->pdo->lastInsertId();

        $sql = "SELECT * FROM todos WHERE id = :id";
        $statement = $this->pdo->prepare($sql);
        $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);
        $statement->execute();
        $todo = $statement->fetch(PDO::FETCH_ASSOC);

        $response->code(201);
        return $response->json(Utils::get_response_structure('success', $todo, 'ok'));
    }

    public function handle_update_todo_by_id($request, $response)
    {
        $todo_id = $request->id ?? null;

        $body = $request->body();
        $body = json_decode($body);

        $title = $body->title ?? null;
        $content = $body->content ?? null;

        $sql = 'UPDATE todos
                SET 
                    title = :title,
                    content = :content
                WHERE id = :id';

        $statement = $this->pdo->prepare($sql);
        $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);
        $statement->bindParam(':title', $title);
        $statement->bindParam(':content', $content);

        if ($statement->execute()) {
            $sql = "SELECT * FROM todos WHERE id = :id";
            $statement = $this->pdo->prepare($sql);
            $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);
            $statement->execute();
            $todo = $statement->fetch(PDO::FETCH_ASSOC);

            $response->code(200);
            return $response->json(Utils::get_response_structure('success', $todo, 'ok'));
        }

        $response->code(400);
        return $response->json(Utils::get_response_structure('fail', null, 'có lỗi xảy ra, thử lại sau'));
    }

    public function handle_make_todo_complete($request, $response)
    {
        $todo_id = $request->id ?? null;

        $sql = 'UPDATE todos
                SET 
                    completed_at = now()
                WHERE id = :id';

        $statement = $this->pdo->prepare($sql);
        $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);

        if ($statement->execute()) {
            $sql = "SELECT * FROM todos WHERE id = :id";
            $statement = $this->pdo->prepare($sql);
            $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);
            $statement->execute();
            $todo = $statement->fetch(PDO::FETCH_ASSOC);

            $response->code(200);
            return $response->json(Utils::get_response_structure('success', $todo, 'ok'));
        }

        $response->code(400);
        return $response->json(Utils::get_response_structure('fail', null, 'có lỗi xảy ra, thử lại sau'));
    }

    public function handle_make_todo_incomplete($request, $response)
    {
        $todo_id = $request->id ?? null;

        $sql = 'UPDATE todos
                SET 
                    completed_at = NULL
                WHERE id = :id';

        $statement = $this->pdo->prepare($sql);
        $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);

        if ($statement->execute()) {
            $sql = "SELECT * FROM todos WHERE id = :id";
            $statement = $this->pdo->prepare($sql);
            $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);
            $statement->execute();
            $todo = $statement->fetch(PDO::FETCH_ASSOC);

            $response->code(200);
            return $response->json(Utils::get_response_structure('success', $todo, 'ok'));
        }

        $response->code(400);
        return $response->json(Utils::get_response_structure('fail', null, 'có lỗi xảy ra, thử lại sau'));
    }

    public function handle_delete_todo_by_id($request, $response)
    {
        $todo_id = $request->id ?? null;

        $sql = "DELETE FROM todos WHERE id = :id";

        $statement = $this->pdo->prepare($sql);
        $statement->bindParam(':id', $todo_id, PDO::PARAM_INT);

        if ($statement->execute()) {
            $response->code(200);
            return $response->json(Utils::get_response_structure('success', null, 'ok'));
        }

        $response->code(400);
        return $response->json(Utils::get_response_structure('fail', null, 'có lỗi xảy ra, thử lại sau'));
    }
}
