<?php
class News
{

    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_news";

    // object properties
    public $id;
    public $author;
    public $date;
    public $title;
    public $text;
    public $importance;
    public $likes;
    public $liked_by;
    public $author_id;
    public $created;
    public $created_at;
    public $who;
    public $news_id;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
    {
        $query = "SELECT * FROM `db_mdd_news` ORDER BY `id` DESC";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function readOne()
    {
        $query = "SELECT * FROM `db_mdd_news` WHERE id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);
        // execute query
        $stmt->execute();

        return $stmt;
    }

    function readComments()
    {
        $query = "SELECT * FROM `db_mdd_comments` ORDER BY `ord` DESC LIMIT 0,50 ";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function addLike()
    {

        // update query
        $query = "UPDATE " . $this->table_name . "
                SET
                    likes = :likes,
                    liked_by = :liked_by
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->likes = htmlspecialchars(strip_tags($this->likes));
        $this->liked_by = htmlspecialchars(strip_tags($this->liked_by));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':likes', $this->likes);
        $stmt->bindParam(':liked_by', $this->liked_by);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function removeLike($liked_by)
    {

        // update query
        $query = "UPDATE " . $this->table_name . "
                SET
                    likes = :likes,
                    liked_by = :liked_by
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->likes = htmlspecialchars(strip_tags($this->likes));
        $this->liked_by = htmlspecialchars(strip_tags($this->liked_by));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':likes', $this->likes);
        $stmt->bindParam(':liked_by', $this->liked_by);

        // execute the query
        if ($stmt->execute()) {
            $this->deleteLike($liked_by);
            return true;
        }

        return false;
    }

    function deleteLike($liked_by) {
        // delete query
        $query = "DELETE FROM db_mdd_likes WHERE `news_id` = ? AND `user` = ?";
        // prepare query
        $stmt = $this->conn->prepare($query);
        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $liked_by = htmlspecialchars(strip_tags($liked_by));

        // bind id of record to delete
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $liked_by);
        // execute query
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function submitNews()
    {

        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                author=:author, date=:date, text=:text, title=:title, created_at=:created_at, importance=:importance, author_id=:author_id";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->author_id = htmlspecialchars(strip_tags($this->author_id));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->text = htmlspecialchars(strip_tags($this->text));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->importance = htmlspecialchars(strip_tags($this->importance));

        // bind values
        $stmt->bindParam(":author", $this->author);
        $stmt->bindParam(":author_id", $this->author_id);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":text", $this->text);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":importance", $this->importance);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function delete()
    {
        // delete query
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

    function countComments()
    {
        $current_count = Q("SELECT `comments` from `#_mdd_news` WHERE `id` = ?s", array($this->news_id))->row('comments');
        $current_count -= 1;
        
        $query = "UPDATE " . $this->table_name . "
        SET
            comments = :comments
        WHERE
            id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->news_id = htmlspecialchars(strip_tags($this->news_id));

        // bind new values
        $stmt->bindParam(':comments', $current_count);
        $stmt->bindParam(':id', $this->news_id);


        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function deleteComment()
    {
        $query = "DELETE FROM `db_mdd_comments` WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    function deleteComments()
    {
        // delete query
        $query = "DELETE FROM `db_mdd_comments` WHERE news_id = ?";
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

    function deleteLikes()
    {
        // delete query
        $query = "DELETE FROM `db_mdd_likes` WHERE news_id = ?";
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

    // update the news
    function edit()
    {
        $query = "UPDATE " . $this->table_name . "
                SET
                    title = :title,
                    text = :text
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->text = htmlspecialchars(strip_tags($this->text));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':text', $this->text);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}

