<?php

// Chi dung duoc khi gui POST FORM
// $email = $_POST['email'] ?? '';
// $password = $_POST['password'] ?? '';

$students = [
    'ha@dlu.edu.vn' => [
        'email' => 'ha@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Hà',
        'diem' => '10'
    ],
    'hieu@dlu.edu.vn' => [
        'email' => 'hieu@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Hiếu',
        'diem' => '8'
    ],
    'hieu1@dlu.edu.vn' => [
        'email' => 'hieu1@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Trọng Hiếu',
        'diem' => '9'
    ],
    'thi@dlu.edu.vn' => [
        'email' => 'thi@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Thị',
        'diem' => '7'
    ],
    'ai@dlu.edu.vn' => [
        'email' => 'ai@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Ái',
        'diem' => '10'
    ],
];

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$user = $students[$email] ?? null;

if (is_null($user)) {
    echo json_encode('Sinh vien khong ton tai');
} else {
    if ($user['password'] != $password) {
        echo json_encode('Tai khoan hoac mat khau khong dung');
    } else {
        unset($user['password']);
        echo json_encode($user);
    }
}
