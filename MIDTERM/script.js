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

// Slick Carousel Implementation
$(document).ready(function() {
    // 1. FIRST SLIDER (Products Section)
    var $firstSlider = $('.first-slider-init');
    var firstTotalSlides = $firstSlider.children('.product-card').length;

    $firstSlider.slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 800, // Visible slide transition speed
        pauseOnHover: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: $('.slider-prev'),
        nextArrow: $('.slider-next'),
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 }
            }
        ]
    });

    $firstSlider.on('afterChange', function(event, slick, currentSlide) {
        $('.first-slider-counter').text('Showing ' + (currentSlide + 1) + ' of ' + firstTotalSlides);
    });

    // 2. SECOND SLIDER (Bestsellers Section)
    var $secondSlider = $('.second-slider-init');
    var secondTotalSlides = $secondSlider.children('.bs-card').length;

    $secondSlider.slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 800, // Visible slide transition speed
        pauseOnHover: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: $('.bs-slider-prev'),
        nextArrow: $('.bs-slider-next'),
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 }
            }
        ]
    });

    $secondSlider.on('afterChange', function(event, slick, currentSlide) {
        $('.second-slider-counter').text('Showing ' + (currentSlide + 1) + ' of ' + secondTotalSlides);
    });
});
