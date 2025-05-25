<?php
class Database {
    private $host = 'wheatley.cs.up.ac.za';
    private $username = 'u24658198';
    private $password = 'CHPVX4DFIS3NYQX3S2FWYONZNWG7YUMS';
    private $database = 'u24658198_';
    private $conn;

    public static function connect(){
        static $obj = null;
        
        if($obj === null) $obj = new Database();
        // if($obj === null) $obj = new DBConnector(); // comment out during submission
        return $obj;
    }

    private function __construct() {
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->database);
        
        if ($this->conn->connect_error) {
            error_log("Database connection failed: " . $this->conn->connect_error);
            throw new Exception("Database connection failed");
        }
        
        $this->conn->set_charset("utf8mb4");
    }
    
    public function prepare($sql) {
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            error_log("Prepare error: " . $this->conn->error);
            // throw new Exception("Database query preparation failed");
        }
        return $stmt;
    }

    /*
        adds new user to the database
    */ 
    public function addUser($username, $full_name, $email, $passHash, $salt ,$api_key, $type){
        $sqlQuery = $this->prepare("INSERT INTO users (username, full_name, email, password, salt, apikey, user_type)
        values (?,?,?,?,?,?,?)");

        $typeIndex = ($type == 'Customer') ? 1 : (($type == 'Business') ? 2 : 3);
        $sqlQuery->bind_param('ssssssi', $username, $full_name, $email, $passHash, $salt ,$api_key, $typeIndex);
        
        if($sqlQuery->execute()){
            return $sqlQuery->affected_rows === 1;
        }
        else{
            throw new Exception("Could not add user to the database");
        }
        
    }

    /*
     * function to check that the email does not on database
     * OR
     * validate user on login
     * How to use:
     * For login : pass in username value, null for email and password value.
     * For register : pass in username value and email value. Omit password or pass
     *                  null.
     */
    public function validateUser($username, $email=null,$password=null) {
        $query = "SELECT password, salt FROM users WHERE username=?";
        if(!empty($email)) $query .= " AND email=?";
        
        $sqlQuery = $this->prepare($query);

        if(isset($email)) $sqlQuery->bind_param('ss', $email, $username);
        else $sqlQuery->bind_param('s', $username);

        $sqlQuery->execute();

        $result = $sqlQuery->get_result();

        if(empty($password)){ // register check
            // should return empty set if email does not exist 
            $success = $result->num_rows === 0;
        }
        else if(isset($password)){ // login validation

            if($result->num_rows > 0){
                $row = $result->fetch_assoc();
                $passHash = $row['password']; // hash
                $salted_input = $password . $row['salt']; // input+salt
                // true if the hashes match
                $success = password_verify($salted_input, $passHash);
            }
            else $success = false;
        }
        
        return $success;
    }

    /*
    * Gets user information via their email, this is just to make api
    * coding easier lowkey
    */
    public function getUser($username){
        $query = "SELECT * FROM users WHERE username=?";
        $sqlQuery = $this->prepare($query);
        $sqlQuery->bind_param('s', $username);
        $sqlQuery->execute();
        $result = $sqlQuery->get_result();
        

        return $result->fetch_assoc();
    }

    /*
    * Gets user information via their apikey, this is just to make api
    * coding easier lowkey as well
    */
    public function getUserWithApikey($apikey){
        $query = "SELECT * FROM u24676412_users WHERE api_key='{$apikey}'";
        $result = $this->conn->query($query);
        
        return $result->fetch_assoc();
    }

    /*
     * Used to validate apikeys of logged in users
     */

    public function checkApiKey($apikey){
        $query = "SELECT 1 FROM users WHERE apikey=?";
        $sqlQuery = $this->prepare($query);
        $sqlQuery->bind_param('s', $apikey);
        $sqlQuery->execute();
        $result = $sqlQuery->get_result();
        

        return ($result->num_rows === 1);
    }

    /**
     * Function to return get products
     * 
     */

    public function getAllProducts(){
        $query = "SELECT * FROM products";
        $sqlQuery = $this->prepare($query);
        $sqlQuery->execute();
        $result = $sqlQuery->get_result();
        
        return $result->fetch_all(MYSQLI_ASSOC);
    }


    /**
     * retrieves available categories (name, id [for now])
     */
    public function getCategories(){
        $query = "SELECT category_id, category_name FROM categories";
        $stmt = $this->prepare($query);
        
        if($stmt->execute()){
            $result = $stmt->get_result();
            return $result->fetch_all(MYSQLI_ASSOC);
        }
        else{
            throw new Exception("Couldn't retrieve data from database.");
        }

    }

    /**
     * removes category by id
     */
    public function deleteCategory($id){
        
    }

    /**
     * add a new product
     */
    public function addCategory($name, $parentID=null){
        
    }

    /**
     * update category, essentially just the name hey...
     */
    public function updateCategory($newVal, $id){
        
    }
    
    public function close() {
        $this->conn->close();
    }
    
    // Add this method to access connection errors
    public function error() {
        return $this->conn->error;
    }
}

?>