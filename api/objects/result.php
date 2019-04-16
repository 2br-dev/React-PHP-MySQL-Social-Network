<?php
class Result
{

    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_results";

    // object properties
    public $id;
    public $user_name;
    public $user_id;
    public $date;
    public $estimated_time;
    public $object;
    public $result;

    // constructor with $db as database connection
    public function __construct($db)
    {
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

    function init()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . "
               SET 
               `test_id`=:test_id, 
               `user_name`=:user_name, 
               user_id=:user_id, 
               date=:date, 
               estimated_time=:estimated_time";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->test_id = htmlspecialchars(strip_tags($this->test_id));
        $this->user_name = htmlspecialchars(strip_tags($this->user_name));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->estimated_time = htmlspecialchars(strip_tags($this->estimated_time));

        // bind values
        $stmt->bindParam(":test_id", $this->test_id);
        $stmt->bindParam(":user_name", $this->user_name);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":estimated_time", $this->estimated_time);

        // execute query
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function update()
    {
        $prev_result = Q("SELECT `result` FROM `#_mdd_results` WHERE `test_id` = ?s", array($this->test_id))->row('result');
        $prev_result = floatval($prev_result);
        $new_result = $prev_result + $this->result;

        $prev_object = Q("SELECT `object` FROM `#_mdd_results` WHERE `test_id` = ?s", array($this->test_id))->row('object');

        if (empty($prev_object)) {
            $this->object = array();      
        } else {
            $this->object = json_decode($prev_object);
        }

        $question_data = Q("SELECT `answers`, `variants`, `question`, `id` FROM  `#_mdd_questions` WHERE `id` = ?s", array($this->question_id))->row();
        
        $question_result = array(
            'answered'  => $this->variants,
            'result'    => $this->result,
            'question_data' => json_encode($question_data)
        );

        array_push($this->object, $question_result);
        $this->object = json_encode($this->object);

        $query = "UPDATE " . $this->table_name . "
        SET
            object = :object,
            result = :result,
            estimated_time = :estimated_time
        WHERE
            `test_id` = :test_id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->test_id = htmlspecialchars(strip_tags($this->test_id));
        $this->result = htmlspecialchars(strip_tags($new_result));
        $this->estimated_time = htmlspecialchars(strip_tags($this->estimated_time));

        // bind new values
        $stmt->bindParam(':test_id', $this->test_id);
        $stmt->bindParam(':result', $new_result);
        $stmt->bindParam(':object', $this->object);
        $stmt->bindParam(':estimated_time', $this->estimated_time);

        if ($stmt->execute()) return true;
        return false;
    }

    function getResults()
    {
        $result = Q("SELECT `date`, `not_answered`, `user_name`, `estimated_time`, `object` FROM `#_mdd_results` WHERE `test_id` = ?s", array($this->test_id))->row();
        $coefficient = Q("SELECT `result` FROM `#_mdd_tests` WHERE `id` = ?s", array($this->test_id))->row('result');
        $result['result'] = $coefficient;

        $result['not_answered'] = json_decode($result['not_answered']);

        if (count($result['not_answered'] > 0)) {
            $not_answered = array();
            foreach($result['not_answered'] as $item) {
                $question = Q("SELECT `question` FROM `#_mdd_questions` WHERE `id` = ?s", array($item))->row('question');
                array_push($not_answered, $question);
            }
            $result['not_answered'] = json_encode($not_answered);
        }
        
        return $result;
    }
}
