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
function renderCheckoutProducts(products) {
    const productDiv = document.querySelector(".checkout-products");
    productDiv.innerHTML = "";
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product';
        card.innerHTML = renderCheckoutCard(product);
        fragment.appendChild(card);
    });
    productDiv.appendChild(fragment);

    
    const mainDiv = document.querySelector(".checkout-content-div");
    fragment.innerHTML = "";
    const total = document.createElement('div');
    total.className = 'checkout-total';
    total.innerHTML = renderCheckoutTotal();
    fragment.appendChild(total);
    mainDiv.appendChild(fragment);

}

function renderCheckoutVariations(variation) {
    return Object.entries(variation).map(([type, value], _) => `
        <p class="variation">${type}: ${value}</p>
        `).join('');
}

function checkoutItemsTotal() {
    
}

function renderCheckoutTotal() {
    const itemsTotal = checkoutItemsTotal()
    return `
        <div class="checkout-total-heading">Order Summary</div>
        <div class="checkout-price">
            <p>Items (3):</p>
            <p>$72.00</p>
        </div>
        <div class="checkout-price">
            <p>Shipping & handling:</p>
            <p>$9.99</p>
        </div>
        <hr class="bar">
        <div class="checkout-price">
            <p>Total before tax:</p>
            <p>$81.99</p>
        </div>
        <div class="checkout-price">
            <p>Estimated tax (10%):</p>
            <p>$8.20</p>
        </div>
        <hr>
        <div class="checkout-price check-price-total">
            <p>Order total:</p>
            <p>$90.19</p>
        </div>
        <button class="order">Place your order</button>
    `
}


function renderCheckoutCard(product) {
    const variations = product.variation ? renderCheckoutVariations(product.variation) : '';
    return `
    <div class="delivery">Delivery date: ${getDate(9)}</div>
    <div class="details">
        <div class="product-details">
            <img src="${product.image}" alt="product-image">
            <div>
                <p class="name">${product.name}</p>
                <p class="price">${product.price}</p>
                ${variations}
                <p class="variation">Quantity: ${product.quantity}<a href="#">Update</a><a href="#">Delete</a></p>
            </div>
        </div>
        <div class="COD-options">
            <div>
                <p class="heading">Choose a delivery option:</p>
                <div class="option">
                    <input type="radio">
                    <div>
                        <p class="date">${getDate(9)}</p>
                        <p class="shipping-fee">FREE Shipping</p>
                    </div>
                </div>
                <div class="option">
                    <input type="radio">
                    <div>
                        <p class="date">${getDate(5)}</p>
                        <p class="shipping-fee">$4.99 - Shipping</p>
                    </div>
                </div>
                <div class="option">
                    <input type="radio">
                    <div>
                        <p class="date">${getDate(1)}</p>
                        <p class="shipping-fee">$9.99 - Shipping</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}