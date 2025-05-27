
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

function renderProducts(products) {
  const container = $('.products-container');
  container.empty();
  
  if (!products || products.length === 0) {
    container.html('<p>No products found.</p>');
    return;
  }
  
  products.forEach(product => {
    const fiveStarCount = product.ratings 
      ? product.ratings.filter(r => r.value === 5).length
      : 0;
    
    container.append(`
      <div class="product-card">
        <img src="${product.imageUrl || 'placeholder.jpg'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Price: $${(product.price || 0).toFixed(2)}</p>
        <p>${fiveStarCount} five-star ratings</p>
        <button class="view-details" data-upc="${product.upc}">View Details</button>
      </div>
    `);
  });
}


function loadTopProducts() {
  ajaxRequest({ type: "GetAllProducts" })
    .done(response => {
      if (response.status === "success" && response.data?.products) {
        // Filter products with at least one 5-star rating
        const productsWithFiveStars = response.data.products.filter(product => {
          return product.ratings && product.ratings.some(r => r.value === 5);
        });
        
        // Take first 5 products
        const topProducts = productsWithFiveStars.slice(0, 5);
        
        if (topProducts.length > 0) {
          renderProducts(topProducts);
        } else {
          $('.products-container').html("<p>No products with 5-star ratings found.</p>");
        }
      } else {
        console.error("Failed to load products:", response);
        $('.products-container').html("<p>No products found.</p>");
      }
    })
    .fail(() => {
      $('.products-container').html("<p>Failed to load products.</p>");
    });
}



$(document).ready(() => {
    loadTopFiveBestProd();
});