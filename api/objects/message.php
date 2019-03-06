<?php
class Message{
 
    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_messages";
 
    // object properties
    public $id;
    public $user;
    public $date;
    public $body;
    public $time;
    public $readed;
    public $edited;
    public $chat;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read()
    {
        $id = $this->id;
        $query = "SELECT * FROM  " . $this->table_name . " WHERE `users` LIKE '%$id%'";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function readByChat()
    {
        $chat_id = $this->chat;
        $query = "SELECT * FROM  " . $this->table_name . " WHERE `chat` = '$chat_id' ORDER BY `id` ASC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function sendMessage()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . "
           SET chat=:chat, date=:date, time=:time, user=:user, body=:body, readed=:readed, edited=:edited";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->chat = htmlspecialchars(strip_tags($this->chat));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->user = htmlspecialchars(strip_tags($this->user));
        $this->body = htmlspecialchars(strip_tags($this->body));
        $this->readed = htmlspecialchars(strip_tags($this->readed));
        $this->edited = htmlspecialchars(strip_tags($this->edited));

        // bind values
        $stmt->bindParam(":chat", $this->chat);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":user", $this->user);
        $stmt->bindParam(":body", $this->body);
        $stmt->bindParam(":readed", $this->readed);
        $stmt->bindParam(":edited", $this->edited);

        // execute query
        if ($stmt->execute()) {

            $message_id = Q("SELECT `id` FROM `#_mdd_messages` ORDER BY `id` DESC LIMIT 1")->row('id');
            $chat_id = $this->chat;

            $query = "UPDATE db_mdd_chats SET last_msg = :last_msg WHERE id = :chat_id";

            // prepare query statement
            $stmt = $this->conn->prepare($query);
            
            // bind new values
            $stmt->bindParam(':last_msg', $message_id );
            $stmt->bindParam(':chat_id', $chat_id );
            $stmt->execute();

            return true;
        }
        return false;
    }
}