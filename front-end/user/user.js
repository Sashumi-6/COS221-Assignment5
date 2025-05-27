const apiUrl = "https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php";
const apikey = sessionStorage.getItem("apikey");
let allProductsCache = [];
$(document).ready(() => {
    loadCategories();
    loadProducts();

    // Setup filter listener
    $('#bar').on('input', applyFilters);
    $('#sort-select').on('change', applyFilters);
    $('#brand-select').on('change', applyFilters);
});

function loadProducts(filters = {}) {
    const requestData = {
        type: "GetAllProducts",
        ...filters
    };

    ajaxRequest(requestData)
    .done((response) => {
        if (response.status && response.data && response.data.products) {
            renderProducts(response.data.products);
        } else {
            console.error("Failed to load products:", response);
            $('.container').html("<p>No products found.</p>");
        }
    })
    .fail(() => {
        $('.container').html("<p>Failed to load products.</p>");
    });

}//end loadProducts
function ajaxRequest(input) {
    let username = "u24845061", password = "Carbon123";
    let settings = {
        url: apiUrl,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: JSON.stringify(input),
    };

    return $.ajax(settings);
}//end ajaxRequest

function renderProducts(products) {
    allProductsCache = products;
    const container = $(".container");
    container.empty();

    const brandSet = new Set();

    products.forEach(prod => {
        brandSet.add(prod.brand);

        const card = $(`
            <div class="product-card">
                <div class="product-image">
                    <img src="${prod.img_url || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'}" alt="Product Image">
                </div>
                <div class="product-details">
                    <h2 class="product-title">${prod.product_name}</h2>
                    <p class="product-description">${prod.description || "No description provided."}</p>
                    <p class="product-category">Category: ${prod.category?.category_name || "Uncategorized"}</p>
                    <div class="userbuttons userbuttons-classic">
                    <div class="userbuttons userbuttons-classic">
                        <button class="compare">Compare</button>
                    </div>
                </div>
            </div>
        `);
        container.append(card);
    });

    updateBrandDropdown(brandSet);
}//end renderProducts

function updateBrandDropdown(brands) {
    const brandSelect = $('#brand-select');
    brandSelect.empty().append(`<option value="">Filter by Brand</option>`);
    Array.from(brands).sort().forEach(brand => {
        brandSelect.append(`<option value="${brand}">${brand}</option>`);
    });
}//end updateBrandDropDown

function loadCategories() {
    const requestData = {
        type: "GetCategories",
       apikey:"a22e8ff82400fff"// Make sure this variable is valid and consistent
    };

    ajaxRequest(requestData)
    .done((response) => {
        if (response.status && Array.isArray(response.data)) {
            //const categoryTree = buildCategoryTree(response.data);
            renderCategoryTree(response.data);
        } else {
            console.error("Failed to load categories: Invalid response format", response);
        }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.error("AJAX error while loading categories:", textStatus, errorThrown);
    });
}//end loadCategories

function renderCategoryTree(tree, parent = $("#categories-container"), level = 0) {
    tree.forEach(cat => {
        const entry = $(`<button class="category-button" style="margin-left: ${level * 15}px;">${cat.category_name}</button>`);
        
        const childrenContainer = $(`<div class="child-categories" style="display: none;"></div>`);

        entry.on('click', function () {
            // Toggle visibility of children
            childrenContainer.toggle();

            // Filter products for this category
            applyFilters({ category_id: cat.category_id, include_subcategories: true });
        });

        parent.append(entry);
        parent.append(childrenContainer);

        if (cat.children.length > 0) {
            renderCategoryTree(cat.children, childrenContainer, level + 1);
        }
    });
}//end renderCategories

// Collect and apply all filters
function applyFilters(extra = {}) {
    const searchTerm = $('#bar').val().trim().toLowerCase();
    const selectedBrand = $('#brand-select').val();
    const sortOption = $('#sort-select').val();

    // If extra filters are passed (like category), fetch filtered products from API
    if (Object.keys(extra).length > 0) {
        loadProducts(extra);
        return;
    }


    let filtered = [...allProductsCache];

    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.product_name.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm)
        );
    }

    if (selectedBrand) {
        filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Sorting
    switch (sortOption) {
        case "az":
            filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
            break;
        case "za":
            filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
            break;
        case "priceLowHigh":
            filtered.sort((a, b) => a.price - b.price);
            break;
        case "priceHighLow":
            filtered.sort((a, b) => b.price - a.price);
            break;
    }

    renderProducts(filtered);
}

// $(document).ready(webLoad);