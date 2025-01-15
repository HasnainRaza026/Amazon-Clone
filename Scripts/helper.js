function getVariationImage(products, productId, variationType, variationValue) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.variationImages) return null;

    for (const [key, value] of Object.entries(product.variationImages)) {
        const parsedKey = JSON.parse(key);
        if (parsedKey[variationType] === variationValue) {
            return value;
        }
    }
    return null;
}

function displayAddedToCart(productElem) {
    const addedElems = productElem.querySelectorAll(".js-added-to-cart");
    addedElems.forEach(elem => (elem.style.display = "block"));

    setTimeout(() => {
        addedElems.forEach(elem => (elem.style.display = "none"));
    }, 2000);
}


function updateCartQuantity(quantity) {
    document.querySelector(".js-cart-quantity").innerText = quantity;
    document.querySelector(".js-cart-quantity-sm").innerText = quantity;
    localStorage.setItem("cartQuantity", JSON.stringify(quantity));
}


function getProductDetails(productElem) {
    const variationObject = {};

    const variationsDivs = productElem.querySelectorAll(".js-variations-div");
    if (variationsDivs.length > 0) {
        variationsDivs.forEach(elem => {
            const variationTypeElem = elem.querySelector(".js-variation-type");
            if (variationTypeElem) {
                const variationType = variationTypeElem.innerText;
                const selectedVariation = Array.from(elem.querySelectorAll(".js-variation")).find(varElem => {
                    return varElem.getAttribute("selected") === "true";
                });
                if (selectedVariation) {
                    variationObject[variationType] = selectedVariation.innerText;
                } else {
                    variationObject[variationType] = elem.querySelector(".js-variation").innerText;
                }
            }
        });
    }

    return {
        name: productElem.querySelector(".js-product-name").innerText,
        price: productElem.querySelector(".js-product-price").innerText,
        image: productElem.querySelector(".js-product-image").getAttribute("src"),
        quantity: productElem.querySelector("select").value,
        variation: variationObject
    };
}


function getDate(daysToAdd = 0) {
    const now = new Date();
    now.setDate(now.getDate() + daysToAdd);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };

    return now.toLocaleDateString('en-US', options);
}