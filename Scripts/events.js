let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;

document.addEventListener("DOMContentLoaded", async () => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
    document.querySelector(".js-cart-quantity").innerText = cartQuantity;
    
    const products = await fetchJSON('./Data/products.json');
    if (products) renderProducts(products);

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
});


function handleAddToCart(target) {
    const id = target.getAttribute("product-id"); // We can't use 'this' keyword because the function is listening for the click events on the entire document, hence we use 'event.target'

    const ProductElem = document.getElementById(id);
    const addedElems = ProductElem.querySelectorAll(".js-added-to-cart");

    addedElems.forEach(elem => {
        elem.style.display = "block";
    });

    setTimeout(() => {
        addedElems.forEach(elem => {
            elem.style.display = "none";
        });
    }, 2000);

    cartQuantity++;
    document.querySelector(".js-cart-quantity").innerText = cartQuantity;

    const variationObject = {};

    const variationsDivs = ProductElem.querySelectorAll(".js-variations-div");
    if (variationsDivs.length > 0) {
        variationsDivs.forEach(elem => {
            const variationTypeElem = elem.querySelector(".js-variation-type");
            if (variationTypeElem) {
                const variationType = variationTypeElem.innerText;

                // Find the selected variation value
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

    cartProducts.push({
        name: ProductElem.querySelector(".js-product-name").innerText,
        price: ProductElem.querySelector(".js-product-price").innerText,
        image: ProductElem.querySelector(".js-product-image").getAttribute("src"),
        quantity: ProductElem.querySelector("select").value,
        variation: variationObject
    });
}


function handleVariationClick(target, products) {
    const id = target.getAttribute("product-id");
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


