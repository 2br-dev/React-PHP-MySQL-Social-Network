<?php
class Mistake{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_mistakes";
 
    // object properties
    public $id;
    public $test;
    public $count;
    public $desc;
 
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