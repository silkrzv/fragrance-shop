<?php
header('Content-Type: application/json');
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $productId = $_GET['id'] ?? null;
    
    if (!$productId) {
        echo json_encode(['success' => false, 'message' => 'ID produs lipsește']);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        if ($product) {
            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Produsul nu a fost găsit']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Eroare la obținerea produsului']);
    }
    exit;
}
?>
