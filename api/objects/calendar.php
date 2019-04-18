<?php
class Calendar{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_calendar";
 
    // object properties
    public $id;
    public $max;
    public $title;
    public $startDate;
    public $endDate;
    public $creator;
    public $signed;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read()
    {
        $data = Q("SELECT 
                    creator, 
                    signed, 
                    C.id, 
                    U.name, 
                    U.surname, 
                    U.position,
                    startDate, 
                    endDate,
                    max,
                    title
                  FROM db_mdd_calendar C 
                  LEFT JOIN db_mdd_users U
                  ON C.creator = U.id")->all();
        return $data;
    }
}