document.addEventListener("DOMContentLoaded", async () => {
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
            console.log("click")
            handleVariationClick(event.target, products);
        }
    });
});


function handleAddToCart(target) {
    const id = target.getAttribute("product-id"); // We can't use 'this' keyword because the function is listening for the click events on the entire document, hence we use 'event.target'
    const addedElems = document.getElementById(id).querySelectorAll(".js-added-to-cart");

    addedElems.forEach(elem => {
        elem.style.display = "block";
    });

    setTimeout(() => {
        addedElems.forEach(elem => {
            elem.style.display = "none";
        });
    }, 2000);
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
    });

    target.style.border = "3px solid #e77502";

    const variationValue = target.innerText;
    const image = getVariationImage(products, id, variationType, variationValue);

    if (image) {
        document.getElementById(id).querySelector(".js-product-image").src = image;
    }
}


