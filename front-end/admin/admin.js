/* TODO
    - Add button functionality
    - How to edit users/products
    - Maybe change instead of using ID's maybe attributes for easier searching...
    - Search (top right in the webpage)
        How searching works:
        User types something in search bar,
        look for a user/product ie. search will search in both products & users
        if nothin found, display "nothing found"

    filters: (top left in webpage)
        okay so it says 'filters' but its more sorting than it is filtering.
        if theres time maybe change that semantic but,
        How filtering (sorting) works:
        only 1 filter can be active at a time
*/

function productsUpdate(data) {
    // Extract category information
    const categoryDisplay = data.category ? 
        `${data.category.category_name} (${data.category.parent_category})` : 
        'No category';
    
    // Extract supplier information
    const supplierDisplay = data.supplier ? 
        data.supplier.supplier_name : 
        'No supplier';
    
    let del_btn = $(`<div class="buttons"><button>Delete</button></div>`);
    let main = $(`
        <div class="product" id="upc-${data.upc}">
            <a>${data.upc}</a>
            <a>${data.product_name}</a>
            <a>${data.description}</a>
            <a>${categoryDisplay}</a>
            <a>${data.brand}</a>
            <a>${supplierDisplay}</a>
        </div>
    `).append(del_btn);
    
    $('#products-container').append(main);
}

// 
// 
                // "upc": 1001,
                // "product_name": "XPhone 12-2",
                // "description": "Latest smartphone with advanced camera features and more survival stuff",
                // "dimensions": "6.0 x 2.8 x 0.35 inches",
                // "img_url": "phone1.jpg",
                // "brand": "TechMaster",
                // "supplier": {
                //     "supplier_id": 1,
                //     "supplier_name": "TechGadgets International",
                //     "contact_info": "support@techgadgets-new.com"
                // },
                // "category": {
                //     "category_id": 20,
                //     "category_name": "Feature Phones",
                //     "parent_category": "Phones"
                // }

function usersUpdate(data) {
    // Handle null full_name case
    const fullName = data.full_name || 'Not provided';
    
    let del_btn = $(`<div class="buttons"><button>Delete</button></div>`);
    let main = $(`
        <div class="user" id="userid-${data.user_id}">
            <a>${data.user_id}</a>
            <a>${data.username}</a>
            <a>${fullName}</a>
            <a>${data.email}</a>
            <a>${data.user_type}</a>
        </div>
    `).append(del_btn);
    
    $('#users-container').append(main);
}

function sideContentUpdate(selector, data) {
    let appendableComponent = $("#" + selector + "-container" + " #list-items");
    if ((selector == "categories" && CategoryInit == 0) || (selector == "stockist" && StockistInit == 0)) {
        //if we havent loaded the page
        let addbtn = $(`<button id="add-${selector}-btn">Add</button>`)
            .click({id: "add-" + selector, type: selector, command: "add"}, sideContent_add_del);
        
        let addComponent = $(`
            <div id="add-${selector}" class="item">
                <input id="add-${selector}" type="text">
                <div class="buttons"></div>
            </div>
            `);
        addbtn.appendTo(addComponent.children('.buttons'));
        appendableComponent.append(addComponent);
        if (selector == "categories") CategoryInit = 1;
        if (selector == "stockist") StockistInit = 1;
    }
    
    // Each Category name is unique => using it as the unique identifier for components

    //template

    //Create the buttons dawg
    let edit = $(`<button id="edit-btn">Edit</button>`)
        .click({id: data, type: selector}, editSideContent);
    let del = $(`<button id="delete-btn">Delete</button>`)
        .click({id: data, type: selector, command: "del"}, sideContent_add_del);

    let main = $(`
        <div class="item" id="${data}">
            <input id="inputEdit-${selector}${data}" class="hidden">
            <a>${data}</a>
            <div class="buttons"></div>
        </div>
        `)

    edit.appendTo(main.children('.buttons'));
    del.appendTo(main.children('.buttons'));
    appendableComponent.append(main);
}

// TODO
//  Need to make it that everywhere that Category "X" is refrenced (Such as in the products) is updated
function editSideContent(event) {
    let id = event.data.id;
    let type = event.data.type;

    let item = $('#' + type + "-container #" + id);
    let del_btn = item.find('#delete-btn');
    let upd_btn = item.find('#edit-btn');
    let input = item.find("input");
    let itemName = item.find("a");
    if (upd_btn.text() == "Edit") {
        upd_btn.text("Done");
        del_btn.toggleClass('hidden');
        itemName.toggleClass('hidden');
        input.val(itemName.text());
        input.toggleClass('hidden');
    } else {
        // API FUNCTIONALITY DONE HERE
        // UPDATE EVERYWHERE WHERE THIS CATEGORY EXISTS
        // THEN RELOAD ALL PRODUCTS ? - MAYBE CAN JUST TRY TO FIND WHERE THIS VAL EXITS IN THE PAGE
        //      => IN THE CORRECT CONTEXT

        upd_btn.text("Edit");
        del_btn.toggleClass('hidden');
        input.toggleClass('hidden');
        itemName.text(input.val());
        itemName.toggleClass('hidden');
    }
}

function sideContent_add_del(event) {
    let operation = event.data.command;
    let type = event.data.type;
    let id = event.data.id;

    let addInputValue = $('#' + type + "-container #" + id + " input").val().trim();
    if (operation == "add" && addInputValue !== '') {
        let items = $('#' + type + "-container");
        let item = items.find('#' + id);

        if ($('.item#' + addInputValue).length == 0) {
            sideContentUpdate(type, addInputValue);
            item.find('input').attr('placeholder', 'Success')

            // IMPLEMENT API SHIT HERE !!!
        } else item.find('input').attr('placeholder', 'Error - Try again');
        item.find('input').val('');
    }

    if (operation == "del") {
        $('.item#' + id).remove();
        // IMPLEMENT API SHIT HERE
    }
}

// Tmp Data
var categoryTmp = ["Category1", "Category2", "Category3", "Category4", "Category5", "Category6"]
var StockistTmp = ["Stockist1", "Stockist2", "Stockist3", "Stockist4", "Stockist5", "Stockist6"]

function ajaxRequest(input) {
        let username = "u24845061", password = "Carbon123";
        let settings = {
            url: "https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
            data: JSON.stringify(input),
        };

        return $.ajax(settings);
    }

let products = [
    {
        upc: "0001",
        name: "Generic1",
        description: "Generic Product",
        category: "Technology",
        brand: "Lenovo",
        supplier: "Incredible Connection"
    },
    {
        upc: "0002",
        name: "Generic2",
        description: "Generic Product",
        category: "Beauty",
        brand: "Channel",
        supplier: "Edgars"
    },
    {
        upc: "0003",
        name: "Generic3",
        description: "Generic Product",
        category: "Software",
        brand: "Microsoft",
        supplier: "Evetech"
    },
    {
        upc: "0004",
        name: "Generic4 But this is a really long name",
        description: "Generic Product but this is a really long name",
        category: "Generic Category but this is a really long name",
        brand: "Generic Brand but this is a really long name",
        supplier: "Generic Supplier but this is a really long name"
    }
]

let users = [
    {
        id: "001",
        username: "GenericUsername",
        fullName: "GenericFullName",
        email: "GenericEmail@gmail.com",
        user_type: "GenericUserType"
    },
    {
        id: "002",
        username: "GenericUsername",
        fullName: "GenericFullName",
        email: "GenericEmail@gmail.com",
        user_type: "GenericUserType"
    },
    {
        id: "011",
        username: "GenericUsername",
        fullName: "GenericFullName",
        email: "GenericEmail@gmail.com",
        user_type: "GenericUserType"
    },
    {
        id: "012",
        username: "GenericUsername",
        fullName: "GenericFullName",
        email: "GenericEmail@gmail.com",
        user_type: "GenericUserType"
    }
]

// Initiliser varibles
let CategoryInit = 0;
let StockistInit = 0;

function webLoad() {
    //Load side content
    categoryTmp.forEach((cat) => { sideContentUpdate('categories', cat) });
    StockistTmp.forEach((stock) => { sideContentUpdate('stockist', stock) });

    ajaxRequest({
    type: "GetAllProducts"
    // apikey: userApiKey
}).then((response) => {
    console.log("API Response:", response); // For debugging
    
    if (response.status && response.data && response.data.products) {
        // Access the products array correctly
        response.data.products.forEach((product) => {
            productsUpdate(product);
        });
    } else {
        console.error("Failed to fetch products:", response.data);
        // Display error message to user
        $('#products-container').append('<div class="error">No products found or error loading products</div>');
    }
}).catch((error) => {
    console.error("Error fetching products:", error);
    // Display error message to user
    $('#products-container').append('<div class="error">Error connecting to server</div>');
});

// "ba5b8ea60cf673"

ajaxRequest({
    type: "Users",
    apikey: sessionStorage.getItem('apikey'),
    operation: "Get"
    
}).then((response) => {
    console.log("API Response:", response); // For debugging
    
    if (response.status && response.data) {
        // The data is directly the array of users (no nested 'users' property)
        response.data.forEach((user) => {
            usersUpdate(user);
        });
    } else {
        console.error("Failed to fetch users:", response.data);
        $('#users-container').append('<div class="error">No users found or error loading users</div>');
    }
}).catch((error) => {
    console.error("Error fetching users:", error);
    $('#users-container').append('<div class="error">Error connecting to server</div>');
});
    // products.forEach((prod) => { productsUpdate(prod) });
    // users.forEach((user) => { usersUpdate(user) });
}

$(document).ready(webLoad);