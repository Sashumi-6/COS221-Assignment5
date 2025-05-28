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

###  link: https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php
username: u24845061
passwword: Carbon123
## u24845061 Ntuthuko, u24676412 Njabulo Integration Team

Products api endpoint:
Getting Prodcuts:
NB - No api key is required for any of the get product calls, but the delete and update will require api key
GetAllProdcuts:
example input
{
    "type": "GetAllProducts"
}

example output:
{
    "status": "success",
    "timestamp": 1748349662,
    "data": {
        "count": 199,
        "products": [
            {
                "upc": 1001,
                "product_name": "XPhone 12-2",
                "description": "Latest smartphone with advanced camera features and more survival stuff",
                "dimensions": "6.0 x 2.8 x 0.35 inches",
                "img_url": "phone1.jpg",
                "brand": "TechMaster",
                "supplier": {
                    "supplier_id": 1,
                    "supplier_name": "TechGadgets International",
                    "contact_info": "support@techgadgets-new.com"
                },
                "category": {
                    "category_id": 20,
                    "category_name": "Feature Phones",
                    "parent_category": "Phones"
                }
            }, etc.. will repeat for each product in the table
}

for other cases, being filtering or searching for specific products, you will literally just add parameter of which you want to search for, and it 
should fetch all things related, i.e

example input:
{
    "type": "GetAllProducts",
    "upc": 1001

}
{
    "status": "success",
    "timestamp": 1748362489,
    "data": {
        "count": 1,
        "products": [
            {
                "upc": 1001,
                "product_name": "XPhone 12-2",
                "description": "Latest smartphone with advanced camera features and more survival stuff",
                "dimensions": "6.0 x 2.8 x 0.35 inches",
                "img_url": "phone1.jpg",
                "brand": "TechMaster",
                "supplier": {
                    "supplier_id": 1,
                    "supplier_name": "TechGadgets International",
                    "contact_info": "support@techgadgets-new.com"
                },
                "category": {
                    "category_id": 20,
                    "category_name": "Feature Phones",
                    "parent_category": "Phones"
                }
            }
        ]
    }
}

example input:
{
    "type": "GetAllProducts",
    "brand": "TechMaster"

}

example output:
{
    "status": "success",
    "timestamp": 1748362531,
    "data": {
        "count": 3,
        "products": [
            {
                "upc": 1001,
                "product_name": "XPhone 12-2",
                "description": "Latest smartphone with advanced camera features and more survival stuff",
                "dimensions": "6.0 x 2.8 x 0.35 inches",
                "img_url": "phone1.jpg",
                "brand": "TechMaster",
                "supplier": {
                    "supplier_id": 1,
                    "supplier_name": "TechGadgets International",
                    "contact_info": "support@techgadgets-new.com"
                },
                "category": {
                    "category_id": 20,
                    "category_name": "Feature Phones",
                    "parent_category": "Phones"
                }
            },
            {
                "upc": 1002,
                "product_name": "UltraBook Pro",
                "description": "High-performance laptop with 16GB RAM",
                "dimensions": "12.3 x 8.8 x 0.6 inches",
                "img_url": "laptop1.jpg",
                "brand": "TechMaster",
                "supplier": {
                    "supplier_id": 1,
                    "supplier_name": "TechGadgets International",
                    "contact_info": "support@techgadgets-new.com"
                },
                "category": {
                    "category_id": 23,
                    "category_name": "Ultrabooks",
                    "parent_category": "Laptops"
                }
            },
            {
                "upc": 8001,
                "product_name": "HealthTrack Pro",
                "description": "Smartwatch with health monitoring",
                "dimensions": "1.8 x 1.5 x 0.5 inches",
                "img_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeLSYqzl69Ov8nL3UC0QlZ3HTB7JDCdaD84A&s",
                "brand": "TechMaster",
                "supplier": {
                    "supplier_id": 1,
                    "supplier_name": "TechGadgets International",
                    "contact_info": "support@techgadgets-new.com"
                },
                "category": {
                    "category_id": 18,
                    "category_name": "Wearables",
                    "parent_category": "Electronics"
                }
            }
        ]
    }
}



Retailer api endpoint:

Updating Retailer:
example input:
{
  "type": "UpdateProduct",
  "upc": 1001,
  "brand": "TechMaster",
  "dimensions": "6.0 x 2.8 x 0.35 inches",
  "product_name": "XPhone 12-2",
  "category_id": "20",
  "desc": "Latest smartphone with advanced camera features and more survival stuff"
}
example output:
{
    "status": "success",
    "timestamp": 1748360422,
    "data": "Product updated successfully"
}


Categories api endpoint:
{
    type: Categories,
    operation: Add/Get/Delete/Update,
    apikey: user apikey,
    category_id : must be specified for Update and Delete,
    category_name : must be specified for Add and update,
    parent_category_name : name of this category's parent category
}

response from get  :
{
    category_id : int,
    category_name : string,
    parent_category_id : null/int,
    children : [
        {
            category_id : int,
            category_name : string,
            parent_category_id : null/int,
        }
    ]
}

When using \Delete, specify the category id. Omit category_name.

When using Add, specify name of category and it'll be added. Returned will be
the categories id. Omit category_id. 
ALSO if this category happens to "fall under" another 
e.g Phones falls under Electronics, 
included the name "Electronics" at parent_category_name

When Update specify both name and id. A message shall be returned.
========
User api endpoint:
{
    type: Users,
    operation: Get/Delete,
    apikey: Admin's apikey (will be verified),
    user_id : must be specified if using the delete operation
}

returned by Get operation:
{
    user_id,
    full_name,
    username,
    email,
    user_type
}

For security and practicality, the apikey, salt and password is not returned
========
Reviews api endpoint:
{
    type : Reviews,
    operation : Get/Add/Overall,
    apikey: A user's key (any user registered can review),
    upc : must be specified if using the Add, Get and Overall operation
    rating : must be specified for add,
    review : must be specified for add,
    username : must be specified for add,
    supplier_name : must be specified for add

}

returned by Add/Get operation:
{
    username of commentor,
    rating,
    review,
    supplier_name
}

Add will return specifically the new review (this will allow for real time 
additon), whereas get will the reviews of a specific product 
based on the UPC
========
GetOffers API endpoint:
{
    type : GetOffers,
    apikey : user key,
    upc : product's upc
}

response :
{
    status : success,
    timestamp : 111111121,
    data : [
        {
            offer_id,
            retailer_name,
            retailer_id,
            price
        }
    ]
}
========
AddOffer API endpoint:
{
    type : AddOffer,
    apikey : user key,
    upc : product's upc,
    retailer_name : name of retailer,
    price : product price,
    stock_count : available stock as int,
    delivery_time : string of delivery time e.g "5-7 Business days"
    shipping_fee : shipping fee amount
}

response (newly added offer, to enable possible real time update):
{
    status : success,
    timestamp : 111111121,
    data : {
        offer_id,
        retailer_name,
        price
    }
}

=====

UpdateOffer API endpoint:
{
    type : UpdateOffer,
    apikey : user key,
    upc : product associated with this offer,
    retailer_id : id of the retailer associated with this offer,
    field : must one of the following [price, stock_count, shipping_fee, delivery_time],
    new_value : the new value for the field
}

response :
{
    status : success,
    timestamp : 111111121,
    data : "Updated offer successfully"
}
