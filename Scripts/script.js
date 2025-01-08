// --------------------------- Header Scripts -----------------------------------
document.querySelector(".js-hamburger-icon").addEventListener("click", () => {
    const topBar = document.querySelector(".js-top-bar");
    topBar.classList.toggle("show"); // Toggle the 'show' class (adds and removes the class from element)
});