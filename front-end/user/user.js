const apiUrl = "https://wheatley.cs.up.ac.za/u24676111/api.php";
const apikey = sessionStorage.getItem("apikey");

$(document).ready(() => {
    loadCategories();
    loadProducts();

    // Setup filter listener
    $('#bar').on('input', applyFilters);
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
    const container = $(".container");
    container.empty();

    products.forEach(prod => {
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

    const filters = {
        ...extra,
        apikey
    };

    if (searchTerm) {
        filters.product_name = searchTerm;
    }

    // You can add UI dropdowns/sliders for price and brand
    // For now, simulate filters manually or expand this function later

    loadProducts(filters);
}
