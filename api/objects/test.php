<?php
class Test{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_tests";
 
    // object properties
    public $id;
    public $user_id;
    public $user_name;
    public $date;
    public $time;
    public $result;
    public $object;
    public $estimated_time;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read()
    {
        $query = "SELECT * FROM  " . $this->table_name . "";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

}