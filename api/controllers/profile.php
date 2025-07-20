<?php
session_start();
if (!isset($_SESSION['user'])) {
  header("Location: login.php");
  exit();
}
$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <title>Profilul meu - Fragrance Shop</title>
  <link rel="stylesheet" href="../css/styles.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap" rel="stylesheet" />
</head>
<body>
  <?php include 'header.php'; ?>

  <main class="profile-section">
    <div class="profile-card">
      <div class="profile-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="profile-info">
        <h2><?= htmlspecialchars($user['first_name'] . ' ' . $user['last_name']) ?></h2>
        <span class="profile-role-badge"><?= strtoupper($user['role']) ?></span>
        <div class="profile-details">
          <div>
            <i class="fas fa-envelope"></i>
            <span><?= htmlspecialchars($user['email']) ?></span>
          </div>
          <div>
            <i class="fas fa-calendar-alt"></i>
            <span>Membru din: <?= htmlspecialchars($user['created_at']) ?></span>
          </div>
        </div>
        <a href="edit-profile.php" class="btn-modern btn-primary">
          <i class="fas fa-edit"></i> Editează profilul
        </a>
      </div>
    </div>
    <div class="profile-actions">
      <a href="orders.php" class="profile-action-link">
        <i class="fas fa-box"></i><span>Vezi comenzile mele</span>
      </a>
      <a href="wishlist.php" class="profile-action-link">
        <i class="fas fa-heart"></i><span>Vezi favoritele</span>
      </a>
      <a href="logout.php" class="profile-action-link logout-link">
        <i class="fas fa-sign-out-alt"></i><span>Logout</span>
      </a>
    </div>
  </main>

  <?php include 'footer.php'; ?>
</body>
</html>
