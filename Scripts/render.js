// ======================> Render Functions for index.html <=========================
function renderHomeProducts(products) {
    const mainElem = document.querySelector(".home-product-grid");
    const fragment = document.createDocumentFragment(); //DocumentFragment is DOM-like structure (Not part of actual DOM tree) that acts as a temporary container for DOM elements. We do all upadates in it then finally append it to the actual DOM. If I directly update the DOM each time, the browser will trigger a reflow and repaint, which can degrade performance

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'home-body-divs';
        card.id = `${product.id}`;
        card.innerHTML = renderHomeCard(product);
        fragment.appendChild(card);
    });

    mainElem.appendChild(fragment);
}

function renderHomeStars(rating) {
    const starImages = {
        3.5: "Assets/Body_Assets/Rating_Stars/rating-35.png",
        4: "Assets/Body_Assets/Rating_Stars/rating-4.png",
        4.5: "Assets/Body_Assets/Rating_Stars/rating-45.png",
        5: "Assets/Body_Assets/Rating_Stars/rating-5.png"
    };
    return starImages[rating] || starImages[5]; // Default to 5 stars
}

function renderHomeVariations(variations, productId) {
    return Object.entries(variations).map(([type, values], index) => `
        <div class="home-body-div-variation js-variations-div js-variation-number-${index + 1}">
            <p class="js-variation-type">${type}</p>
            ${values.map(val => `
                <div class="js-variation" 
                     variation-number="${index + 1}" 
                     product-id="${productId}"
                     selected="false">
                     ${val}
                </div>`).join('')}
        </div>
    `).join('');
}

function renderHomeCard(product) {
    const stars = renderHomeStars(product.rating.stars || 5);
    const price = (product.priceCents ? (product.priceCents / 100).toFixed(2) : "N/A");
    const variations = product.variations ? renderHomeVariations(product.variations, product.id) : '';

    return `
        <div class="home-body-div-img"><img class="js-product-image" src="${product.image}" alt="${product.name}"></div>
        <div class="home-body-div-content">
            <div class="home-body-div-title js-product-name">${product.name}</div>
            <div class="home-body-div-rating">
                <img src="${stars}" alt="rating">
                <a href="#">${product.rating.count}</a>
            </div>
            <div class="home-body-div-price js-product-price">$${price}</div>
            <div class="home-body-div-quantity">
                <select name="product-quantity" id="quantity">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>
            ${variations}
        </div>
        <div class="home-body-div-add">
            <div class="home-body-div-added">
                    <img class="js-added-to-cart" src="Assets/Body_Assets/Others/checkmark.png" alt="added">
                    <p class="js-added-to-cart">Added</p>
            </div>
            <div><button class="js-add-to-cart-btn" product-id="${product.id}">Add to Cart</button></div>
        </div>`;
}



// ======================> Render Functions for checkout.html <=========================
function renderCheckoutProducts() {
    document.querySelector(".js-checkout-item-quantity").innerText = cartQuantity + " items";

    let totalPrice = 0;
    let totalShippingFee = 0;

    const productDiv = document.querySelector(".checkout-products");
    productDiv.innerHTML = "";

    if (cartProducts.length === 0) {
        productDiv.innerHTML += renderCheckoutEmpty();
        renderCheckoutSummery(totalPrice, totalShippingFee);
        return;
    }

    const fragment = document.createDocumentFragment();
    cartProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product';
        card.id = `${product.id}`;
        card.innerHTML = renderCheckoutCard(product);
        fragment.appendChild(card);

        totalPrice += checkoutItemPrice(product) // calculate total price of all products
        totalShippingFee += product.shippingFee;
    });

    productDiv.appendChild(fragment);
    renderCheckoutSummery(totalPrice, totalShippingFee)
}

function renderCheckoutEmpty() {
    return `
        <div class="empty-div">
            <p class="empty">Your cart is empty.</p>
            <a href="index.html" class="empty-button">View products</a>
        </div>`;
}

function renderCheckoutSummery(totalPrice, totalShippingFee) {
    const mainDiv = document.querySelector(".checkout-summery");
    mainDiv.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const total = document.createElement('div');
    total.className = 'checkout-total';
    total.innerHTML = renderCheckoutTotal(totalPrice, totalShippingFee);
    fragment.appendChild(total);
    mainDiv.appendChild(fragment);
}

function renderCheckoutVariations(variation) {
    return Object.entries(variation).map(([type, value], _) => `
        <p class="variation">${type}: ${value}</p>
        `).join('');
}

function checkoutItemPrice(product) {
    return product.quantity===1 ? Number(product.price.replace('$', '')) : Number(product.price.replace('$', '')) * product.quantity;
}

function renderCheckoutTotal(totalPrice, totalShippingFee) {
    return `
        <div class="checkout-total-heading">Order Summary</div>
        <div class="checkout-price">
            <p>Items (3):</p>
            <p>$${totalPrice.toFixed(2)}</p>
        </div>
        <div class="checkout-price">
            <p>Shipping & handling:</p>
            <p>$${totalShippingFee.toFixed(2)}</p>
        </div>
        <hr class="bar">
        <div class="checkout-price">
            <p>Total before tax:</p>
            <p>$${totalPrice.toFixed(2)}</p>
        </div>
        <div class="checkout-price">
            <p>Estimated tax (10%):</p>
            <p>$${(totalPrice * 0.1).toFixed(2)}</p>
        </div>
        <hr>
        <div class="checkout-price check-price-total">
            <p>Order total:</p>
            <p class="js-grand-total">$${((totalPrice * 0.1) + totalShippingFee + totalPrice).toFixed(2)}</p>
        </div>
        <button class="order js-place-order" ${totalPrice || "disabled"}>Place your order</button>
    `
}

function renderCheckoutCard(product) {
    const variations = product.variation ? renderCheckoutVariations(product.variation) : '';
    let date = "";
    if (product.shippingFee === 0) {
        date = getDate(9);
    } else if (product.shippingFee === 4.99) {
        date = getDate(5);
    } else {
        date = getDate(1);
    }

    return `
    <div class="delivery">Delivery date: ${date}</div>
    <div class="details">
        <div class="product-details">
            <img src="${product.image}" alt="product-image">
            <div>
                <p class="name">${product.name}</p>
                <p class="price">${product.price}</p>
                ${variations}
                <p class="variation">Quantity: <span class="js-checkout-quantity-update">${product.quantity}</span>
                    <a class="js-checkout-update" product-id="${product.id}">Update</a>
                    <a class="js-checkout-delt" product-id="${product.id}">Delete</a>
                </p>
            </div>
        </div>
        <div class="COD-options">
            <div class="js-shippings">
                <p class="heading">Choose a delivery option:</p>
                <div class="option" id="1">
                    <input type="radio" name="shipping-${product.id}" value="0" class="js-checkout-shipping" product-id="${product.id}" ${product.shippingFee === 0 ? "checked" : ""}>
                    <div>
                        <p class="date">${getDate(9)}</p>
                        <p class="shipping-fee">FREE Shipping</p>
                    </div>
                </div>
                <div class="option" id="2">
                    <input type="radio" name="shipping-${product.id}" value="4.99" class="js-checkout-shipping" product-id="${product.id}" ${product.shippingFee === 4.99 ? "checked" : ""}>
                    <div>
                        <p class="date">${getDate(5)}</p>
                        <p class="shipping-fee">$4.99 - Shipping</p>
                    </div>
                </div>
                <div class="option" id="3">
                    <input type="radio" name="shipping-${product.id}" value="9.99" class="js-checkout-shipping" product-id="${product.id}" ${product.shippingFee === 9.99 ? "checked" : ""}>
                    <div>
                        <p class="date">${getDate(1)}</p>
                        <p class="shipping-fee">$9.99 - Shipping</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}



// ======================> Render Functions for orders.html <=========================
function renderOrderedProducts() {
    document.querySelector(".js-cart-quantity").innerText = cartQuantity;
    document.querySelector(".js-cart-quantity-sm").innerText = cartQuantity;

    const orderedProductsDiv = document.querySelector(".orders-products-all");
    orderedProductsDiv.innerHTML = "";

    if (orderedProducts.length === 0) return;
    const fragment = document.createDocumentFragment();

    orderedProducts.forEach(products => {
        const card = document.createElement('div');
        card.className = 'orders-product';

        products.forEach (product => {
            if (product.orderId) card.innerHTML = renderOrderedProductsHead(product);
            else card.innerHTML += renderOrderedProductsBody(product);
        })
        
        fragment.appendChild(card);
    });

    orderedProductsDiv.appendChild(fragment);
}

function renderOrderedProductsVariations(variation) {
    return `
    <div class="orders-product-details-variations">
        ${Object.entries(variation).map(([type, value], _) => `
            <p class="orders-product-details-other-info">${type}: ${value}</p>
            `).join('')}
    </div>`
}

function renderOrderedProductsHead(headData) {
    return `
    <div class="orders-product-head">
        <div class="total-and-date">
            <div class="date">
                <p class="head-heading">Order Placed:</p>
                <p class="head-value">${headData.orderPlacedDate}</p>
            </div>
            <div class="total-price">
                <p class="head-heading">Total:</p>
                <p class="head-value">${headData.totalPrice}</p>
            </div>
        </div>
        <div class="order-uuid">
            <p class="head-heading">Order ID:</p>
            <p class="head-value">${headData.orderId}</p>
        </div>
    </div>`
}

function renderOrderedProductsBody(bodyData) {
    const variations = bodyData.variation ? renderOrderedProductsVariations(bodyData.variation) : '';
    return `
    <div class="orders-products-data-all" id="${bodyData.id}">
        <div class="orders-product-data">
            <div class="orders-product-details">
                <img src="${bodyData.image}" alt="image">
                <div class="orders-product-details-data">
                    <p class="orders-product-details-name">${bodyData.name}</p>
                    <p class="orders-product-details-other-info">${bodyData.arrivalDate}</p>
                    ${variations}
                    <p class="orders-product-details-other-info">Quantity: ${bodyData.quantity}</p>
                    <button class="buy-again-button js-buy-again" product-id="${bodyData.id}"><img src="Assets/Body_Assets/Others/buy-again.png" alt="icon">Buy it again</button>
                </div>
            </div>
            <button class="track-order js-track-order" product-id="${bodyData.id}">Track package</button>
        </div>
    </div>
    `
}

// ======================> Render Functions for orders.html <=========================
function renderTrackOrders(product) {
    // console.log(product);
    document.querySelector(".js-cart-quantity").innerText = cartQuantity;
    document.querySelector(".js-cart-quantity-sm").innerText = cartQuantity;

    const trackOrderMain = document.querySelector(".track-main");
    trackOrderMain.innerHTML = "";

    if (product.length === 0) return;
    trackOrderMain.innerHTML = renderTrackProduct(product);
}

function renderTrackVariations(variation) {
    return Object.entries(variation).map(([type, value], _) => `
        <p class="track-data">${type}: ${value}</p>
        `).join('');
}

function renderTrackProduct(product) {
    const variations = product.variation ? renderTrackVariations(product.variation) : '';
    return `
    <div class="track-main-div">
        <a href="orders.html" class="track-link">View all orders</a>
        <p class="track-arrival">${product.name}</p>
        <p class="track-data">${product.name}</p>
        ${variations}
        <p class="track-data">Quantity: ${product.quantity}</p>
        <img src="${product.image}" alt="image">
    <div>
    `
}