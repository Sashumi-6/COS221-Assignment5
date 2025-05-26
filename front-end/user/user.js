const apiUrl = "https://wheatley.cs.up.ac.za/u24676111/api.php";
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
        apikey,
        ...filters
    };

    $.ajax({
        url: apiUrl,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: (response) => {
            if (response.status) {
                renderProducts(response.message.products);
            } else {
                $('.container').html("<p>No products found.</p>");
            }
        },
        error: () => {
            $('.container').html("<p>Failed to load products.</p>");
        }
    });
}

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
                    <img src="${prod.image_url || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'}" alt="Product Image">
                </div>
                <div class="product-details">
                    <h2 class="product-title">${prod.product_name}</h2>
                    <p class="product-price">R${prod.price}</p>
                    <p class="product-description">${prod.description || "No description provided."}</p>
                    <div class="userbuttons userbuttons-classic">
                        <button class="compare">Compare</button>
                    </div>
                </div>
            </div>
        `);
        container.append(card);
    });

    updateBrandDropdown(brandSet);
}

function updateBrandDropdown(brands) {
    const brandSelect = $('#brand-select');
    brandSelect.empty().append(`<option value="">Filter by Brand</option>`);
    Array.from(brands).sort().forEach(brand => {
        brandSelect.append(`<option value="${brand}">${brand}</option>`);
    });
}

function loadCategories() {
    $.ajax({
        url: apiUrl,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ type: "Categories", Operation: "Get", apikey }),
        success: (response) => {
            if (response.status && Array.isArray(response.message)) {
                const categoryTree = buildCategoryTree(response.message);
                renderCategoryTree(categoryTree);
            }
        }
    });
}

// Organize categories into a tree structure
function buildCategoryTree(categories) {
    const map = {}, tree = [];

    categories.forEach(cat => {
        cat.children = [];
        map[cat.category_name] = cat;
    });

    categories.forEach(cat => {
        if (cat.parent_category_name && map[cat.parent_category_name]) {
            map[cat.parent_category_name].children.push(cat);
        } else {
            tree.push(cat);
        }
    });

    return tree;
}

function renderCategoryTree(tree, parent = $("#categories-container #list-items"), level = 0) {
    tree.forEach(cat => {
        const entry = $(`<div style="margin-left: ${level * 15}px; cursor: pointer;" class="category-item">${cat.category_name}</div>`);
        entry.click(() => {
            applyFilters({ category_id: cat.category_id, include_subcategories: true });
        });
        parent.append(entry);

        if (cat.children.length > 0) {
            renderCategoryTree(cat.children, parent, level + 1);
        }
    });
}

// Collect and apply all filters
function applyFilters(extra = {}) {
    const searchTerm = $('#bar').val().trim().toLowerCase();
    const selectedBrand = $('#brand-select').val();
    const sortOption = $('#sort-select').val();

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
