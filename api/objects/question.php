<?php
class Question{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_questions";
 
    // object properties
    public $id;
    public $correct_answer;
    public $question;
    public $test;
    public $answer1;
    public $answer2;
    public $answer3;
    public $answer4;
    public $answer5;
    public $answer6;
 
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