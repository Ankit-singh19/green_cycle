<?php
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if(!$data) {
        $data = $_POST;
    }

    $name = isset($data['name']) ? $conn->real_escape_string($data['name']) : '';
    $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
    $subject = isset($data['subject']) ? $conn->real_escape_string($data['subject']) : '';
    $message = isset($data['message']) ? $conn->real_escape_string($data['message']) : '';

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    $sql = "INSERT INTO contacts (name, email, subject, message) VALUES ('$name', '$email', '$subject', '$message')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Message Sent Successfully! ✅"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
$conn->close();
?>