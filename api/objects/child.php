<?php
class Child{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_childrens";
 
    // object properties
    public $id;
    public $child_name;
    public $child_birthyear;
    public $child_parent;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function deleteChild(){
      // delete query
      $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
     
      // prepare query
      $stmt = $this->conn->prepare($query);
     
      // sanitize
      $this->id=htmlspecialchars(strip_tags($this->id));
     
      // bind id of record to delete
      $stmt->bindParam(1, $this->id);
     
      // execute query
      if($stmt->execute()){
        return true;
      }
     
      return false;
    }

    function addChild(){
      // query to insert record
      $query = "INSERT INTO " . $this->table_name . "
         SET child_parent=:parent, child_name=:name, child_birthyear=:year";

      // prepare query
      $stmt = $this->conn->prepare($query);

      // sanitize
      $this->parent=htmlspecialchars(strip_tags($this->parent));
      $this->name=htmlspecialchars(strip_tags($this->name));
      $this->year=htmlspecialchars(strip_tags($this->year));

      // bind values
      $stmt->bindParam(":parent", $this->parent);
      $stmt->bindParam(":name", $this->name);
      $stmt->bindParam(":year", $this->year);

      // execute query
      if($stmt->execute()){
          return true;
      }

      return false;
      
    }

}