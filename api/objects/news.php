<?php
class News{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_news";
 
    // object properties
    public $id;
    public $author;
    public $date;
    public $title;
    public $text;
    public $importance;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT * FROM `db_mdd_news` ORDER BY `ord` DESC";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }

}