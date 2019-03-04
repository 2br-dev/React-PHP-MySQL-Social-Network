<?php
class Chat{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_chats";
 
    // object properties
    public $id;
    public $last_message;
    public $users;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read()
    {
        $id = $this->users;
        $query = "SELECT * FROM  " . $this->table_name . " WHERE `users` LIKE '%s$id%'";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }
}