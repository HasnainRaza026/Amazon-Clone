let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;


// =============================> Event Listners <==============================
document.addEventListener("DOMContentLoaded", async () => {
    const bodyId = document.body.getAttribute("id");

    // Event Listners for the index.html 
    if (bodyId === "home") {
        document.querySelector(".js-cart-quantity").innerText = cartQuantity;
        document.querySelector(".js-cart-quantity-sm").innerText = cartQuantity;
        
        const products = await fetchJSON('./Data/products.json');
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
    } 
    
    // Event Listners for the checkout.html 
    else if (bodyId === "checkout") {
        document.querySelector(".js-checkout-item-quantity").innerText = cartQuantity + " items";
        if (cartProducts) renderCheckoutProducts(cartProducts);

        document.querySelector(".checkout-content-div").addEventListener("click", (event) => {
            if (event.target.matches(".js-checkout-delt")) {
                handleDeleteClick(event.target);
            } else if (event.target.matches(".js-checkout-update")) {
                handleUpdateClick(event.target);
            }
        });
    }
});


// =============================> Home Event Listner Functions <==============================
function handleAddToCart(target) {
    const id = target.getAttribute("product-id"); // We can't use 'this' keyword because the function is listening for the click events on the entire document, hence we use 'event.target'
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
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
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


// =============================> Checkout Event Listner Functions <==============================
function handleDeleteClick(target) {
    const id = target.getAttribute("product-id");
    const product = cartProducts.find(p => p.id === id);

    cartQuantity -= product.quantity;
    cartProducts.splice(cartProducts.indexOf(product), 1);

    localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
}

function handleUpdateClick(target) {
    const id = target.getAttribute("product-id");
    const quantityElem = document.getElementById(id).querySelector(".js-checkout-quantity-update");
    
    if (quantityElem.tagName === "SPAN") {
        target.innerText = "Save";
        quantityElem.outerHTML = `<input type="number" class="js-checkout-quantity-update" product-id="${id}" style="width: 40px; height: 20px; padding-left: 5px" placeholder="${quantityElem.innerText}" min="1" max="10">`;
    } else {
        target.innerText = "Update";
        let productQuantity = '';
        let totalQuantity = 0;

        cartProducts.forEach(item => {
            if (item.id === id) {   
                item.quantity = quantityElem.value || 1;
                productQuantity = item.quantity;
            }
            totalQuantity += Number(item.quantity);
        });
        cartQuantity = totalQuantity;

        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
        quantityElem.outerHTML = `<span class="js-checkout-quantity-update">${productQuantity}</span>`;

        location.reload();
    }  
}
