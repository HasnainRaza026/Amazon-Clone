let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;
let orderedProducts = JSON.parse(localStorage.getItem("orderedProducts")) || [];
let trackingProduct = JSON.parse(localStorage.getItem("trackingProduct")) || {};


// =============================> Event Listners <==============================
document.addEventListener("DOMContentLoaded", async () => {
    const products = await fetchJSON('./Data/products.json');
    const bodyId = document.body.getAttribute("id");

    // Event Listners for the index.html 
    if (bodyId === "home") {
        document.querySelector(".js-cart-quantity").innerText = cartQuantity;
        document.querySelector(".js-cart-quantity-sm").innerText = cartQuantity;
        
        if (products) renderHomeProducts(products);

        document.querySelector(".js-hamburger-icon").addEventListener("click", () => {
            const topBar = document.querySelector(".js-top-bar");
            topBar.classList.toggle("show"); // Toggle the 'show' class (adds and removes the class from element)
        });

        document.querySelector(".home-product-grid").addEventListener("click", (event) => {
            if (event.target.matches(".js-add-to-cart-btn")) {
                handleAddToCart(event.target);
            } else if (event.target.matches(".js-variation")) {
                handleVariationClick(event.target, products);
            }
        });

        document.querySelector(".js-search-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const searchedProducts = handleSearchProducts(products);
                renderHomeProducts(searchedProducts);
            }
        });

        document.querySelector(".js-search-button").addEventListener("click", (_) => {
            const searchedProducts = handleSearchProducts(products);
            renderHomeProducts(searchedProducts);
        });
    } 
    
    // Event Listners for the checkout.html 
    else if (bodyId === "checkout") {
        renderCheckoutProducts();

        document.querySelector(".checkout-content-div").addEventListener("click", (event) => {
            if (event.target.matches(".js-checkout-delt")) {
                handleDeleteClick(event.target);
            } else if (event.target.matches(".js-checkout-update")) {
                handleUpdateClick(event.target);
            } else if (event.target.matches(".js-checkout-shipping")) {
                handleShipping(event.target);
            } else if (event.target.matches(".js-place-order")) {
                handlePlaceOrder();
            }
        });
    }

    // Event Listners for the orders.html
    else if (bodyId === "orders") {
        renderOrderedProducts();

        document.querySelector(".orders-products-all").addEventListener("click", (event) => {
            if (event.target.matches(".js-buy-again")) {
                handleBuyAgain(event.target);
            } else if (event.target.matches(".js-track-order")) {
                handleTrackOrder(event.target);
            }
        });

        document.querySelector(".js-search-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const searchedProducts = handleSearchProducts(products);
                window.location.href = "index.html";
            }
        });

        document.querySelector(".js-search-button").addEventListener("click", (_) => {
            const searchedProducts = handleSearchProducts(products);
            window.location.href = "index.html";
        });
    }

    else if (bodyId === "track") {
        renderTrackOrders(trackingProduct);

        document.querySelector(".js-search-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const searchedProducts = handleSearchProducts(products);
                window.location.href = "index.html";
            }
        });

        document.querySelector(".js-search-button").addEventListener("click", (_) => {
            const searchedProducts = handleSearchProducts(products);
            window.location.href = "index.html";
        });
    }
});


// =============================> Home Event Listner Functions <==============================
function handleAddToCart(target) {
    const id = target.dataset.productId; // We can't use 'this' keyword because the function is listening for the click events on the entire document, hence we use 'event.target'
    const productElem = document.getElementById(id);
    
    cartQuantity += Number(productElem.querySelector("select").value);
    updateCartQuantity(cartQuantity);
    displayAddedToCart(productElem);

    const productDetails = getProductDetails(productElem, id);
    if (!productDetails) {
        console.error(`Failed to extract details for product ID ${id}`);
        return;
    }

    cartProducts.push(productDetails);
    updateLocalStorage()
}


function handleVariationClick(target, products) {
    const id = target.dataset.productId;
    const variationNumber = target.getAttribute("variation-number");
    const variationType = document.getElementById(id)
        .querySelector(`.js-variation-number-${variationNumber}`)
        .querySelector(".js-variation-type").innerText;

    const variationElems = document.getElementById(id)
        .querySelector(`.js-variation-number-${variationNumber}`)
        .querySelectorAll(".js-variation");

    variationElems.forEach(elem => {
        elem.style.border = "1px solid #adb1b8";
        elem.setAttribute("selected", "false");
    });

    target.style.border = "3px solid #e77502";
    target.setAttribute("selected", "true");

    const variationValue = target.innerText;
    const image = getVariationImage(products, id, variationType, variationValue);

    if (image) {
        document.getElementById(id).querySelector(".js-product-image").src = image;
    }
}

function handleSearchProducts(products) {
    const searchInput = document.querySelector(".js-search-input").value.toLowerCase();
    if (!searchInput) return;

    let searchedProducts = [];
    products.forEach(product => {
        (product.keywords).forEach(keyword => {
            if (searchInput === keyword) searchedProducts.push(product);
        })
    });

    return searchedProducts;
}


// =============================> Checkout Event Listner Functions <==============================
function handleDeleteClick(target) {
    const id = target.dataset.productId;
    const product = cartProducts.find(p => p.id === id);
    if (!product) return;

    cartQuantity -= product.quantity;
    cartProducts.splice(cartProducts.indexOf(product), 1);

    updateLocalStorage();
    renderCheckoutProducts();
}


function handleUpdateClick(target) {
    const id = target.dataset.productId;
    const quantityElem = document.getElementById(id).querySelector(".js-checkout-quantity-update");
    
    if (quantityElem.tagName === "SPAN") {
        target.innerText = "Save";
        quantityElem.outerHTML = `<input type="number" class="js-checkout-quantity-update" product-id="${id}" style="width: 40px; height: 20px; padding-left: 5px" placeholder="${quantityElem.innerText}" min="1" max="10">`;
    } 
    else {
        let quantity = parseInt(quantityElem.value) || 1;
        if (quantity < 1 || quantity > 10) return alert("Quantity must be between 1 and 10.");

        target.innerText = "Update";
        let totalQuantity = 0;

        cartProducts.forEach(product => {
            if (product.id === id) product.quantity = quantity;
            totalQuantity += Number(product.quantity);
        });
        cartQuantity = totalQuantity;
        updateLocalStorage()

        quantityElem.outerHTML = `<span class="js-checkout-quantity-update">${quantity}</span>`;
        renderCheckoutProducts();
    }  
}

function handleShipping(target) {
    const id = target.dataset.productId;
    cartProducts.forEach(product => {
        if (product.id === id) product.shippingFee = Number(target.value);
    });
    
    updateLocalStorage();
    renderCheckoutProducts();
}

function handlePlaceOrder() {
    if (cartProducts.length === 0) return;
    let tempArray = [];

    cartProducts.forEach(product => {
        tempArray.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity,
            variation: product.variation,
            shippingFee: product.shippingFee,
            arrivalDate: `${product.shippingFee===0 ? getDate(9) : product.shippingFee===4.99 ? 
                                getDate(5) : getDate(1)}`
        })
    })

    tempArray = [
        {
            totalPrice: document.querySelector(".js-grand-total").innerText,
            orderPlacedDate: getDate(),
            orderId: crypto.randomUUID(), // Generates a random UUID
        },
        ...tempArray // Spread Operator add previous elements of array
    ];

    orderedProducts = [tempArray, ...orderedProducts];

    cartProducts = [];
    cartQuantity = 0;
    updateLocalStorage();
    renderCheckoutProducts();
}


// =============================> Orders Event Listner Functions <==============================
function handleBuyAgain(target) {
    const id = target.dataset.productId;

    target.innerHTML = `<img src="Assets/Body_Assets/Others/buy-again.png" alt="icon">🗸 Addded`
    setTimeout(() => {
        target.innerHTML = `<img src="Assets/Body_Assets/Others/buy-again.png" alt="icon">Buy it again`;
    }, 2000);

    orderedProducts.forEach(products => {
        products.forEach(product  => {
            if (product.id === id) {
                cartProducts.push(product);
                cartQuantity += Number(product.quantity);
            }
        });
    });

    updateLocalStorage()
    document.querySelector(".js-cart-quantity").innerText = cartQuantity;
    document.querySelector(".js-cart-quantity-sm").innerText = cartQuantity;
}

function handleTrackOrder(target) {
    const id = target.dataset.productId;
    let product = {};

    orderedProducts.forEach(products => {
        product = products.find(p => p.id === id) || product
    })

    trackingProduct = product;
    updateLocalStorage()
    window.location.href = "tracking.html";
}