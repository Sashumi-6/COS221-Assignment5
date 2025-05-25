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
        $query = "SELECT * FROM users WHERE apikey='{$apikey}'";
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

    public function getCategoryID($name){
        $query = "SELECT category_id FROM categories WHERE category_name=?";
        $stmt = $this->prepare($query);
        $stmt->bind_param('s', $name);
        
        if($stmt->execute()){
            $result = $stmt->get_result();
            return $result->fetch_assoc();
        }
        else{
            throw new Exception("Couldn't retrieve data from database.");
        }
    }

    /**
     * removes category by id
     */
    public function deleteCategory($id){
        $query = "DELETE FROM categories WHERE category_id=?";
        $stmt = $this->prepare($query);
        $stmt->bind_param('i', $id);

        if(!$stmt->execute()){
            throw new Exception("Couldn't remove category from database.");
        }
        
    }

    /**
     * add a new product
     */
    public function addCategory($name, $parentID=null){
        $query = "INSERT INTO categories (category_name" ;
        if(isset($parentID)) $query .= ", parent_category_id";
        $query .= ") values (?";
        if(isset($parentID)) $query .= ",?";
        $query .= ")";

        $stmt = $this->prepare($query);
        $types = 's';
        if(isset($parentID)) {
            $types .= 'i';
            $stmt->bind_param($types, $name, $parentID);
        }
        else $stmt->bind_param($types, $name);
        
        if(!$stmt->execute()){
            throw new Exception("Couldn't add category to the database.");
        }

        $newCat = $this->getCategoryID($name);
        return $newCat['category_id'];
    }

    /**
     * update category, essentially just the name hey...
     */
    public function updateCategory($newVal, $id){
        $query = "UPDATE categories SET category_name=? WHERE category_id=?";
        $stmt = $this->prepare($query);
        $stmt->bind_param('si', $newVal ,$id);

        if(!$stmt->execute()){
            throw new Exception("Couldn't remove category from database.");
        }
    }
    


   public function updateProduct($updateData) {
        // building the query
        $query = "UPDATE products SET ";
        $params = [];
        $types = '';
        $updates = [];

        // dynamic SET clauses with proper escaping
        foreach ($updateData as $field => $value) {
            if ($field !== 'upc' && $value !== null) {
                // Wrap field names in backticks to handle reserved keywords
                $escapedField = "`" . str_replace("`", "``", $field) . "`";
                $updates[] = "$escapedField = ?";
                $params[] = $value;
                
                //  type based on field
                if ($field === 'category_id' || $field === 'supplier_id') {
                    $types .= 'i'; // integer
                } else {
                    $types .= 's'; // string
                }
            }
        }

        // WHERE clause 
        $query .= implode(', ', $updates) . " WHERE `upc` = ?";
        $params[] = $updateData['upc'];
        $types .= 'i'; // upc is integer

        error_log("Update Query: " . $query); // debug logging
        error_log("Params: " . print_r($params, true)); // debug logging

        // Prepare and execute
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            error_log("Prepare error: " . $this->conn->error);
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        if (!$stmt->execute()) {
            error_log("Execute error: " . $stmt->error);
            throw new Exception("Execute failed: " . $stmt->error);
        }

        // Return true if any rows were affected
        return $stmt->affected_rows > 0;
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