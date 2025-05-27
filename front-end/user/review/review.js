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
    console.log(JSON.stringify(input));
    return $.ajax(settings);
}

function onfail(jqXHR, status, err) { console.log(status + ": " + err) }

function loadReviewsForSpecificProduct() {
    ajaxRequest({
        type: "Reviews",
        apikey: "f986ee0fd3d677",
        operation: "Get",
        upc: 1001
    }).then((resp) => {
        console.log(resp);
        $(".scroll-wrapper").empty(); 
        
        resp.data.forEach(rev => {
            let stars = "";
            
            for (let i = 0; i < parseInt(rev.rating); i++) {
                stars += "⭐";
            }
           
            for (let j = 0; j < 5 - parseInt(rev.rating); j++) {
                stars += "☆";
            }
         
            const review = $(`
                <div class="review-card">
                    <div class="review-header">
                        <span class="reviewer-name">${rev.username}</span>
                        <div class="retailer-info">
                            <span class="retailer-name">${rev.retailer_name}</span>
                            <span class="star-rating">${stars}</span>
                        </div>
                    </div>
                    <div class="review-content">
                        ${rev.review}
                    </div>
                </div>
            `);
            
            $(".scroll-wrapper").append(review);
        });
    }, onfail);
}

function loadTopProducts() {
  ajaxRequest({ type: "GetAllProducts" })
    .done(response => {
      if (response.status === "success" && response.data?.products) {
        // Get products with at least one 5-star rating
        const productsWithFiveStars = response.data.products.filter(product => {
          return product.ratings && product.ratings.some(r => r.value === 5);
        });
        
        // Take first 5 (or all if less than 5)
        const topProducts = productsWithFiveStars.slice(0, 5);
        
        if (topProducts.length > 0) {
          renderProducts(topProducts);
        } else {
          $('.container').html("<p>No products with 5-star ratings found.</p>");
        }
      } else {
        console.error("Failed to load products:", response);
        $('.container').html("<p>No products found.</p>");
      }
    })
    .fail(() => {
      $('.container').html("<p>Failed to load products.</p>");
    });
}

function renderProducts(products) {
  const container = $('.products-container');
  container.empty();
  
  if (products.length === 0) {
    container.html('<p>No products found.</p>');
    return;
  }
  
  products.forEach(product => {
    const fiveStarCount = product.ratings 
      ? product.ratings.filter(r => r.value === 5).length
      : 0;
    
    container.append(`
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>${fiveStarCount} five-star ratings</p>
        <!-- other product details -->
      </div>
    `);
  });
}

$(document).ready(() => {

    if (product_id == null){
        loadTopFiveBestProd();
    }
    else {
        console.log("hello");
        loadReviewsForSpecificProduct();
        
    }
});
