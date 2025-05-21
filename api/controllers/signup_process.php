<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['first_name']) || empty($data['last_name']) || empty($data['email']) ||
    empty($data['password']) || empty($data['confirm_password']) || ($data['password'] !== $data['confirm_password'])
) {
    echo json_encode(['success' => false, 'message' => 'Completează toate câmpurile corect!']);
    exit;
}

// Hash parola
$passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, dob, country, phone, gender, county, city, accepted_terms, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['first_name'],
        $data['last_name'],
        $data['email'],
        $passwordHash,
        $data['dob'],
        $data['country'],
        $data['phone'],
        $data['gender'],
        $data['judet'],
        $data['oras'],
        isset($data['terms']) && $data['terms'] ? 1 : 0,
        'user'
    ]);
    error_log("Inserție reușită pentru email: " . $data['email']); 
    echo json_encode(['success' => true, 'message' => 'Cont creat cu succes!']);
} catch (PDOException $e) {
    error_log("Eroare la inserție: " . $e->getMessage()); 
    echo json_encode(['success' => false, 'message' => 'Eroare la înregistrare: ' . $e->getMessage()]);
}

?>
