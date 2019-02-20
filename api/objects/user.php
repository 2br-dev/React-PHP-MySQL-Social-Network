<?php
include_once '../../define.php';
include_once '../config/database.php';

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
    public $position;
    public $name;
    public $surname;
    public $background;
    public $phone;
    public $birthday;
    public $status;
    public $city;
    public $district;
    public $adress;
    public $fakultet;
    public $vuz;
    public $army_country;
    public $army_type;
    public $avatar;
    public $approved;
    public $code;
 
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
        $this->login        = $row['login'];
        $this->position     = $row['position'];
        $this->avatar       = $row['avatar'];
        $this->background   = $row['background'];
        $this->id           = $row['id']; 
        $this->name         = $row['name']; 
        $this->surname      = $row['surname']; 
        $this->liked        = $row['liked'];
    }
    function readPersonal(){
        // query to read single record
        /* $query = "SELECT *
            FROM db_mdd_users u
            LEFT JOIN db_mdd_childrens c
            ON u.id = c.child_parent
            WHERE u.id = ? LIMIT 0,50";  */

        $query = "SELECT * FROM " . $this->table_name . " WHERE `id` = ? LIMIT 0,1"; 
        $childs = Q("SELECT `child_name`, `child_birthyear`, `id` FROM `#_mdd_childrens` WHERE `child_parent` = ?i", array($this->id))->all();

        // prepare query statement
        $stmt = $this->conn->prepare( $query );
        // bind id of product to be updated
        $stmt->bindParam(1, $this->id);
        // execute query
        $stmt->execute();
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // set values to object properties
        $this->id           = $row['id'];
        $this->position     = $row['position'];
        $this->name         = $row['name'];
        $this->surname      = $row['surname'];
        $this->background   = $row['background'];
        $this->phone        = $row['phone']; 
        $this->birthday     = $row['birthday'];
        $this->status       = $row['status'];
        $this->city         = $row['city'];
        $this->district     = $row['district'];
        $this->adress       = $row['adress'];
        $this->fakultet     = $row['fakultet']; 
        $this->vuz          = $row['vuz'];
        $this->army_country = $row['army_country'];
        $this->avatar       = $row['avatar'];
        $this->army_type    = $row['army_type'];
        $this->sex          = $row['sex'];
        $this->childs       = json_encode( $childs, JSON_UNESCAPED_UNICODE );
    }
    // update the product
    function update(){
    
        // update query
        $query = "UPDATE " . $this->table_name . "
                SET
                    adress = :adress,
                    army_country = :army_country,
                    army_type = :army_type,
                    birthday = :birthday,
                    city = :city,
                    district = :district,
                    fakultet = :fakultet,
                    name = :name,
                    phone = :phone,
                    position = :position,
                    status = :status,
                    surname = :surname,
                    vuz = :vuz,
                    sex = :sex
                WHERE
                    id = :id";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
        
        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->adress=htmlspecialchars(strip_tags($this->adress));
        $this->army_country=htmlspecialchars(strip_tags($this->army_country));
        $this->army_type=htmlspecialchars(strip_tags($this->army_type));
        $this->birthday=htmlspecialchars(strip_tags($this->birthday));
        $this->district=htmlspecialchars(strip_tags($this->district));
        $this->fakultet=htmlspecialchars(strip_tags($this->fakultet));
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->position=htmlspecialchars(strip_tags($this->position));
        $this->status=htmlspecialchars(strip_tags($this->status));
        $this->surname=htmlspecialchars(strip_tags($this->surname));
        $this->vuz=htmlspecialchars(strip_tags($this->vuz));
        $this->city=htmlspecialchars(strip_tags($this->city));
        $this->sex=htmlspecialchars(strip_tags($this->sex));
        
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':adress', $this->adress);
        $stmt->bindParam(':army_country', $this->army_country);
        $stmt->bindParam(':army_type', $this->army_type);
        $stmt->bindParam(':birthday', $this->birthday);
        $stmt->bindParam(':district', $this->district);
        $stmt->bindParam(':fakultet', $this->fakultet);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':surname', $this->surname);
        $stmt->bindParam(':vuz', $this->vuz);
        $stmt->bindParam(':city', $this->city); 
        $stmt->bindParam(':sex', $this->sex);  
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }

    function settings() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    birthday = :birthday,
                    name = :name,
                    position = :position,
                    surname = :surname,
                    sex = :sex,
                    avatar = :avatar
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);
        
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->birthday=htmlspecialchars(strip_tags($this->birthday));
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->position=htmlspecialchars(strip_tags($this->position));
        $this->surname=htmlspecialchars(strip_tags($this->surname));
        $this->sex=htmlspecialchars(strip_tags($this->sex));
        $this->avatar=htmlspecialchars(strip_tags($this->avatar));
        
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':birthday', $this->birthday);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':surname', $this->surname);
        $stmt->bindParam(':sex', $this->sex);  
        $stmt->bindParam(':avatar', $this->avatar);  
    
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

    public function forget(){

        $domen = str_replace([ 'http://', 'www.', 'www' ], '', $_SERVER['SERVER_NAME']);
        $subject = "Восстановление пароля, на сайте " . $domen;


        $body  = '<h2 style="color:#000000; margin: 0;">Здравствуйте,</h2>';
        $body .= '<p style="color: #444444; font-size: 14px;">Вы получили это письмо, потому что было запрошено восстановление пароля для этого аккаунта.</p>';
        $body .= '<a href="http://akvatory.local/login/restore?auth='.$user->code.'">восстановить пароль можете по ссылке</a>';
        $body .= '<p style="color: #444444; font-size: 14px;">Если вы не запрашивали восстановление, то просто проигнорируйте это письмо.</p>';
        $body .= '<p style="color: #444444; font-size: 14px;">С уважением, <i>Искусственный Интеллект.</i></p>'; 
    
        // Create the Transport
        $transport = (new \Swift_SmtpTransport('smtp.mail.ru', 465, 'ssl'))
         ->setUsername('prog@2-br.ru')
         ->setPassword('123123prog');
    
        // Create the Mailer using your created Transport
        $mailer = new \Swift_Mailer($transport);
         // Create a message
        $message = (new \Swift_Message($subject))
         ->setFrom(['prog@2-br.ru' => 'akvatory-robot'])
         ->setTo('alekyansn@gmail.com')
         ->setBody($body, 'text/html');
        
        if ($mailer->send($message)) {
            echo json_encode( array( 'send' => 1, 'result' => 1 ), 64 | 256 );
        } else {
            echo json_encode( array( 'send' => 0, 'result' => 0 ), 64 | 256 );
        } 
    }

    public function approve_user(){
        $query = "UPDATE " . $this->table_name . "
        SET `approved` = :approved WHERE `id` = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->approved=htmlspecialchars(strip_tags($this->approved));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':approved', $this->approved);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }
    public function restore(){
        $query = "UPDATE " . $this->table_name . "
        SET `password` = :password WHERE `code` = :code";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->approved=htmlspecialchars(strip_tags($this->approved));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':approved', $this->approved);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }
}