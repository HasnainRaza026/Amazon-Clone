fetchJSON('./Data/products.json').then(data => {
    if (data) renderProducts(data);
});


function renderProducts(products) {
    const mainElem = document.querySelector(".home-product-grid")
    products.forEach(product => {

        let variationElem = "";
        if (product.variations) {
            let div = "";
            let count = 1;
            Object.entries(product.variations).forEach(([key, value]) => {
                div += `<div class="home-body-div-variation js-variation-number-${count}">
                            <p class="js-variation-type">${key}</p>`
                value.forEach(val => {
                    div += `<div class="js-variation" variation-number="${count}" product-id="${product.id}">${val}</div>`
                });
                div += '</div>'

                count++;
            })
            variationElem = div;
        }

        let stars;
        if (product.rating.stars === 3.5) {
            stars = "Assets/Body_Assets/Rating_Stars/rating-35.png";
        } else if (product.rating.stars === 4) {
            stars = "Assets/Body_Assets/Rating_Stars/rating-4.png";   
        } else if (product.rating.stars === 4.5) {
            stars = "Assets/Body_Assets/Rating_Stars/rating-45.png";   
        } else {
            stars = "Assets/Body_Assets/Rating_Stars/rating-5.png";   
        }

        mainElem.innerHTML += `<div class="home-body-divs" id="${product.id}">
        <div class="home-body-div-img"><img class="js-product-image" src="${product.image}" alt="item"></div>
        <div class="home-body-div-content">
            <div class="home-body-div-title">${product.name}</div>
            <div class="home-body-div-rating">
                <img src="${stars}" alt="rating">
                <a href="#">${product.rating.count}</a>
            </div>
            <div class="home-body-div-price">$${(product.priceCents/100).toFixed(2)}</div>
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
            ${variationElem ? variationElem : ''}
        </div>
        <div class="home-body-div-add">
            <div class="home-body-div-added">
                    <img class="js-added-to-cart" src="Assets/Body_Assets/Others/checkmark.png" alt="added">
                    <p class="js-added-to-cart">Added</p>
            </div>
            <div><button class="js-add-to-cart-btn" product-id="${product.id}">Add to Cart</button></div>
        </div>
    </div>`

    });
}
