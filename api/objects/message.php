<?php
class Message
{

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
    public $created_at;

    // constructor with $db as database connection
    public function __construct($db)
    {
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

    function edit()
    {
        $query = "UPDATE " . $this->table_name . "
        SET
            body = :body, edited = :edited
        WHERE
            id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->body = htmlspecialchars(strip_tags($this->body));
        $this->edited = htmlspecialchars(strip_tags($this->edited));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':body', $this->body);
        $stmt->bindParam(':edited', $this->edited);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }
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
           SET chat=:chat, date=:date, time=:time, user=:user, body=:body, readed=:readed, edited=:edited, created_at=:created_at";

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
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        
        // bind values
        $stmt->bindParam(":chat", $this->chat);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":user", $this->user);
        $stmt->bindParam(":body", $this->body);
        $stmt->bindParam(":readed", $this->readed);
        $stmt->bindParam(":edited", $this->edited);
        $stmt->bindParam(":created_at", $this->created_at);

        // execute query
        if ($stmt->execute()) {

            $message_id = Q("SELECT `id` FROM `#_mdd_messages` ORDER BY `id` DESC LIMIT 1")->row('id');
            $chat_id = $this->chat;

            $query = "UPDATE db_mdd_chats SET last_msg = :last_msg WHERE id = :chat_id";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // bind new values
            $stmt->bindParam(':last_msg', $message_id);
            $stmt->bindParam(':chat_id', $chat_id);
            $stmt->execute();

            return true;
        }
        return false;
    }

    function delete()
    {
        // получаем id чата из этого сообщения
        $chat_id = Q("SELECT `chat` FROM `#_mdd_messages` WHERE `id` = ?s", array($this->id))->row('chat');

        // получаем последнее сообщение в чате
        $last_msg = Q("SELECT `last_msg` FROM `#_mdd_chats` WHERE `id` = ?s", array($chat_id))->row('last_msg');

        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);
        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        // bind id of record to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {

            // получаем последнее сообщение в этом чате
            $message_id = Q("SELECT `id` FROM `#_mdd_messages` WHERE `id` = ?s ORDER BY `id` DESC LIMIT 1", array($this->id))->row('id');

            if ($message_id == $last_msg && $last_msg != null && $message_id != null) {
                return true;
            } else {

                if ($message_id == null || $message_id == '') {

                    $query1 = "DELETE FROM `db_mdd_chats` WHERE `id` = ?";
                    // prepare query
                    $stmt1 = $this->conn->prepare($query1);
                    // sanitize
                    $chat_id = htmlspecialchars(strip_tags($chat_id));
                    // bind id of record to delete
                    $stmt1->bindParam(1, $chat_id);
                    $stmt1->execute();

                    /*    $query2 = "DELETE FROM " . $this->table_name . " WHERE `chat` = ?";
                    $stmt2 = $this->conn->prepare($query2);
                    // sanitize
                    $chat_id = htmlspecialchars(strip_tags($chat_id));
                    // bind id of record to delete
                    $stmt2->bindParam(1, $chat_id); */

                    return true;
                }

                $query = "UPDATE db_mdd_chats SET last_msg = :last_msg WHERE id = :chat_id";

                // prepare query statement
                $stmt = $this->conn->prepare($query);

                // bind new values

                $stmt->bindParam(':last_msg', $message_id);
                $stmt->bindParam(':chat_id', $chat_id);
                $stmt->execute();
                return true;
            }
        }

        return false;
    }
}

