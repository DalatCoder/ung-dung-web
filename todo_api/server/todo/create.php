<?php

require '../open_cors.php';
require '../db.php';
require '../utils.php';

$title = get_request_data_by_key('title');
$content = get_request_data_by_key('content');

if (empty($title)) {
    response_data('fail', null, 'Vui lòng nhập tiêu đề', 400);
    die();
}

$sql = "INSERT INTO `todos` (`title`, `content`) VALUES (:title, :content)";
$statement = $pdo->prepare($sql);

$statement->execute([
    ':title' => $title,
    ':content' => $content
]);

$new_todo_id = $pdo->lastInsertId();

$sql = "SELECT * FROM `todos` WHERE `id` = " . $new_todo_id;
$statement = $pdo->prepare($sql);
$statement->execute();

$new_todo = $statement->fetch(PDO::FETCH_ASSOC);

response_data('success', $new_todo, 'Tạo công việc thành công', 201);
