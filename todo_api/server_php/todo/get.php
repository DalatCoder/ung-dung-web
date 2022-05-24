<?php

require '../open_cors.php';
require '../db.php';
require '../utils.php';

$sql = "SELECT * FROM todos";
$statement = $pdo->query($sql);

// get all todos
$todos = $statement->fetchAll(PDO::FETCH_ASSOC);

response_data('success', $todos, 'Lấy danh sách todo thành công', 200);
