// user.js
const apiUrl = "https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php";

let originalProducts = [];
let categoryTree = [];

$(document).ready(() => {
  loadCategories();
  loadProducts();

  // client-side filter hooks
  $('#bar').on('input', applyFilters);
  $('#brand-select').on('change', applyFilters);
  $('#sort-select').on('change', applyFilters);
});

function ajaxRequest(input) {
  const username = "u24845061",
        password = "Carbon123";
  return $.ajax({
    url: apiUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa(username + ":" + password)
    },
    data: JSON.stringify(input)
  });
}

function loadProducts() {
  ajaxRequest({ type: "GetAllProducts" })
    .done(response => {
      if (response.status === "success" && response.data?.products) {
        originalProducts = response.data.products.slice();  // keep a copy
        initBrandDropdown(originalProducts);
        renderProducts(originalProducts);
      } else {
        console.error("Failed to load products:", response);
        $('.container').html("<p>No products found.</p>");
      }
    })
    .fail(() => {
      $('.container').html("<p>Failed to load products.</p>");
    });
}

function initBrandDropdown(products) {
  const brandSet = new Set(products.map(p => p.brand).filter(b => b));
  const sel = $('#brand-select').empty().append(`<option value="">All Brands</option>`);
  Array.from(brandSet).sort().forEach(b => {
    sel.append(`<option value="${b}">${b}</option>`);
  });
}

function loadCategories() {
  ajaxRequest({ type: "Categories", operation: "Get", apikey: "22e8ff82400fff" })
    .done(response => {
      if (response.status === "success" && Array.isArray(response.data)) {
        categoryTree = response.data;
        const $catContainer = $('#categories-container');
        renderCategoryTree(categoryTree, $catContainer);

        // Add the “Clear Category” button, hidden initially
        const $resetBtn = $('<button id="reset-categories">Show All Categories</button>')
          .hide()
          .css({ display: 'block', marginTop: '10px' })
          .on('click', () => {
            $resetBtn.hide();
            applyFilters(); 
          });
        $catContainer.append($resetBtn);
      } else {
        console.error("Failed to load categories:", response);
      }
    })
    .fail((_, textStatus, err) => {
      console.error("Category API error:", textStatus, err);
    });
}

function renderCategoryTree(tree, parent, level = 0) {
  tree.forEach(cat => {
    const btn = $(`<button class="category-button" style="margin-left:${level*15}px">${cat.category_name}</button>`);
    const childrenDiv = $(`<div class="child-categories" style="display:none"></div>`);

    btn.on('click', () => {
      childrenDiv.toggle();
      // show the reset button
      $('#reset-categories').show();
      applyFilters({ category_id: cat.category_id });
    });

    parent.append(btn, childrenDiv);

    if (Array.isArray(cat.children) && cat.children.length) {
      renderCategoryTree(cat.children, childrenDiv, level + 1);
    }
  });
}

function applyFilters(extra = {}) {
  let filtered = originalProducts.slice();

  // 1) Category?
  if (extra.category_id) {
    const allowed = getDescendantCategoryIds(extra.category_id);
    filtered = filtered.filter(p => allowed.includes(p.category.category_id));
  }

  // 2) Brand?
  const brand = $('#brand-select').val();
  if (brand) {
    filtered = filtered.filter(p => p.brand === brand);
  }

  // 3) Search term?
  const term = $('#bar').val().trim().toLowerCase();
  if (term) {
    filtered = filtered.filter(p =>
      p.product_name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  // 4) Sort?
  switch ($('#sort-select').val()) {
    case 'az':           filtered.sort((a,b)=> a.product_name.localeCompare(b.product_name)); break;
    case 'za':           filtered.sort((a,b)=> b.product_name.localeCompare(a.product_name)); break;
  }

  renderProducts(filtered);
}

function getDescendantCategoryIds(rootId) {
  const ids = [];
  const dfs = nodes => {
    for (let n of nodes) {
      if (n.category_id === rootId) {
        collect(n);
        return true;
      }
      if (n.children && dfs(n.children)) return true;
    }
    return false;
  };
  const collect = node => {
    ids.push(node.category_id);
    if (node.children) node.children.forEach(collect);
  };
  dfs(categoryTree);
  return ids;
}

function renderProducts(products) {
  const container = $('.container').empty();
  const brandSet = new Set();

  products.forEach(p => {
    brandSet.add(p.brand);
    container.append(`
      <div class="product-card data-upc="${p.upc}"">
        <div class="product-image">
          <img src="${p.img_url || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'}" alt="">
        </div>
        <div class="product-details">
          <h2 class="product-title">${p.product_name}</h2>
          <p class="product-description">${p.description || 'No description.'}</p>
          <p class="product-category">Category: ${p.category.category_name}</p>
          <div class="userbuttons userbuttons-classic">
            <a href="../view/view.html?upc=${p.upc}">
              <button class="compare">Compare</button>
            </a>
          </div>
        </div>
      </div>
    `);
  });

}