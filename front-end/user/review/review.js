const urlParams = new URLSearchParams(window.location.search);
const product_id = urlParams.get('upc');


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

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadStandardDashboard() {
    // Your standard dashboard initialization code
    console.log("Loading standard dashboard");
    // Example: fetch default data, render default widgets, etc.
}

// Product-specific dashboard load function
function loadProductDashboard(upc) {
    console.log(`Loading product dashboard for UCP: ${upc}`);
    // Example: fetch product-specific data, render product widgets, etc.
    
    // You might make an API call specific to this product
    fetch(`/api/products/${upc}`)
        .then(response => response.json())
        .then(data => {
            // Render your product-specific dashboard with this data
            renderProductDashboard(data);
        });
}

// Another variation if needed
function loadSpecialDashboard(options) {
    console.log("Loading special dashboard with options:", options);
    // Different dashboard implementation
}

function loadDashboard() {
    const upc = getUrlParameter('upc');
    const dashboardType = getUrlParameter('dashboard');
    
    if (upc) {
        // If UCP parameter exists, load product-specific dashboard
        loadProductDashboard(upc);
    } 
    else if (dashboardType === 'special') {
        // If special dashboard parameter exists
        loadSpecialDashboard({ /* options */ });
    }
    else {
        // Default dashboard
        loadStandardDashboard();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    if(product_id != null){
        
    }
});

// Or if you're using modules and modern JS:
window.addEventListener('load', loadDashboard);