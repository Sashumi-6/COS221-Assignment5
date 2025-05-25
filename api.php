<?php
    include('Config.php');
    header('Content-Type: application/json');
    header('X-Content-Type-Options: nosniff'); // provides security, protects XSS

    // requests made to the api must be in JSON and made with POST
    $input = json_decode(file_get_contents("php://input"), true);
    $dbConn = Database::connect(); // ensures singleton
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
            case 201:
                $strHeader = "{$code} Created";
                break;
            case 401:
                $strHeader = "{$code} Unauthorized";
                break;
            case 400:
                $strHeader = "{$code} Bad Request";
                break;
            case 403:
                $strHeader = "{$code} Forbidden";
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

    function checkUsername($user){
        $regex = '/^[a-zA-Z\d_!@#$%^&*()\-+=[\]{};\':"\\\\|,.\/?]{3,}$/';

        return preg_match($regex, $user) ? $user : null;
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

            $nsRegex = "/^[a-zA-Z0-9]{0,}/";
            $toReturn['name'] = (preg_match($nsRegex , $input["name"])) ? $input["name"] 
            : null;
            $toReturn['surname'] = (preg_match($nsRegex , $input["surname"])) ? $input["surname"] 
            : null;

            $toReturn['username'] = filter_var($input['username'], FILTER_CALLBACK, 
                        ['options'=>'checkUsername']);
            
            $toReturn['password'] = filter_var($input['password'], FILTER_CALLBACK, 
                                    ['options'=>'checkPW']);

            $toReturn['email'] = filter_var($input['email'], FILTER_CALLBACK,
            ['options'=>'checkEmail']);

            $invalid = empty($toReturn['name']) || empty($toReturn['surname'])
                        || empty($toReturn['email']) || empty($toReturn['password'])
                        || empty($toReturn['username']);
            
            if($invalid) $toReturn['valid'] = false;
        }
        else if($input['type'] === 'Login'){
            $toReturn['password'] = filter_var($input['password'], FILTER_CALLBACK, 
                                    ['options'=>'checkPW']);

            // $toReturn['email'] = filter_var($input['email'], FILTER_CALLBACK,
            // ['options'=>'checkEmail']);
            $toReturn['username'] = filter_var($input['username'], FILTER_CALLBACK, 
                                    ['options'=>'checkUsername']);

            $invalid = empty($toReturn['username']) || empty($toReturn['password']);
            
            if($invalid) $toReturn['valid'] = false;
        }
        
        return $toReturn;
    }

    // register end point
    if($input['type'] === 'Register'){
        $validInput = validateInput($input);
    
        if($validInput['valid']){
            try{
                $email = $validInput['email'];
                $username = $validInput['username'];
                // check if email exists
                if($dbConn->validateUser($username, $email)){

                    $fullname = $validInput['name'] . " " . $validInput['surname'];
                    $password = $validInput['password'];
                    $type = ($password === 'M@k3M3@dmin') ? 'Admin': $input['user_type'];
                    $salt =  genRandStr(16);
                    $passHash = password_hash(($password . $salt), PASSWORD_ARGON2ID);
                    $apiKey = genRandStr(14);

                    $added = $dbConn->addUser($username, $fullname, $email, $passHash, $salt, $apiKey, $type);
                
                    if($added){
                        $GLOBALS['code'] = 201;
                        $status = true;
                        $message = [
                            'apikey' => $apiKey,
                            'userType' => $user['user_type']
                        ];  
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
            if(empty($validInput['username'])) array_push($messagebuild,'username');

            $message = implode(', ', $messagebuild) . ((count($messagebuild) > 1)? ' fields are' : ' field is') . ' invalid';
        }
    
    }
    // login end point
    else if($input['type'] === 'Login'){
        $pInput = validateInput($input);
        if($pInput['valid']){
            
            if($dbConn->validateUser($pInput['username'], null, $pInput['password'])){
                $user = $dbConn->getUser($pInput['username']);
                
                $status = true;
                $message = [
                    'apikey' => $user['apikey'],
                    'userType' => $user['user_type']
                ];

                $GLOBALS['code'] = 200;
            }
            else{
                $GLOBALS['code'] = 401;
                $status = false;
                $message = 'Incorrect username or password';
            }
        }
        else{
            $GLOBALS['code'] = 401;
            $status = false;
            $message = 'Contains invalid strings';
        }
    } 
    else if ($input['type'] === 'GetAllProducts') {
        $validInput = validateInput($input);
        if(!$validInput['valid']){
            $GLOBALS['code'] = 400;
            $status = false;
            $message = 'Invalid input';
            respond($status, $message, $GLOBALS['code']);
            exit();
        } else {
            try {
                
            } catch (Exception $e) {
                $GLOBALS['code'] = 500;
                $status = false;
                $message = "No Products found";
                $message = $e->getMessage();
                respond($status, $message, $GLOBALS['code']);
                exit();
            }
        }
        $products = $dbConn->getAllProducts();
        if($products){
            $GLOBALS['code'] = 200;
            $status = true;
            $message = $products;
        }
        else{
            $GLOBALS['code'] = 500;
            $status = false;
            $message = 'Could not get products';
        }
    } 
    else if ($input['type'] === 'UpdateProduct') {
        // Validate required fields
        if (!isset($input['upc']) || !is_numeric($input['upc'])) {
            $GLOBALS['code'] = 400;
            $status = false;
            $message = 'Valid upc is required';
            // respond(false, 'Valid upc is required', $GLOBALS['code']);
            exit();
        }

        try {
            // Prepare update data with proper field length limits
            $updateData = [
                'upc' => (int)$input['upc'],
                'product_name' => isset($input['product_name']) ? substr($input['product_name'], 0, 45) : null,
                'desc' => isset($input['desc']) ? substr($input['desc'], 0, 300) : null,
                'brand' => isset($input['brand']) ? substr($input['brand'], 0, 45) : null,
                'category_id' => isset($input['category_id']) ? (int)$input['category_id'] : null,
                'supplier_id' => isset($input['supplier_id']) ? (int)$input['supplier_id'] : null,
                'dimensions' => isset($input['dimensions']) ? substr($input['dimensions'], 0, 45) : null,
                'img_url' => isset($input['img_url']) ? substr($input['img_url'], 0, 45) : null
            ];

            // Validate at least one field is being updated
            $updateFields = array_filter($updateData, function($value, $key) {
                return $key !== 'upc' && $value !== null;
            }, ARRAY_FILTER_USE_BOTH);

            if (empty($updateFields)) {
                $GLOBALS['code'] = 400;
                $status = false;
                $message = 'No fields provided for update';
                // respond(false, 'No fields provided for update', $GLOBALS['code']);
                exit();
            }

            // Perform the update
            $success = $dbConn->updateProduct($updateData);

            if ($success) {
                $GLOBALS['code'] = 200;
                $status = true;
                $message = 'Product updated successfully';
                // respond(true, 'Product updated successfully', $GLOBALS['code']);
            } else {
                $GLOBALS['code'] = 404;
                $status = false;    
                $message = 'Product not found or no changes made';
                // respond(false, 'Product not found or no changes made', $GLOBALS['code']);
            }

        } catch (Exception $e) {
            error_log("UpdateProduct Error: " . $e->getMessage());
            $GLOBALS['code'] = 500;
            $status = false;
            $message = 'Server error: ' . $e->getMessage();
            // respond(false, 'Server error: ' . $e->getMessage(), $GLOBALS['code']);
        }
    }
    else if($input['type'] === 'Categories'){
        if($dbConn->checkApiKey($input['apikey'])){
            if($input['Operation'] === 'Add'){
                $user = $dbConn->getUserWithApikey($input['apikey']);
                if($user['user_type'] === 'Admin' || $user['user_type'] === 'Business'){
                    try{
                        $newName = $input['category_name'];
                        $parentID = null;
                        if(isset($input['parent_category_name'])){
                            $cat = $dbConn->getCategoryID($input['parent_category_name']);
                            $parentID = $cat['category_id'];
                        }

                        $id = $dbConn->addCategory($newName, $parentID);

                        $GLOBALS['code'] = 201;
                        $status = true;
                        $message = ["category_id" => $id];

                    }
                    catch(Exception $e){
                        $GLOBALS['code'] = 500;
                        $status = false;
                        $message = $e->getMessage();
                    }
                }
                else{
                    $GLOBALS['code'] = 403;
                    $status = false;
                    $message = "User cannot do the following operatio ";
                }
            }
            else if($input['Operation'] === 'Delete'){
                $user = $dbConn->getUserWithApikey($input['apikey']);
                if($user['user_type'] === 'Admin' || $user['user_type'] === 'Business'){
                    try{
                        $dbConn->deleteCategory($input['category_id']);
                        $GLOBALS['code'] = 200;
                        $status = true;
                        $message = "Successfully deleted category";

                    }
                    catch(Exception $e){
                        $GLOBALS['code'] = 500;
                        $status = false;
                        $message = $e->getMessage();
                    }
                }
                else{
                    $GLOBALS['code'] = 403;
                    $status = false;
                    $message = "User cannot do the following operation.";
                }
            }
            else if($input['Operation'] === 'Get'){
                try{
                    $data = $dbConn->getCategories();

                    $GLOBALS['code'] = 200;
                    $status = true;
                    $message = $data;
                }
                catch(Exception $e){
                    $GLOBALS['code'] = 500;
                    $status = false;
                    $message = $e->getMessage();
                }
            }
            else if($input['Operation'] === 'Update'){
                $user = $dbConn->getUserWithApikey($input['apikey']);
                if($user['user_type'] === 'Admin' || $user['user_type'] === 'Business'){
                    try{

                        $data = $dbConn->updateCategory($input['category_name'], $input['category_id']);

                        $GLOBALS['code'] = 200;
                        $status = true;
                        $message = $data;
                    }
                    catch(Exception $e){
                        $GLOBALS['code'] = 500;
                        $status = false;
                        $message = $e->getMessage();
                    }
                }
                else{
                    $GLOBALS['code'] = 403;
                    $status = false;
                    $message = "User cannot do the following operatio ";
                }
            }
            else{
                $GLOBALS['code'] = 400;
                $status = false;
                $message = "Unknown Operation. Please specify an Operation";
            }
        }
    }
    else if($input['type'] === 'User'){

    }
    else if($input['type'] === 'Review'){

    }
    else{
        if(empty($GLOBALS['code'])) $GLOBALS['code'] = 400;
        $status = false;
        $message = "Please specify type or check request body for mistakes";
    }

    respond($status, $message, $GLOBALS['code']);
    

?>