<?php
class Category{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_users";
 
    // object properties
    public $id;
    public $username;
    public $login;
    public $email;
 
    public function __construct($db){
        $this->conn = $db;
    }
 
    // used by select drop-down list
    public function readAll(){
        //select all data
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY username";
 
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
 
        return $stmt;
    }
    // used by select drop-down list
    public function read(){
    
      //select all data
      $query = "SELECT * FROM " . $this->table_name . " ORDER BY username";

      $stmt = $this->conn->prepare( $query );
      $stmt->execute();

      return $stmt;
    }
}
?>