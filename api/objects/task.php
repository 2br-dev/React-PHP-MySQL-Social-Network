<?php
class Task
{

    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_tasks";

    // object properties
    public $id;
    public $from;
    public $date;
    public $for;
    public $time;
    public $until_date;
    public $until_time;
    public $text;
    public $importance;
    public $status;
    public $done_date;
    public $done_time;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function addTask()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . "
           SET `for`=:for, `from`=:from, date=:date, time=:time, until_date=:until_date, text=:text, until_time=:until_time, importance=:importance, status=:status";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->for = htmlspecialchars(strip_tags($this->for));
        $this->from = htmlspecialchars(strip_tags($this->from));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->until_date = htmlspecialchars(strip_tags($this->until_date));
        $this->text = htmlspecialchars(strip_tags($this->text));
        $this->until_time = htmlspecialchars(strip_tags($this->until_time));
        $this->importance = htmlspecialchars(strip_tags($this->importance));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // bind values
        $stmt->bindParam(":for", $this->for);
        $stmt->bindParam(":from", $this->from);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":until_date", $this->until_date);
        $stmt->bindParam(":text", $this->text);
        $stmt->bindParam(":until_time", $this->until_time);
        $stmt->bindParam(":importance", $this->importance);
        $stmt->bindParam(":status", $this->status);

        // execute query
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function read()
    {
        $id = 'for' . $this->id;
        $query = "SELECT * FROM `db_mdd_tasks` WHERE `for` LIKE '%$id%' ORDER BY `id` ASC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function complete()
    {
        // update query
        $query = "UPDATE " . $this->table_name . "
                SET
                    done_time = :done_time,
                    done_date = :done_date,
                    status = :status
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->done_time = htmlspecialchars(strip_tags($this->done_time));
        $this->done_date = htmlspecialchars(strip_tags($this->done_date));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':done_time', $this->done_time);
        $stmt->bindParam(':done_date', $this->done_date);
        $stmt->bindParam(':status', $this->status);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);
        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        // bind id of record to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
