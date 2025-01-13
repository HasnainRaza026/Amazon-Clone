function renderProducts(products) {
    const mainElem = document.querySelector(".home-product-grid");
    const fragment = document.createDocumentFragment(); //DocumentFragment is DOM-like structure (Not part of actual DOM tree) that acts as a temporary container for DOM elements. We do all upadates in it then finally append it to the actual DOM. If I directly update the DOM each time, the browser will trigger a reflow and repaint, which can degrade performance

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'home-body-divs';
        card.id = `${product.id}`;
        card.innerHTML = renderProductCard(product);
        fragment.appendChild(card);
    });

    mainElem.appendChild(fragment);
}


function renderStars(rating) {
    const starImages = {
        3.5: "Assets/Body_Assets/Rating_Stars/rating-35.png",
        4: "Assets/Body_Assets/Rating_Stars/rating-4.png",
        4.5: "Assets/Body_Assets/Rating_Stars/rating-45.png",
        5: "Assets/Body_Assets/Rating_Stars/rating-5.png"
    };
    return starImages[rating] || starImages[5]; // Default to 5 stars
}


function renderVariations(variations, productId) {
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


function renderProductCard(product) {
    const stars = renderStars(product.rating.stars || 5);
    const price = (product.priceCents ? (product.priceCents / 100).toFixed(2) : "N/A");
    const variations = product.variations ? renderVariations(product.variations, product.id) : '';

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