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
     * Used to validate apikeys of logged in users
     */

    public function checkApiKey($apikey){
        $query = "SELECT 1 FROM users WHERE api_key=?";
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

    /**
     * retrieves available categories (name, id [for now])
     */
    public function getCategories(){

    }

    /**
     * retrieves available categories (name, id [for now])
     */
    public function deleteCategory(){
        
    }

    /**
     * retrieves available categories (name, id [for now])
     */
    public function addCategory(){
        
    }

    /**
     * retrieves available categories (name, id [for now])
     */
    public function updateCategory(){
        
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