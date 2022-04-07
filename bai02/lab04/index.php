<?php
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
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lab04</title>
</head>

<body>
    <form action="" method="post">
        <div>
            <label for="email">Email:</label>
            <input type="email" name="email" id="email">
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password">
        </div>
        <hr>
        <input type="submit" name="submit" value="Login">
    </form>

    <?php
    if (isset($_POST['submit'])) {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        $user = $students[$email] ?? null;

        if (is_null($user)) {
            echo 'Sinh vien khong ton tai';
        } else {
            if ($user['password'] != $password) {
                echo 'Tai khoan hoac mat khau khong dung';
            } else {
                echo json_encode($user);
                return json_encode($user);
            }
        }
    }
    ?>
</body>

</html>
