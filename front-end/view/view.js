// TODO get rid of all unneccesary console.log

// Assume the product ID is in the URL as a query
// Change the .get('productID') with whatever we decide to name the parameter

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
    console.log(JSON.stringify(input));
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
    
    loadSuppliers();
}



function loadSuppliers() {
    ajaxRequest({
        type: "GetOffers",
        apikey: "def456uvw",
        upc: product_id
    }).then((resp) => {
        console.log(resp);
        
        
        $('#prices-container').empty();
        
        
        if (resp && resp.data && Array.isArray(resp.data)) {
            
            resp.data.forEach(offer => {
                $('#prices-container').append(`
                    <div class="price-supplier-container" id=${offer.retailer_name}>
                        <a>${offer.retailer_name}</a>
                        <a>R${offer.price.toFixed(2)}</a>
                    </div>
                `);
            });
        } else {
            console.error("No valid offer data received");
            $('#prices-container').append('<p>No pricing information available</p>');
        }
    }, onfail);
}

function loadReviewDetails() {

    ajaxRequest({
        type :"Reviews",
        apikey:"f986ee0fd3d677",
        operation:"Overall",
        "upc": 1001
    }).then((resp) => {
    
    for (i = 5, j = 1 ; i > 0 ; i--, j++) {
        count = 0;
        // numeric-rating is where we will add the rating
        resp.data.forEach(result => {
            if(parseInt(result.rating) == i)
                count++;
        })
        $('#overall-review').append(`
            <div class="star-rating" id="overall-${i}">
                <a>${i}</a>
                <span class="fa fa-star checked"></span>
                <a class="numeric-rating">${count}</a>
            </div>
        `);

        let starRating = $(`<span id="${j}" class="fa fa-star"></span>`).click(j, starRatingClick);
        if (j == 1) starRating.addClass('checked').addClass('active');
        $('#review-rating').append(starRating);
    }

    }, onfail)
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
            ajaxRequest({
                type: "Reviews",
                apikey: "f986ee0fd3d677",
                operation: "Add",
                rating: rating,
                review: review,
                username: "john_doe", //TODO change
                retailer_name: "Takealot" //TODO change
                
            }).then(() => {
                $('make-review').hide;
              }, onfail);
        }
    });


    //temp data just to prove ajax works
    // .then() we can set stuff there as in global data gets and stuff
    let product_id_tmp = 1001; //for now itll be this.
    ajaxRequest({
        type: "GetAllProducts",
        upc: product_id
    }).then((resp) => {
        loadProductDetails(resp.data.products[0]);
        loadReviewDetails(resp.data.products[0]);
    }, onfail);

    
}

$(document).ready(webload);
