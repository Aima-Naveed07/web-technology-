// Get elements
var hamburgerBtn = document.querySelector('.hamburger-btn');
var mobileNav = document.getElementById('mobileNav');
var mobileNavOverlay = document.getElementById('mobileNavOverlay');
var mobileNavClose = document.getElementById('mobileNavClose');
var mobileLinks = document.querySelectorAll('.mobile-nav-link');

// Function to open mobile menu
function openMenu() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.classList.add('menu-open');
}

// Function to close mobile menu
function closeMenu() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.classList.remove('menu-open');
}

// Clicking hamburger icon toggles the menu
hamburgerBtn.addEventListener('click', function () {
    if (mobileNav.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Clicking close button closes the menu
mobileNavClose.addEventListener('click', function () {
    closeMenu();
});

// Clicking overlay closes the menu
mobileNavOverlay.addEventListener('click', function () {
    closeMenu();
});

// Bonus: Close menu when a navigation link is clicked
for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].addEventListener('click', function () {
        closeMenu();
    });
}
