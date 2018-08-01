$(document).ready(function() {
    // Code for the hero images slider on homepage
    $(".slide-container").unslider({
        arrows: {
            prev: "<a class='prev'>&#10094;</a>",
            next: "<a class='next'>&#10095;</a>"
        },
        autoplay: true,
        speed: 1200,
        delay: 8000
    });
});

// Scroll to menu item
function menuClick(name) {
    $("html, body").animate({
        scrollTop: $(name).offset().top - 120
    }, 1000);
    if($(window).width() < 769) {
        toggleMobileMenu();
    }
}

// Scroll to element in screen
function buttonClick(name) {
    $("html, body").animate({
        scrollTop: $(name).offset().top -120
    }, 1000);
}