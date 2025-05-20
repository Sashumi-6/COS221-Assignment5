<?php
    include('Config.php');

    // requests made to the api must be in JSON and made with POST
    $req = json_decode(file_get_contents("php://input"), true);
    $dbConn = new Database();
    $status = false;
    $message = null;
    if(json_last_error() !== JSON_ERROR_NONE){
        $GLOBALS['code'] = 400;
        $status = false;
        $message = 'Please check that body is valid JSON';
    }

    // function that sets http status code, and sends response
    function respond($status, $message, $code){
        $strHeader = '';
        switch ($code) {
            case 200:
                $strHeader = "{$code} OK";
                break;
            case 401:
                $strHeader = "{$code} Unauthorized";
                break;
            case 400:
                $strHeader = "{$code} Bad Request";
                break;
            case 500:
                $strHeader = "{$code} Internal Server Error";
                break;
            default:
                $strHeader = "500 Internal Server Error";
                break;
        }
        
        $response = [
            "status" => ($status) ? "success" : "error",
            "timestamp" => time(),
            "data" => $message
        ];
    
        header("HTTP/1.1 {$strHeader}");
        echo json_encode($response);
    }

    /*
        helper function for validateInput(). 
        It checks that an email is in valid format
    */ 
    function checkEmail($email){
        $eRegex = "/^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/";
        return preg_match($eRegex, $email) ? $email : null;
    }

    /*
        helper function for validateInput(). 
        It checks that a password contains at least 1:
        Capitals, lowercases, number and symbol 
        and is greater than 8 in length
    */ 
    function checkPW($password){
        $pRegex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{9,}$/";
        return preg_match($pRegex, $password) ? $password : null;
    }

    // generates random strings of size 'length'
    function genRandStr($length){
        $bytes = ceil($length/2);
        $hex = bin2hex(random_bytes($bytes));
        return substr($hex, 0, $length);
    }
    
    /*
        for sign up and login, it ensures that user input is valid.
        for login, it only checks password and email...
    */ 
    function validateInput($input){
        $toReturn = ['valid' => true];
        if($input['type'] === 'Register'){

            $nsRegex = "/^[a-zA-Z0-9]{2,}/";
            $toReturn['name'] = (preg_match($nsRegex , $input["name"])) ? $input["name"] 
            : null;
            $toReturn['surname'] = (preg_match($nsRegex , $input["surname"])) ? $input["surname"] 
            : null;
            
            $toReturn['password'] = filter_var($input['password'], FILTER_CALLBACK, 
                                    ['options'=>'checkPW']);

            $toReturn['email'] = filter_var($input['email'], FILTER_CALLBACK,
            ['options'=>'checkEmail']);

            $invalid = empty($toReturn['name']) || empty($toReturn['surname'])
                        || empty($toReturn['email']) || empty($toReturn['password']);
            
            if($invalid) $toReturn['valid'] = false;
        }
        else if($input['type'] === 'Login'){
            $toReturn['password'] = filter_var($input['password'], FILTER_CALLBACK, 
                                    ['options'=>'checkPW']);

            $toReturn['email'] = filter_var($input['email'], FILTER_CALLBACK,
            ['options'=>'checkEmail']);

            $invalid = empty($toReturn['email']) || empty($toReturn['password']);
            
            if($invalid) $toReturn['valid'] = false;
        }
        
        return $toReturn;
    }

    /*
     * function to check that the email does not on database
     * OR
     * validate user on login
     */
    function validateUser($stmt, $email, $password=''){
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if(empty($password)){ // register check
            // should return empty set if email does not exist 
            return $result->num_rows === 0;
        }
        else if(isset($password)){ // login validation

            if($result->num_rows > 0){
                $row = $result->fetch_assoc();
                $passHash = $row['password']; // hash
                $salted_input = $password . $row['pass_salt']; // input+salt
                // true if the hashes match
                return password_verify($salted_input, $passHash);
            }
            else return false; // email does not exist...
        }
        
    }
    
    /*
        adds new user to the database
    */ 
    function addUser($stmt, $name, $surname, $username,$email, $passHash, $type ,$api_key, $salt){
        
        $typeIndex = ($type == 'Customer') ? 1 : 2;
        $stmt->bind_param('sssssiss', $name, $surname, $username,$email, $passHash, $typeIndex ,$api_key, $salt);
        $stmt->execute();
        $success = $stmt->affected_rows === 1;

        return $success;
    }

    /*
     * Gets user information via their email
     */
    function getUser($stmt, $email){
        $stmt->bind_param('s',$email);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    // register end point
    if($input['type'] === 'Register'){
        $validInput = validateInput($input);
    
        if($validInput['valid']){
            try{
                $email = $validInput['email'];
                $stmt = $dbConn->prepare('SELECT password, pass_salt FROM u24676412_users WHERE email=?');
                // check if email exists
                if(validateUser($stmt,$email, '')){
                    $status = true;
                    $name = $validInput['name'];
                    $surname = $validInput['surname'];
                    $password = $validInput['password'];
                    $username = $validInput['username'];
                    $salt =  genRandStr(16);
                    $passHash = password_hash(($password . $salt), PASSWORD_ARGON2ID);
                    $apiKey = genRandStr(14);

                    $stmt = $dbConn->prepare('INSERT INTO u24676412_users (name, surname, username, email, password, type, api_key, pass_salt)
                    values (?,?,?,?,?,?,?,?)');
                    $added = addUser($stmt, $name, $surname, $username ,$email, $passHash, 
                                            $input['user_type'], $apiKey, $salt);
                    if($added){
                        $GLOBALS['code'] = 200;
                        $status = true;
                        // ['apikey' => $apiKey]
                        $message = "Successfully Registered";
                    }
                }
                else{
                    $GLOBALS['code'] = 401;
                    $status = false;
                    $message = 'User/Email already exists';
                }
                
            }catch(Exception $e){
                $GLOBALS['code'] = 500;
                $status = false;
                $message = $e->getMessage();
            }
        }
        else{
            $GLOBALS['code'] = 400;
            $status = false;
            $messagebuild = [];
            
            if(empty($validInput['name'])) array_push($messagebuild,'Name');
            if(empty($validInput['surname'])) array_push($messagebuild,'Surame');
            if(empty($validInput['email'])) array_push($messagebuild,'Email');
            if(empty($validInput['password'])) array_push($messagebuild,'Password');

            $message = implode(', ', $messagebuild) . ((count($messagebuild) > 1)? ' fields are' : ' field is') . ' invalid';
        }

        
    }
    // login end point
    else if($input['type'] === 'Login'){
        $pInput = validateInput($input);
        if($pInput['valid']){
            $query = "SELECT password, pass_salt FROM u24676412_users WHERE email=?";
            $stmt = $dbConn->prepare($query);

            if(validateUser($stmt, $input['email'], $input['password'])){

                $query = "SELECT * FROM u24676412_users WHERE email=?";
                $stmt = $dbConn->prepare($query);
                $user = getUser($stmt, $input['email']);

                $status = true;
                $message = [['apikey' => $user['api_key']]];
                $_SESSION['loggedIn'] = true;
                $_SESSION['username'] = $user['username'];
                $GLOBALS['code'] = 200;
            }
            else{
                $GLOBALS['code'] = 401;
                $status = false;
                $message = 'Incorrect email or password';
            }
        }
        else{
            $GLOBALS['code'] = 401;
            $status = false;
            $message = 'Contains invalid strings';
        }
    }
    else{
        if(empty($GLOBALS['code'])) $GLOBALS['code'] = 400;
        $status = false;
        $message = "Please specify type or check request body for mistakes";
    }

    respond($status, $message, $GLOBALS['code']);
    

?>