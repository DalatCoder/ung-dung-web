<?php

require '../open_cors.php';
require '../db.php';
require '../utils.php';

$id = get_request_data_by_key('id');
$title = get_request_data_by_key('title');
$content = get_request_data_by_key('content');

if (empty($id)) {
    response_data('fail', null, 'Vui lòng truyền mã của công việc', 400);
    die();
}

if (empty($title)) {
    response_data('fail', null, 'Vui lòng truyền tiêu đề của công việc', 400);
    die();
}

$sql = 'UPDATE todos
        SET title = :title, content = :content
        WHERE id = :id';

$statement = $pdo->prepare($sql);

$statement->bindParam(':id', $id, PDO::PARAM_INT);
$statement->bindParam(':title', $title);
$statement->bindParam(':content', $content);

if ($statement->execute()) {
    $sql = "SELECT * FROM `todos` WHERE `id` = " . $id;
    $statement = $pdo->prepare($sql);
    $statement->execute();

    $todo = $statement->fetch(PDO::FETCH_ASSOC);
    response_data('success', $todo, 'Cập nhật công việc thành công', 200);
}

response_data('error', null, 'Có lỗi trong quá trình cập nhật công việc', 500);
