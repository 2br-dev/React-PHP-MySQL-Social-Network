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
    public $estimated_time;
    public $completed;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read()
    {
        $query = "SELECT * FROM  " . $this->table_name . " ORDER BY `id` DESC";

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
        $query2 = "DELETE FROM db_mdd_results WHERE test_id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);
        $stmt2 = $this->conn->prepare($query2);
        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        // bind id of record to delete
        $stmt->bindParam(1, $this->id);
        $stmt2->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute() && $stmt2->execute()) {
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

    function getSingleTest()
    {
        $test = Q("SELECT * from `#_mdd_tests` WHERE `id` = ?s", array($this->id))->all();

        // execute query
        if (isset($test)) {
            return $test;
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

    function start()
    {
        $query = "UPDATE " . $this->table_name . "
                SET
                    completed = :completed
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->completed = htmlspecialchars(strip_tags($this->completed));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':completed', $this->completed);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function finish()
    {
        $result = Q("SELECT `result` FROM `#_mdd_results` WHERE `test_id` = ?s", array($this->id))->row('result');
        $questions = Q("SELECT `questions` FROM `#_mdd_tests` WHERE `id` = ?s", array($this->id))->row('questions');

        $this->fillObject();

        $questions = explode(',', $questions);
        $questions = count($questions);

        $coefficient = floatval($result) / intval($questions);

        $query = "UPDATE " . $this->table_name . "
                SET
                    completed = :completed,
                    estimated_time = :estimated_time,
                    result = :result,
                    created_at = :created_at
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->completed = htmlspecialchars(strip_tags($this->completed));
        $this->result = htmlspecialchars(strip_tags($coefficient));
        $this->estimated_time = htmlspecialchars(strip_tags($this->estimated_time));
        $this->created_at = strval($this->created_at);
        
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':completed', $this->completed);
        $stmt->bindParam(':result', $this->result);
        $stmt->bindParam(':estimated_time', $this->estimated_time);
        $stmt->bindParam(':created_at', $this->created_at);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getStatus()
    {
        $status = Q("SELECT `completed` FROM `#_mdd_tests` WHERE `id` = ?s", array($this->id))->row('completed');

        return $status;
    }

    function fillObject() {
        $questions = Q("SELECT `questions` FROM `#_mdd_tests` WHERE `id` = ?s", array($this->id))->row('questions');
        $questions = explode(',', $questions);

        $prev_object = Q("SELECT `object` FROM `#_mdd_results` WHERE `test_id` = ?s", array($this->id))->row('object');

        if (empty($prev_object)) {
            $object = array();      
        } else {
            $object = json_decode($prev_object);
        }

        $answered = array();
        $not_answered = array();

        if (count($object) > 0) {
            foreach ($object as $item) { 
                $item->question_data = json_decode($item->question_data);
                array_push($answered, intval($item->question_data->id));        
            }
        }
        
        foreach ($questions as $question) {
            $question_id = Q("SELECT `id` FROM  `#_mdd_questions` WHERE `id` = ?s", array($question))->row('id');
            
            if (!in_array($question_id, $answered)) {
                array_push($not_answered, $question_id);  
            } 
        }

        $query = "UPDATE db_mdd_results
        SET
            not_answered = :not_answered
        WHERE
            `test_id` = :test_id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $not_answered = strip_tags(json_encode($not_answered));

        // bind new values
        $stmt->bindParam(':test_id', $this->id);
        $stmt->bindParam(':not_answered', $not_answered);

        $stmt->execute();
    }
}