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

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

}