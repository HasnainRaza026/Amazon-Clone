// --------------------------- Header Scripts -----------------------------------
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".js-hamburger-icon").addEventListener("click", () => {
        const topBar = document.querySelector(".js-top-bar");
        topBar.classList.toggle("show"); // Toggle the 'show' class (adds and removes the class from element)
    });
});


// ----------------------- Products Grid Scripts ---------------------------------
// Becaus the content is loaded dynamically using JS, we will use below code add event listners
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-add-to-cart-btn")) {
        const id = event.target.getAttribute("product-id"); // We can't use 'this' keyword because the function is listening for the click events on the entire document, hence we use ''event.target

        let addedElem = document.getElementById(id).querySelectorAll(".js-added-to-cart");
        
        addedElem.forEach(Elem => {
            Elem.style.display = "block"
        })

        setTimeout(() => {
            addedElem.forEach(Elem => {
                Elem.style.display = "none"
            })
        }, 2000);
    }

    else if (event.target.classList.contains("js-variation")) {
        const id = event.target.getAttribute("product-id");
        const variationNumber = event.target.getAttribute("variation-number");

        const variationType = document.getElementById(id).querySelector(`.js-variation-number-${variationNumber}`).querySelector(".js-variation-type").innerText;

        let variationElem = document.getElementById(id).querySelector(`.js-variation-number-${variationNumber}`).querySelectorAll(".js-variation");

        variationElem.forEach(Elem => {
            Elem.style.border = "1px solid #adb1b8"
        })

        event.target.style.border = "3px solid #e77502"

        fetch('./Data/products.json').then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); 
            }).then(data => {
                changeImage(products=data, productId=id, productVariationType=variationType);
            }).catch(error => {
                console.error('Error fetching the JSON file:', error);
            });
    }
});


// ----------------------------- Helper Functions ------------------------------------
function changeImage(products, productId, productVariationType) {
    products.forEach(product => {
        if ((product.id === productId) && (product.variationImages) && ((Object.keys(JSON.parse(Object.keys(product.variationImages)[0]))[0]) === productVariationType)) { // Here the last condition just checks if the variation image object's key is equalent to the variation type retrieve from front-end (initialy it is stringify hence I had to Parse it)
            console.log("image exist");  
        }
    })
}

