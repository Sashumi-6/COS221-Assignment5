// Assume the product ID is in the URL as a query
// Change the .get('productID') with whatever we decide to name the parameter
const urlParams = new URLSearchParams(window.location.search);
const product_id = urlParams.get('productID');

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

function loadSuppliers(data) {
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
    for (i = 5, j = 1 ; i > 0 ; i--, j++) {

        // numeric-rating is where we will add the rating
        $('#overall-review').append(`
            <div class="star-rating" id="overall-${i}">
                <a>${i}</a>
                <span class="fa fa-star checked"></span>
                <a class="numeric-rating">${Math.floor(((Math.random() * 1000) + 1) % 100)}</a>
            </div>
        `);

        let starRating = $(`<span id="${j}" class="fa fa-star"></span>`).click(j, starRatingClick);
        if (j == 1) starRating.addClass('checked').addClass('active');
        $('#review-rating').append(starRating);
    }
}
function starRatingClick(event) {
    let currentClick = event.data;

    if ($(this).hasClass('checked')) {
        //we will for each star greater than this, remove the class 'checked' if it has it
        for (i = currentClick + 1 ; i < 6 ; i++) {
            let successor = $(`#review-rating span#${i}`);
            if (successor.hasClass('checked')) successor.toggleClass('checked').toggleClass('active');
        }
    } else {
        for (i = currentClick - 1 ; i > 0 ; i--) {
            let predeccessor = $(`#review-rating span#${i}`);
            if (!predeccessor.hasClass('checked')) predeccessor.toggleClass('checked').toggleClass('active');
        }
        $(this).toggleClass('checked').toggleClass('active');
    }
}

function webload() {
    $('button#clear').click(() => {
        $('textarea#review-content').val('');
    });
    
    $('button#submit').click(() => {
        let review = $('textarea#review-content').val();
        //TODO add functionality
        if (review != '') console.log(review);
    });


    //temp data just to prove ajax works
    // .then() we can set stuff there as in global data gets and stuff
    ajaxRequest({
        type: "Login",
        username: "genericOperator",
        password: "operator123"
    }).then((resp) => { console.log(resp) }, onfail);

    loadProductDetails();
    loadReviewDetails();
}

$(document).ready(webload);
