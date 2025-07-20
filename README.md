Fragrance Shop

Fragrance Shop is a modern and responsive e-commerce web application for selling perfumes and accessories. It provides user authentication, wishlist/favorites, order management, contact form, real-time search/filtering, and a stylish shopping cart experience.

🚀 Features

    User Registration & Login: Secure registration and authentication using PHP and sessions.

    User Profile: View and edit profile information, see user role, favorite products, and order history.

    Products Catalog: List, search, and filter products; separate product detail pages.

    Shopping Cart: Add/remove products, see total price and product count in real time.

    Wishlist/Favorites: Add products to favorites, accessible in both header and a dedicated page.

    Order History: Users can see products they ordered in a dedicated area.

    Contact Form: Send messages via a contact form (server validation included).

    Persistent Data: User data, cart, and wishlist use localStorage for a seamless experience, synced with server logic as needed.

    Responsive Design: Optimized for both desktop and mobile devices.

    Logout: Complete logout functionality from both frontend (localStorage) and backend (session).

    Real User Roles: Differentiate between USER and ADMIN (where logic applies).
    
🧩 Technologies Used

    Frontend

        HTML5, CSS3 (custom + Google Fonts - Lora)

        JavaScript (ES6+)

        Font Awesome for icons

    Backend

        PHP 7+ (OOP & procedural, controllers, sessions)

        MySQL (for user, products, and orders management)

    Persistence

        localStorage (for cart, wishlist, and profile info on frontend)

        Sessions (for PHP authentication and secure server operations)

    Other

        JSON data files (for locations, country codes, etc.)

📂 Project Structure

FRAGRANCE_SHOP/
│
├── api/
│   └── config/
│       └── db.php
│
├── controllers/
│   ├── contact_process.php
│   ├── login_process.php
│   ├── logout.php
│   ├── product-details.php
│   ├── products.php
│   ├── profile.php
│   ├── signup_process.php
│   └── wishlist.php
│
├── models/
│   └── (future database models)
│
├── uploads/
│   └── (user uploads/products images; not public in this structure)
│
├── css/
│   └── styles.css
│
├── images/
│   └── (all graphics and images)
│
├── pages/
│   ├── cart.html
│   ├── contact.html
│   ├── index.html
│   ├── login.html
│   ├── product-details.html
│   ├── products.html
│   ├── profile.html
│   ├── signup.html
│   └── wishlist.html
│
├── scripts/
│   ├── cart.js
│   ├── contact.js
│   ├── CountryCodes.json
│   ├── judet_oras.js
│   ├── judete.json
│   ├── login.js
│   ├── logout.js
│   ├── main.js
│   ├── prefixes.js
│   ├── product-details.js
│   ├── products.js
│   ├── profile.js
│   ├── signup.js
│   ├── validate.js
│   └── wishlist.js
│
├── index.php
└── README.md

⚙️ How to Run

1. Clone the repository:

```
git clone https://github.com/yourusername/fragrance-shop.git
```

2. Local Server Setup:

    Run with XAMPP, WAMP, MAMP, Laragon, etc. with PHP 7+.

    Put project in your web root (htdocs, www, etc.)

3. Database:

    Import provided SQL file (if any) into MySQL using PHPMyAdmin or CLI.

    Configure your database connection parameters in api/config/db.php.

4. Access the Site:

    Open http://localhost/FRAGRANCE_SHOP/pages/index.html or index.php in your browser.

🗂️ Main Functionality by Files

    controllers/*: Handles backend logic for login, logout, contact, product details, wishlist, etc.

    pages/*: Contains all main frontend pages (login, signup, cart, contact, wishlist, product details, etc).

    scripts/*: JS logic for each page (profile, products, cart, login, etc), plus validation and utils.

    css/styles.css: Main stylesheet for the whole app.

💡 Notes

    User login and profile management utilizes both backend PHP and localStorage for smooth interaction.

    Most data flows (cart, wishlist, etc.) persist in localStorage for instant frontend updates. Critical operations are processed via PHP controllers.

    The project can easily be extended with new models, backend APIs, and an admin dashboard.

    You can switch profile.html to be fully dynamic in PHP (profile.php) as needed.

    Ensure you are not exposing sensitive directories (uploads/, models/) if deploying in production.



