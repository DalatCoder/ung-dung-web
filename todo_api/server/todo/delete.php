<?php

require '../open_cors.php';
require '../db.php';
require '../utils.php';

$id = get_request_data_by_key('id');

if (empty($id)) {
    response_data('fail', null, 'Vui lòng truyền mã của công việc', 400);
    die();
}

$sql = "DELETE FROM `todos` WHERE id = :id";
$statement = $pdo->prepare($sql);

$statement->execute([
    ':id' => $id
]);

response_data('success', null, 'Xóa công việc thành công', 200);
