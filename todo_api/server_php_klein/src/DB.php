<?php

namespace Todo;

use PDO;
use PDOException;

class DB
{
    private $pdo;

    public function open_connection()
    {
        $host = 'localhost';
        $db = 'todos';
        $user = 'root';
        $password = '';

        $dsn = "mysql:host=$host;dbname=$db;charset=UTF8";

        try {
            $pdo = new PDO($dsn, $user, $password);

            if ($pdo) {
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->pdo = $pdo;

                return $pdo;
            }

            return null;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die();
        }
    }
}
