<?php

error_reporting(0);

if (isset($_POST)) {
    $body = json_decode(file_get_contents('php://input'), true);

    $name = stripData($body["name"]);
    $email = stripData($body["email"]);
    $subject = stripData($body["subject"]);
    $message = stripData($body["message"]);

    $msg = "From: " . $name . "\nEmail: " . $email . "\n\nMessage: " . $message;
    $validate = [validateData($name), validateData($email), validateData($subject), validateData($message)];

    header('Content-Type: application/json');

    if ($validate[0][0] && $validate[1][0] && $validate[2][0] && $validate[3][0]) {
        try {
            $mail = mail("techteacher.pershore@gmail.com", $subject, $msg, "Reply-To: " . $email);
        } catch (Exception $e) {
            echo json_encode([502, "Unable to connect to Server"]);
        }
        
        if ($mail) {
            echo json_encode([200, "Message Sent!"]);
        } else {
            echo json_encode([502, "Unable to connect to Server"]);
        }
    } else {
        echo json_encode($validate);
    }
}

function stripData($data) {
    $data = trim($data);
    $data = strip_tags($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateData($data) {
    if (isset($data)) {
        if (!empty($data)) {
            if (preg_match("/^([a-zA-Z'-,. ]+){2,75}$/", $data)) {
                return [true, ""];
            } else if (filter_var($data, FILTER_VALIDATE_EMAIL)) {
                return [true, ""];
            }
            return [false, "Invalid Characters"];
        }
        return [false, "Empty Field"];
    }
    return [false, "Field unset"];
}