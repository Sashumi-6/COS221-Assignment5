// TODO get rid of all unneccesary console.log

// Assume the product ID is in the URL as a query
// Change the .get('productID') with whatever we decide to name the parameter
const urlParams = new URLSearchParams(window.location.search);
const product_id = urlParams.get('upc');

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

function loadProductDetails(data) {
    // obv pass thru data from the ajax call then use that rather than the tmp data ive defined
    console.log(data);
    let product = $(`
            <div id="product-image">
                <img src="${data.image_url}" alt="Product_image">
            </div>
            <div id="product-data">
                <a style="font-size: 1.4em;">${data.product_name}</a>
                <a id="product-description">${data.description}</a>
                <div id="categories-container"></div>
                <a>${data.brand}</a>
                <a style="font-size: 0.9em;">${data.dimensions}</a>
            </div>
        `);
    
    //setting categories
    let categories = product.find('#categories-container');
    // TODO We only get the categories name and its parent. for now okay but eventuall get the hiearchy :p
    categories.append(`<a>${data.category.category_name}</a>`);
    categories.append(`<a>${data.category.parent_category}</a>`);

    //adding to body
    $('#product-details-container').append(product);

    //data will have supplier details - pass suppliers and prices
    loadSuppliers(data.supplier);
}

function loadSuppliers(data) {
    // TODO what if multiple categories..?
    $('#prices-container')
    .append(`
        <div class="price-supplier-container">
            <a>${supplier.name}</a>
            <a>${supplier.price}</a>
        </div>
    `);
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
    $('#user-rating').text(currentClick);

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
    $('iframe').attr('src', `../user/review/review.html?upc=${product_id || "null"}`);

    $('button#clear').click(() => {
        $('textarea#review-content').val('');
    });
    
    $('button#submit').click(() => {
        let review = $('textarea#review-content').val();
        let rating = $('user-rating').text();
        if (review != '') {
            // ajaxRequest({
            // TODO
            // }).then(() => {  }, onfail);
        }
    });


    //temp data just to prove ajax works
    // .then() we can set stuff there as in global data gets and stuff
    let product_id_tmp = 1001; //for now itll be this.
    ajaxRequest({
        type: "GetAllProducts",
        upc: product_id_tmp
    }).then((resp) => {
        loadProductDetails(resp.data.products[0]);
        loadReviewDetails(resp.data.products[0]);
    }, onfail);
}

$(document).ready(webload);