# COS221-Assignment5

# Team Members

    - Daniel Cohen u24772756 [Front end | Team Leader]
    - Morgan Calaca u24910882 [Front end]
# E-Commerce Price Comparison Application

## Overview

This application is a front-end and admin panel for an e-commerce price comparison website. It allows:

* **Customers** to browse, search, filter, and view products by category and brand.
* **Admins** to manage products, categories, stockists, and users.

Default user accounts are provided for initial access.

---

## Prerequisites

* **Node.js** (v14+ recommended) and **npm**
* **Web server** capable of serving static files (e.g., Apache, Nginx, or a simple local server)
* **jQuery** (loaded via CDN in HTML)

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ecommerce-compare.git
   cd ecommerce-compare
   ```

2. **Install dependencies** (if any build tools are used)

   ```bash
   npm install
   ```

3. **Configure API endpoint**

   In both `user.js` and `admin.js`, ensure the `apiUrl` constant points to the live API:

   ```js
   const apiUrl = "https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php";
   ```

4. **Serve the files**

   * If using a simple static server:

     ```bash
     npx http-server .
     ```
   * Or copy files to your web server's document root.

5. **Access the application**

   * **Customer view**: `http://localhost:8080/index.html`
   * **Admin panel**: `http://localhost:8080/admin/admin.html`

---

## Default User Accounts

| Role     | Username    | Password      |
| -------- | ----------- | ------------- |
| Admin    | AdminAdmin  | M\@k3M3\@dmin |
| Customer | IronManMkII | !LoveYou3000  |

> **Note:** For production, please change default passwords immediately.

---

## Usage

### Customer Interface

1. **Login** is not required to browse products.
2. Use the **Search** bar to find products by name or description.
3. Use **Sort** (A→Z, Z→A) and **Filter by Brand** and **Filter by Category** dropdowns.
4. Click **View Product** on a product card to see its detailed `view.html?upc=<UPC>` page.

### Admin Panel

1. **Login** with the Admin credentials.
2. View and manage:

   * **Products**: List, delete, and navigate to individual product views.
   * **Users**: List and delete users.
   * **Categories** & **Stockists**: Add, edit, and delete entries via the side panel.
3. Use the **Search** bar and **Sort** / **Filter** dropdowns to quickly locate records.

---

## Extending & Development

* **API Integration**: Update `api.php` URL and credentials in `ajaxRequest()` as needed.
* **Styling**: Modify `signup.css`, `admin.css`, and global styles in `../global/styles.css`.
* **JavaScript**: All front-end logic lives in `user.js` (customer) and `admin.js` (admin panel).

---

## Troubleshooting

* **401 Unauthorized**: Ensure Basic Auth credentials in JavaScript match those expected by the API.
* **Bad Request**: Verify that request payloads match the API contract (e.g. `type`, `operation`, and omit `apikey` when not needed).
* **jQuery Errors**: Confirm that jQuery is loaded before any custom scripts in your HTML.
