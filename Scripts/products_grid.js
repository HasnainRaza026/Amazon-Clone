fetch('./Data/products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON from the response
    })
    .then(data => {
        renderProducts(data);
    })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
    });


function renderProducts(products) {
    const mainElem = document.querySelector(".home-product-grid")
    products.forEach(product => {

        let variationElem = "";
        if (product.variations) {
            let div = "";
            Object.entries(product.variations).forEach(([key, value]) => {
                div += `<div class="home-body-div-variation">
                            <p>${key}</p>`
                value.forEach(val => {
                    div += `<div>${val}</div>`
                });
                div += '</div>'
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
        <div class="home-body-div-img"><img src="${product.image}" alt="item"></div>
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
                    <img src="Assets/Body_Assets/Others/checkmark.png" alt="added">
                    <p>Added</p>
            </div>
            <div><button>Add to Cart</button></div>
        </div>
    </div>`

    });
}
