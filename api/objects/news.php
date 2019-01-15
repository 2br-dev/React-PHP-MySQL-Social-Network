<?php
class News{
 
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
    public $created;
    public $author_id;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT * FROM `db_mdd_news` ORDER BY `id` DESC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }

    function readComments() {
        $query = "SELECT * FROM `db_mdd_comments` ORDER BY `ord` DESC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }

    function addLike() {
            
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
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->likes=htmlspecialchars(strip_tags($this->likes));
        $this->liked_by=htmlspecialchars(strip_tags($this->liked_by));
        
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':likes', $this->likes);
        $stmt->bindParam(':liked_by', $this->liked_by);
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }

    function removeLike() {
            
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
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->likes=htmlspecialchars(strip_tags($this->likes));
        $this->liked_by=htmlspecialchars(strip_tags($this->liked_by));
        
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':likes', $this->likes);
        $stmt->bindParam(':liked_by', $this->liked_by);
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }

    function submitNews(){
    
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                author=:author, date=:date, text=:text, title=:title, created=:created, importance=:importance, author_id=:author_id";
    
        // prepare query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->author=htmlspecialchars(strip_tags($this->author));
        $this->author_id=htmlspecialchars(strip_tags($this->author_id));
        $this->date=htmlspecialchars(strip_tags($this->date));
        $this->text=htmlspecialchars(strip_tags($this->text));
        $this->title=htmlspecialchars(strip_tags($this->title));
        $this->created=htmlspecialchars(strip_tags($this->created));
        $this->importance=htmlspecialchars(strip_tags($this->importance));
    
        // bind values
        $stmt->bindParam(":author", $this->author);
        $stmt->bindParam(":author_id", $this->author_id);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":text", $this->text);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":created", $this->created);
        $stmt->bindParam(":importance", $this->importance);
    
        // execute query
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

    // update the news
    function edit(){
        $query = "UPDATE " . $this->table_name . "
                SET
                    title = :title,
                    text = :text
                WHERE
                    id = :id";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
        
        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->title=htmlspecialchars(strip_tags($this->title));
        $this->text=htmlspecialchars(strip_tags($this->text));
        
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':text', $this->text);
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }    
}