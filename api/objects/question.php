<?php
class Question{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_questions";
 
    // object properties
    public $id;
    public $variants;
    public $question;
    public $category;
    public $subcategory;
 
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

    function getSingleQuestion()
    {
        $question = Q("SELECT `category`, `id`, `question`, `variants`, `subcategory`, `audio`, `image`, `answers` FROM `#_mdd_questions` WHERE `id` = ?s", array($this->id))->all();
        
        $answers = explode("\n", $question[0]['answers']);

        count($answers) > 1 ? $question[0]['answers'] = true : $question[0]['answers'] = false;


        if (!empty($question)){
            $qif = new \Files();     
            $question[0]['audio_file'] = $qif->getFilesByGroup($question[0]['audio'], array('original'), array('file', 'id'), false);
            $question[0]['image_file'] = $qif->getFilesByGroup($question[0]['image'], array('sm', 's', 'original'), array('file'), true);    
        }
        
        // execute query
        if (isset($question)) {
            $category = Q("SELECT `var` FROM `#__mdd_lists` WHERE `value` = ?s", array($question[0]['category']))->row('var');
            $question[0]['category'] = $category;
            return $question;
        }

        return false;
    }

    function getResult($id, $variants)
    {
        $all_answers = Q("SELECT `answers` FROM `#_mdd_questions` WHERE `id` = ?s", array($id))->row('answers');
        $answers = explode("\n", $all_answers);
        $incorrect = 0;

        if (count($answers) > count($variants)) {
            $incorrect += count($answers) - count($variants);
        }

        foreach($variants as $variant) {
            if (!in_array($variant, $answers)) $incorrect++;
        }    
        
        if ($incorrect == 0) {
            $result = 1;
        } elseif (($incorrect == 1 && count($answers) > 1) || ($incorrect == 2 && count($answers) > 3)) {
            $result = 0.5;
        } else {
            $result = 0;
        }

        return $result;
    }

}