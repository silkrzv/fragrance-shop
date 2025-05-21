<?php
header('Content-Type: application/json');
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT * FROM products");
    $products = $stmt->fetchAll();
    echo json_encode(['success' => true, 'products' => $products]);
    exit;
}

// Urmeaza implementate metodele de POST/PUT/DELETE pentru add/update/delete products
?>
