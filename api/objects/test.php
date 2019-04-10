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
    public $completed;
 
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

    function readById()
    {
        $query = "SELECT * FROM  " . $this->table_name . " WHERE user_id = ? AND completed = ?";

        $stmt = $this->conn->prepare($query);
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $stmt->bindParam(1, $this->user_id);
        $stmt->bindParam(2, $this->completed);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);
        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        // bind id of record to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getLastId()
    {
        $last_id = Q("SELECT MAX(`id`) from `#_mdd_tests`")->row('MAX(`id`)');

        // execute query
        if (isset($last_id)) {
            return $last_id;
        }

        return false;
    }

    function create()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . "
           SET 
           `questions`=:questions, 
           `user_name`=:user_name, 
           user_id=:user_id, 
           time=:time, 
           date=:date, 
           estimated_time=:estimated_time";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->questions = htmlspecialchars(strip_tags($this->questions));
        $this->user_name = htmlspecialchars(strip_tags($this->user_name));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->estimated_time = htmlspecialchars(strip_tags($this->estimated_time));
 
        // bind values
        $stmt->bindParam(":questions", $this->questions);
        $stmt->bindParam(":user_name", $this->user_name);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":estimated_time", $this->estimated_time);

        // execute query
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

}