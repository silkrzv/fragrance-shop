<?php
header('Content-Type: application/json');
require_once '../config/db.php';

// Verifică dacă userul este logat
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilizator neautentificat']);
    exit;
}

$userId = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obține wishlist-ul utilizatorului
    try {
        $stmt = $conn->prepare("
            SELECT w.*, p.name, p.price, p.image_url, p.brand 
            FROM wishlist w 
            JOIN products p ON w.product_id = p.id 
            WHERE w.user_id = ?
        ");
        $stmt->execute([$userId]);
        $wishlist = $stmt->fetchAll();
        echo json_encode(['success' => true, 'wishlist' => $wishlist]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Eroare la obținerea wishlist-ului']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Adaugă produs în wishlist
    $data = json_decode(file_get_contents("php://input"), true);
    $productId = $data['product_id'] ?? null;
    
    if (!$productId) {
        echo json_encode(['success' => false, 'message' => 'ID produs lipsește']);
        exit;
    }
    
    try {
        // Verifică dacă produsul există deja în wishlist
        $stmt = $conn->prepare("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Produsul este deja în wishlist']);
            exit;
        }
        
        // Adaugă produsul în wishlist
        $stmt = $conn->prepare("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)");
        $stmt->execute([$userId, $productId]);
        echo json_encode(['success' => true, 'message' => 'Produs adăugat în wishlist']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Eroare la adăugarea în wishlist']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Șterge produs din wishlist
    $productId = $_GET['product_id'] ?? null;
    
    if (!$productId) {
        echo json_encode(['success' => false, 'message' => 'ID produs lipsește']);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);
        echo json_encode(['success' => true, 'message' => 'Produs eliminat din wishlist']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Eroare la eliminarea din wishlist']);
    }
    exit;
}
?>
