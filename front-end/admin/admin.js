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
let productsCache = [];
let usersCache = [];
let fetchedProducts = [];
let fetchedUsers    = [];

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

    $(`#upc-${data.upc} .buttons button`).on("click", 
        {upc : data.upc}, deleteProduct);
}

function deleteProduct(event){
    let input = {
        type : "DeleteProduct",
        apikey : sessionStorage.getItem('apikey'),
        upc : event.data.upc
    }

    ajaxRequest(input)
    .done((response) => {
        if(response.status){
            $(`#upc-${event.data.upc}`).remove();
            alert("Product deleted successfully !");
        }
        else{
            alert(response.data || 'Failed to delete this Product');
        }
    })
    .fail((xhr) =>{
        if(xhr.status === 403){
            let body = JSON.parse(xhr.responseText);
            alert(body.data);
        }
        else{
            alert("Couldn't delete Product");
        }
    })
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

    $(`#userid-${data.user_id} .buttons button`).on("click", 
        {userId : data.user_id}, deleteUser);
}

function deleteUser(event){
    let input = {
        type : "Users",
        operation : "Delete",
        apikey : sessionStorage.getItem('apikey'),
        user_id : event.data.userId
    }
    ajaxRequest(input)
    .done((response) => {
        if(response.status){
            $(`#userid-${event.data.userId}`).remove();
            alert("User deleted successfully !");
        }
        else{
            alert(response.data || 'Failed to delete this user');
        }
    })
    .fail((xhr) =>{
        if(xhr.status === 403){
            let body = JSON.parse(xhr.responseText);
            alert(body.data);
        }
        else{
            alert("Couldn't delete user");
        }
    })
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
        if(type == "categories"){
                let req = {
                    type : capitalizeFirstLetter(type),
                    operation : "Update",
                    apikey : sessionStorage.getItem('apikey'),
                    category_name : input,
                    category_id : id
                };

                ajaxRequest(req)
                .done(response => {
                    if(response.status){
                        upd_btn.text("Edit");
                        del_btn.toggleClass('hidden');
                        input.toggleClass('hidden');
                        itemName.text(input.val());
                        itemName.toggleClass('hidden');
                    }
                    else{
                        alert(response.data || 'Attempt to add category failed.');
                    }

                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR.responseText);
                    console.error("AJAX error while adding category:", textStatus, errorThrown);
                });
        }
        else if(type == "stockist"){
            let req = {
                type : "UpdateRetailer",
                apikey : sessionStorage.getItem('apikey'),
                retailer_name : input,
                retailer_id : id
            };

            ajaxRequest(req)
            .done(response => {
                if(response.status){
                    upd_btn.text("Edit");
                    del_btn.toggleClass('hidden');
                    input.toggleClass('hidden');
                    itemName.text(input.val());
                    itemName.toggleClass('hidden');
                }
                else{
                    alert(response.data || 'Attempt to add category failed.');
                }

            })
            .fail((jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseText);
                console.error("AJAX error while adding category:", textStatus, errorThrown);
            });
        }

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
        
            // IMPLEMENT API SHIT HERE !!!
            if(type == "categories"){
                let input = {
                    type : capitalizeFirstLetter(type),
                    operation : "Add",
                    apikey : sessionStorage.getItem('apikey'),
                    category_name : addInputValue,
                    parent_category_name : null
                };

                ajaxRequest(input)
                .done(response => {
                    if(response.status){
                        sideContentUpdate(type, addInputValue);
                        item.find('input').attr('placeholder', 'Success')
                    }
                    else{
                        alert(response.data || 'Attempt to add category failed.');
                    }

                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR.responseText);
                    console.error("AJAX error while adding category:", textStatus, errorThrown);
                });
            }
            else if(type == "stockist"){
                let input = {
                    type : "addRetailer",
                    apikey : sessionStorage.getItem('apikey'),
                    retailer_name : addInputValue,
                    website : `https://${addInputValue}.co.za`,
                    logo_url : "logo.jpeg",
                    location : "Johannesburg",
                    contact_email : `noreply@${addInputValue}.com`
                };

                ajaxRequest(input)
                .done(response => {
                    if(response.status){
                        sideContentUpdate(type, addInputValue);
                        item.find('input').attr('placeholder', 'Success')
                    }
                    else{
                        alert(response.data || 'Attempt to add category failed.');
                    }

                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR.responseText);
                    console.error("AJAX error while adding category:", textStatus, errorThrown);
                });
            }

        } else item.find('input').attr('placeholder', 'Error - Try again');
        item.find('input').val('');
    }

    if (operation == "del") {
        // IMPLEMENT API SHIT HERE
        if(type == "categories"){
                let input = {
                    type : capitalizeFirstLetter(type),
                    operation : "Delete",
                    apikey : sessionStorage.getItem('apikey'),
                    category_id : id
                };

                ajaxRequest(input)
                .done(response => {
                    if(response.status){
                        $('.item#' + id).remove();
                    }
                    else{
                        alert(response.data || 'Attempt to removing category failed.');
                    }

                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR.responseText);
                    console.error("AJAX error while removing category:", textStatus, errorThrown);
                });
        }
        else if(type == "stockist"){
            let input = {
                type : "DeleteRetailer",
                apikey : sessionStorage.getItem('apikey'),
                retailer_id : id
            };

            ajaxRequest(input)
            .done(response => {
                if(response.status){
                    $('.item#' + id).remove();
                }
                else{
                    alert(response.data || 'Attempt to remove retailer failed.');
                }

            })
            .fail((jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseText);
                console.error("AJAX error while removing retailer:", textStatus, errorThrown);
            });
        }
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

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
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

function loadCategories() {
    const requestData = {
        type: "Categories",
        operation : "Get",
        apikey : sessionStorage.getItem('apikey')
    };

    ajaxRequest(requestData)
    .done((response) => {
        if (response.status && Array.isArray(response.data)) {
            //const categoryTree = buildCategoryTree(response.data);categories
            let data = renderCategoryTree(response.data);
            data.forEach((cat) => { sideContentUpdate('categories', cat.category_name) });

        } else {
            console.error("Failed to load categories: Invalid response format", response);
        }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR.responseText);
        console.error("AJAX error while loading categories:", textStatus, errorThrown);
    });
}//end loadCategories

function renderCategoryTree(tree, parent = $("#categories-container"), level = 0) {
    let toRet = [];
    tree.forEach(cat => {
        toRet.push(cat);

        if (cat.children.length > 0) {
            renderCategoryTree(cat.children, $("#categories-container"), level + 1);
        }
    });

    return toRet;
}//end renderCategories

function loadStockists(){
    let input = {
        type : "GetAllRetailers",
        apikey : sessionStorage.getItem('apikey')
    };
    ajaxRequest(input)
    .done(response => {
        if(response.status){
            let data = response.data;
            data.forEach((stock) => { sideContentUpdate('stockist', stock.retailer_name) });
        }
        else{
            alert(response.data || 'Retrieval of retailers failed.');
        }

    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR.responseText);
        console.error("AJAX error while loading categories:", textStatus, errorThrown);
    });
}

// Initiliser varibles
let CategoryInit = 0;
let StockistInit = 0;
function initBrandDropdown(products) {
  const brandSet = new Set(products.map(p => p.brand).filter(b => b));
  const $brand = $('#brand-select').empty().append(`<option value="">All Brands</option>`);
  Array.from(brandSet).sort().forEach(b => $brand.append(`<option value="${b}">${b}</option>`));
}

function initCategoryDropdown(products) {
  // build unique map of category_id → category_name
  const catMap = new Map();
  products.forEach(p => {
    if (p.category?.category_id) {
      catMap.set(p.category.category_id, p.category.category_name);
    }
  });

  const $cat = $('#category-select').empty().append(`<option value="">All Categories</option>`);
  // sort by name
  Array.from(catMap.entries())
       .sort((a, b) => a[1].localeCompare(b[1]))
       .forEach(([id, name]) => {
         $cat.append(`<option value="${id}">${name}</option>`);
       });
}

function webLoad() {
    //Load side content
    loadCategories();
    loadStockists();

    ajaxRequest({type: "GetAllProducts"}).then((response) => {
        console.log("API Response:", response); // For debugging
        
        if (response.status === 'success' && response.data?.products) {
            // Access the products array correctly
            // cache & render
            fetchedProducts = response.data.products.slice();
            fetchedProducts.forEach(productsUpdate);

            // Initialize brand & category dropdowns
            initBrandDropdown(fetchedProducts);
            initCategoryDropdown(fetchedProducts);
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
            // cache & render
            fetchedUsers = response.data.slice();
            fetchedUsers.forEach(usersUpdate);
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
    // wire up our new filters
    $('#bar').off('input').on('input', applyAdminFilters);
    $('#brand-select, #category-select, #sort-select')
        .off('change')
        .on('change', applyAdminFilters);

    function applyAdminFilters() {
        const term  = $('#bar'       ).val().trim().toLowerCase();
        const brand = $('#brand-select').val();
        const catId  = $('#category-select').val();
        const sort  = $('#sort-select' ).val();

        // --- PRODUCTS ---
        let prods = fetchedProducts.slice();
        if (catId) {
            const id = parseInt(catId,10);
            prods = prods.filter(p => p.category.category_id === id);
        }
        if (brand) prods = prods.filter(p => p.brand === brand);
        if (term)  prods = prods.filter(p =>
            p.product_name.toLowerCase().includes(term) ||
            (p.description||'').toLowerCase().includes(term)
        );
        if (sort === 'az') prods.sort((a,b)=> a.product_name.localeCompare(b.product_name));
        if (sort === 'za') prods.sort((a,b)=> b.product_name.localeCompare(a.product_name));

        // clear & re-render products
        $('#products-container .product').remove();
        prods.forEach(productsUpdate);

        // --- USERS ---
        let us = fetchedUsers.slice();
        if (term) us = us.filter(u =>
            u.username.toLowerCase().includes(term) ||
            (u.full_name||'').toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        );
        if (sort === 'az') us.sort((a,b)=> a.username.localeCompare(b.username));
        if (sort === 'za') us.sort((a,b)=> b.username.localeCompare(a.username));

        // clear & re-render users
        $('#users-container .user').remove();
        us.forEach(usersUpdate);
    }

}//end webload

$(document).ready(webLoad);