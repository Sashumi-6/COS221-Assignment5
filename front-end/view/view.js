// Assume the product ID is in the URL as a query
const urlParams = new URLSearchParams(window.location.search);
const product_id = urlParams.get('productID');

function ajaxRequest(input) {
    //IF we do this localhost then use this otherwise we remove auth (we also have to hide these details somehow)
    //Rn ive just set it to my shit but change this obv when
    let username = "u24772756", password = "@cce552UP1";
    let settings = {
        url: "https://wheatley.cs.up.ac.za/u24772756/HA/api.php",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: JSON.stringify(input),
    };

    return $.ajax(settings);
}
function onfail(jqXHR, status, err) { console.log(status + ": " + err) }

let tmp = {
    name: "Product Name",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    categories: [
        {
            id: 1,
            name: "Category1"
        },
        {
            id: 2,
            name: "Category2"
        },
        {
            id: 3,
            name: "Category3"
        },
        {
            id: 4,
            name: "Category4"
        }
    ],
    brand: "Generic Brand",
    dimensions: "21cm x 42cm",
    img: "https://dummyjson.com/image/500/teal",
    supps: [
        {
            id: 1,
            name: "supplier1",
            price: "R100"
        },
        {
            id: 2,
            name: "supplier2",
            price: "R200"
        },
        {
            id: 3,
            name: "supplier3",
            price: "R300"
        },
        {
            id: 4,
            name: "supplier4",
            price: "R400"
        },
        {
            id: 5,
            name: "supplier5",
            price: "R500"
        }
    ]
}
function loadProductDetails(data) {
    // obv pass thru data from the ajax call then use that rather than the tmp data ive defined
    let product = $(`
            <div id="product-image">
                <img src="${tmp.img}" alt="Product_image">
            </div>
            <div id="product-data">
                <a style="font-size: 1.4em;">${tmp.name}</a>
                <a id="product-description">${tmp.desc}</a>
                <div id="categories-container"></div>
                <a>${tmp.brand}</a>
                <a style="font-size: 0.9em;">${tmp.dimensions}</a>
            </div>
        `);
    
    //setting categories
    let categories = product.find('#categories-container');
    tmp.categories.forEach((category) => { categories.append(`<a>${category.name}</a>`) });

    //adding to body
    $('#product-details-container').append(product);

    //data will have supplier details - pass suppliers and prices
    loadSuppliers(tmp.supps);
}

// DO NOT TOUCH !!! @daniel working on this
function loadSuppliers(data) {
    //will get called inside loadProductDetails
    data.forEach((supplier) => {
        $('#prices-container')
        .append(`
            <div class="price-supplier-container">
                <a>${supplier.name}</a>
                <a>${supplier.price}</a>
            </div>
        `);
    });
}

function loadReviewDetails() {

}

function webload() {
    //temp data just to prove ajax works
    // .then() we can set stuff there as in global data gets and stuff
    ajaxRequest({
        type: "Login",
        username: "genericOperator",
        password: "operator123"
    }).then((resp) => { console.log(resp) }, onfail);

    loadProductDetails();
}

$(document).ready(webload);