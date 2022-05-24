<?php

namespace Todo;

class Utils
{
    public static function get_response_structure($status, $data, $message)
    {
        return [
            'status' => $status,
            'data' => $data,
            'msg' => $message
        ];
    }
}
