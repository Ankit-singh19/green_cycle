<?php
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT date, time, type, address, status FROM schedules ORDER BY date ASC, time ASC";
    $result = $conn->query($sql);
    $schedules = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $schedules[] = $row;
        }
    }
    echo json_encode(["success" => true, "data" => $schedules]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if(!$data) {
        $data = $_POST;
    }

    $date = isset($data['date']) ? $conn->real_escape_string($data['date']) : '';
    $time = isset($data['time']) ? $conn->real_escape_string($data['time']) : '';
    $type = isset($data['type']) ? $conn->real_escape_string($data['type']) : '';
    $address = isset($data['address']) ? $conn->real_escape_string($data['address']) : '';
    $status = 'upcoming'; // Default

    if (empty($date) || empty($time) || empty($type) || empty($address)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    $sql = "INSERT INTO schedules (date, time, type, address, status) VALUES ('$date', '$time', '$type', '$address', '$status')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Schedule Created Successfully ✅"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
$conn->close();
?>
