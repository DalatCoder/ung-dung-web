<?php

$students = [
    [
        'email' => 'ha@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Hà',
        'diem' => '10'
    ],
    [
        'email' => 'hieu@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Hiếu',
        'diem' => '8'
    ],
    [
        'email' => 'hieu1@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Trọng Hiếu',
        'diem' => '9'
    ],
    [
        'email' => 'thi@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Thị',
        'diem' => '7'
    ],
    [
        'email' => 'ai@dlu.edu.vn',
        'password' => '1234',
        'name' => 'Nguyễn Thị Ái',
        'diem' => '10'
    ],
];

$xml = new SimpleXMLElement('<xml/>');

foreach ($students as $student) {
    $track = $xml->addChild('student');
    $track->addChild('email', $student['email']);
    $track->addChild('password', $student['password']);
    $track->addChild('name', $student['name']);
    $track->addChild('diem', $student['diem']);
}

Header('Content-type: text/xml');
print($xml->asXML());
