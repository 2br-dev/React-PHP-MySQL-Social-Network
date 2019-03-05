<?php
class Message{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_messages";
 
    // object properties
    public $id;
    public $user;
    public $date;
    public $body;
    public $time;
    public $readed;
    public $edited;
    public $chat;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read()
    {
        $id = $this->id;
        $query = "SELECT * FROM  " . $this->table_name . " WHERE `users` LIKE '%$id%'";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function readByChat()
    {
        $chat_id = $this->chat;
        $query = "SELECT * FROM  " . $this->table_name . " WHERE `chat` = '$chat_id' ORDER BY `id` ASC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }
}