const urlParams = new URLSearchParams(window.location.search);
const product_id = urlParams.get('upc');


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


$(document).ready(() => {

    if (product_id == null){
        loadTopFiveBestProd();
    }
    else {
        loadReviewsForSpecificProduct();
    }
});