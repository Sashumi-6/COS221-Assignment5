<?php
class Database {
    private $host = 'localhost';
    private $username = '';
    private $password = '';
    private $database = '';
    public $conn;

    public function __construct() {
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
    
    public function close() {
        $this->conn->close();
    }
    
    // Add this method to access connection errors
    public function error() {
        return $this->conn->error;
    }
}
?>