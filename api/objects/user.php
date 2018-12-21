<?php
class User{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_users";
 
    // object properties
    public $id;
    public $username;
    public $login;
    public $password;
    public $email;
    public $admin;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT * FROM `db_mdd_users`";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }
        // create product
    function create(){
    
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                username=:username, login=:login, email=:email, password=:password";
    
        // prepare query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->username=htmlspecialchars(strip_tags($this->username));
        $this->login=htmlspecialchars(strip_tags($this->login));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->password=htmlspecialchars(strip_tags($this->password));
    
        // bind values
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":login", $this->login);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
    
        // execute query
        if($stmt->execute()){
            return true;
        }
    
        return false;
        
    }
    function readOne(){
 
        // query to read single record
        $query = "SELECT * FROM " . $this->table_name . "  WHERE `id` = ? LIMIT 0,1";
     
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
     
        // bind id of product to be updated
        $stmt->bindParam(1, $this->id);
     
        // execute query
        $stmt->execute();
     
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        $this->username = $row['username'];
        $this->login    = $row['login'];
        $this->email    = $row['email'];
        $this->password = $row['password'];
        $this->admin    = $row['admin'];
    }
    // update the product
    function update(){
    
        // update query
        $query = "UPDATE " . $this->table_name . "
                SET
                    username = :username,
                    login = :login,
                    password = :password,
                    email = :email
                WHERE
                    id = :id";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->username));
        $this->price=htmlspecialchars(strip_tags($this->login));
        $this->description=htmlspecialchars(strip_tags($this->password));
        $this->category_id=htmlspecialchars(strip_tags($this->email));
        $this->id=htmlspecialchars(strip_tags($this->id));
    
        // bind new values
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':login', $this->login);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':id', $this->id);
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }
    function delete(){
 
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
    function search($keywords){
 
        // select all query
        $query = "SELECT * FROM
                    " . $this->table_name . " 
                WHERE
                    username LIKE ? OR login LIKE ? OR email LIKE ?";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
     
        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }
    // read products with pagination
    public function readPaging($from_record_num, $records_per_page){
 
    // select query
    $query = "SELECT * " . $this->table_name . " LIMIT ?, ?";
 
    // prepare query statement
    $stmt = $this->conn->prepare( $query );
 
    // bind variable values
    $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
    $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);
 
    // execute query
    $stmt->execute();
 
    // return values from database
    return $stmt;
    }
    // used for paging products
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";
    
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        return $row['total_rows'];
    }    
}