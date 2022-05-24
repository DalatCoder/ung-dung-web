<?php

function response_data($status, $data, $msg, $code)
{
    $response_data = [
        'status' => $status,
        'data' => $data,
        'msg' => $msg
    ];

    http_response_code($code);
    echo json_encode($response_data);

    die();
}

function response_data_with_custom_structure($data, $code)
{
    http_response_code($code);
    echo json_encode($data);

    die();
}

function get_request_data()
{
    $data = json_decode(file_get_contents('php://input'), true);

    return $data ?? [];
}

function get_request_data_by_key($key)
{
    $data = get_request_data();

    if (array_key_exists($key, $data)) {
        return $data[$key] ?? '';
    }

    return null;
}
