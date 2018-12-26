<?php
   
include_once '../../define.php';

class Database{

    private $host     = DB_HOST;
    private $db_name  = DB_BASE;
    private $username = DB_USER;
    private $password = DB_PASS;
    
    public $conn;
    // get the database connection
    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}
?>