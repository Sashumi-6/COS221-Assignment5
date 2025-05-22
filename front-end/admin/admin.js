/* TODO
    - Add button functionality
    - How to edit users/products
*/
function productsUpdate(data) {
    let del_btn = $(`<div class="buttons"><button>Delete</button></div>`);
    let main = $(`
        <div class="product">
            <a>${data.upc}</a>
            <a>${data.name}</a>
            <a>${data.description}</a>
            <a>${data.category}</a>
            <a>${data.brand}</a>
            <a>${data.supplier}</a>
        </div>
        `).append(del_btn);
    $('#products-container').append(main);
}

function usersUpdate(data) {
    let del_btn = $(`<div class="buttons"><button>Delete</button></div>`);
    let main = $(`
        <div class="user">
            <a>${data.id}</a>
            <a>${data.firstName}</a>
            <a>${data.lastName}</a>
            <a>${data.email}</a>
        </div>
        `).append(del_btn);
    $('#users-container').append(main);
}

function sideContentUpdate(selector, data) {
    //template
    data.forEach((tmp, idx) => {
        let edit = $('<button id="edit">Edit</button>');
        let del = $('<button id="delete">Delete</button>');
        let main = $(`
            <div class="item" id="${idx}">
                <a>${tmp}</a>
                <div class="buttons"></div>
            </div>
            `)

        edit.appendTo(main.children('.buttons'));
        del.appendTo(main.children('.buttons'));
        $(selector + " #list-items").append(main);
    });
}

// Tmp Data
var categoryTmp = ["Category1", "Category2", "Category3", "Category4", "Category5", "Category6"]
var StockistTmp = ["Stockist1", "Stockist2", "Stockist3", "Stockist4", "Stockist5", "Stockist6"]

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
        firstName: "John",
        lastName: "Doe",
        email: "johnDoe@generic.com"
    },
    {
        id: "002",
        firstName: "Jane",
        lastName: "Doe",
        email: "janeDoe@generic.com"
    },
    {
        id: "003",
        firstName: "Pavan",
        lastName: "DeGoat",
        email: "PavanDeGoat@generic.com"
    },
    {
        id: "004",
        firstName: "John but this is really long",
        lastName: "Doe but this is really long",
        email: "johnDoe@generic.com but this is really long"
    }
]

function webLoad() {
    //Load side content
    sideContentUpdate('#categories-container', categoryTmp);
    sideContentUpdate('#stockist-container', StockistTmp);

    products.forEach((prod) => { productsUpdate(prod) });
    users.forEach((user) => { usersUpdate(user) });
}

$(document).ready(webLoad);