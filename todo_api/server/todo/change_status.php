<?php

require '../open_cors.php';
require '../db.php';
require '../utils.php';

$id = get_request_data_by_key('id');
$status = get_request_data_by_key('status');

if (empty($id)) {
    response_data('fail', null, 'Vui lòng nhập tiêu đề', 400);
    die();
}

$sql = "UPDATE todos SET completed_at = :completed_at WHERE id = :id";
$statement = $pdo->prepare($sql);

$statement->execute([
    ':completed_at' => $status ? date('Y-m-d H:i:s') : null,
    ':id' => $id
]);

$sql = "SELECT * FROM `todos` WHERE `id` = " . $id;
$statement = $pdo->prepare($sql);
$statement->execute();

$updated_todo = $statement->fetch(PDO::FETCH_ASSOC);

response_data('success', $updated_todo, 'Cập nhật công việc thành công', 200);
