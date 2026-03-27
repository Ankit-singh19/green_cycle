<?php
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $requestId = isset($_GET['id']) ? $conn->real_escape_string($_GET['id']) : '';

    if (empty($requestId)) {
        echo json_encode(["success" => false, "message" => "Request ID is missing."]);
        exit;
    }

    $sql = "SELECT status, eta, location FROM requests WHERE request_id='$requestId'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode(["success" => true, "data" => $data]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid Request ID"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if(!$data) $data = $_POST;

    $type = isset($data['type']) ? $conn->real_escape_string($data['type']) : 'General Waste';
    $location = isset($data['location']) ? $conn->real_escape_string($data['location']) : 'Pending Location';
    
    $requestId = "REQ-" . date("Y") . "-" . rand(1000, 9999);
    $status = "Pending";
    $eta = "TBD";

    $sql = "INSERT INTO requests (request_id, type, status, eta, location) VALUES ('$requestId', '$type', '$status', '$eta', '$location')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Collection Requested! Your ID is $requestId", "request_id" => $requestId]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
$conn->close();
?>