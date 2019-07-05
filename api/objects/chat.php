<?php
class Chat{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_chats";
 
    // object properties
    public $id;
    public $last_message;
    public $users;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read()
    {
        $id = $this->users;
        $query = "SELECT * FROM  " . $this->table_name . " WHERE `users` LIKE '%{$id}%'";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function addChat()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . "
           SET users=:users, last_msg=:last_msg";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->users = htmlspecialchars(strip_tags($this->users));
        $this->last_msg = htmlspecialchars(strip_tags($this->last_msg));

        // bind values
        $stmt->bindParam(":users", $this->users);
        $stmt->bindParam(":last_msg", $this->last_msg);  

        // execute query
        if ($stmt->execute()) {
            $chat_id = Q("SELECT `id` FROM `#_mdd_chats` ORDER BY `id` DESC LIMIT 1")->row('id');
            echo json_encode(array("message" => "Chat was created.", "chat_id" => $chat_id));
            return true;
        }
        return false;
    }
}