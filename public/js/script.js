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

    // Make navbar sticky when its top of screen
    $(window).bind("scroll", function() {
        var aboveNav = $("#hero-slider").height();
        var contentHeight = $("#nav-bar").height() + 96;
        if($(window).scrollTop() > aboveNav) {
            $("#nav-bar").addClass("sticky");
            $("#reasons").css("margin-top", contentHeight + "px");
        } else {
            $("#nav-bar").removeClass("sticky");
            $("#reasons").css("margin-top", "96px");
        }
    });

    if( $("#nav-bar").hasClass("sticky") ) {
        var contentHeight = $("#nav-bar").height() + 96;
        $("#reasons").css("margin-top", contentHeight + "px");
    }

    // Set height for different elements and show/hide mobile menu
    heightElements();
    heightIconBlock('why');

    // Set Daphne
    setWidthDaphne();

    setBlogImages();
});

$(window).resize(function() {
    setWidthDaphne();
});

// Set with of coffee Daphne
function setWidthDaphne() {
    var winWidth = $(window).width();
    $('#ourservices .coffee-daphne .with-cloud').css('width', winWidth + 'px');
}

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

// Set height icon-block 
function heightIconBlock(className) {
    var circleBlock = $("#reasons .block-reasons ." + className + " .icon-block");
    var circleBlockWidth = circleBlock.width();
    circleBlock.css("height", circleBlockWidth + "px");
}

// Set height of different elements
function heightElements() {
    // Set height logo-text in slider
    var heightLogo = $(".logo").height();
    var logoText = $(".myslides .logo-text");
    logoText.css("height", heightLogo + "px");
    
    // Set height circles in #reasons
    var circle = $("#reasons .circle");
    var circleWidth = circle.width();
    circle.css("height", circleWidth + "px");

    // Set height circles in .icon-block
    heightIconBlock('active');

    // Set all reasons same height
    var howHeight = $("#reasons .block-reasons .how .text-block").innerHeight();
    // $("#reasons .block-reasons .why .text-block").css("height", howHeight + "px");
    // $("#reasons .block-reasons .why .image-block").css("height", howHeight + "px");
    // $("#reasons .block-reasons .what .text-block").css("height", howHeight + "px");
    // $("#reasons .block-reasons .what .image-block").css("height", howHeight + "px");

    // Set height of map so its the same as the text
    var heightText = $("#footer .footer-text").height();
    $("#map").css("height", heightText + "px");
}

// When page is loaded set interval to change the reasons
var reasonIndex = 2;
var reasonInterval = setInterval(function() {
    if (reasonIndex < 4) {
        selectReason(undefined, reasonIndex);
        reasonIndex += 1;
    } else {
        selectReason(undefined, 1);
        reasonIndex = 1;
    }
}, 8000);

// Set reason to first one
selectReason(undefined, 1);

// For the selectReason function
function setReasons(className) {
    $("#reasons .block-reasons ." + className).show();
    $("#reasons .block-reasons ." + className).addClass("active");
    $("#reasons .all-reasons ." + className + " .circle").addClass("active");
    $("#reasons .all-reasons ." + className + " .block-title").addClass("active");
    heightIconBlock(className);
}

// Select the right reason. When a reason is clicked, stop the interval
function selectReason($event, reason) {
    $("#reasons .block-reasons .block-reason").hide();
    $("#reasons .block-reasons .block-reason").removeClass("active");
    $("#reasons .all-reasons .column .circle").removeClass("active");
    $("#reasons .all-reasons .column .block-title").removeClass("active");
    if($event !== undefined) {
        clearInterval(reasonInterval);
        setReasons($event);
    } else if (reason !== undefined) {
        if (reason === 1) {
            setReasons('why');
        } else if (reason === 2) {
            setReasons('what');
        } else if (reason === 3) {
            setReasons('how');
        }
    } else {
        setReasons('why');
    }
}

// Make scrollbar for partner logo's
// http://jsfiddle.net/artuc/rGLsG/3/
$(function() {
    var carousel = $('#partnerships .scroll-bar ul');
    var carouselChild = carousel.find('li');
    var clickCount = 0;

    // Set carousel width so it won't wrap
    itemWidth = carousel.find('li:first').width();

    // Place the child elements to their original locations
    refreshChildPosition();

    // Set interval so logo's move every 8 seconds
    var logoInterval = setInterval(next, 8000);

    // Set the event handlers for the buttons
    $('#partnerships .next').click(next);

    $('#partnerships .prev').click(prev);

    // Set the hover of the logo's
    $('#partnerships .scroll-bar li').hover(
        function() {
            refreshPartnerImages();
            clearInterval(logoInterval);
            var classes = $(this).find('.logo').attr('class');
            var brand = classes.replace('logo ', '');
            partnerMouseEnter(brand);
        },
        function() { }
    )

    function next() {
        clickCount++;

        // Animate the slider to left as item width
        carousel.finish().animate({
            left: '-=' + itemWidth
        }, 300, function(){
            // Find the first item and append it as the last item
            lastItem = carousel.find('li:first');
            lastItem.remove().appendTo(carousel);
            lastItem.css('left', ((carouselChild.length - 1) * (itemWidth)) + (clickCount * itemWidth));
        });
    }

    function prev() {
        clickCount--;

        lastItem = carousel.find('li:last');
        lastItem.remove().prependTo(carousel);

        lastItem.css('left', itemWidth * clickCount);
        carousel.finish().animate({
            left: '+=' + itemWidth
        }, 300);
    }

    function refreshChildPosition() {
        carouselChild.each(function() {
            $(this).css('left', itemWidth * carouselChild.index($(this)));
        });
    }

    function refreshChildPositionNext() {
        carouselChild.each(function() {
            leftVal = parseInt($(this).css('left'));
        });
    }

    function partnerMouseEnter(name) {
        $('#partnerships .scroll-bar .' + name).attr('src', './public/images/partners/' + name + '-color.png');
        $('#partnerships .partner-info .info').hide();
        $('#partnerships .partner-info .base').hide();
        $('#partnerships .partner-info .' + name).show();
    }

    function refreshPartnerImages() {
        $('#partnerships .scroll-bar .sap').attr('src', './public/images/partners/sap-bw.png');
        $('#partnerships .scroll-bar .coupa').attr('src', './public/images/partners/coupa-bw.png');
        $('#partnerships .scroll-bar .basware').attr('src', './public/images/partners/basware-bw.png');
        $('#partnerships .scroll-bar .ariba').attr('src', './public/images/partners/ariba-bw.png');
        $('#partnerships .scroll-bar .zycus').attr('src', './public/images/partners/zycus-bw.png');
        $('#partnerships .scroll-bar .esize').attr('src', './public/images/partners/esize-bw.png');
        $('#partnerships .scroll-bar .fieldglass').attr('src', './public/images/partners/fieldglass-bw.png');
        $('#partnerships .scroll-bar .proactive').attr('src', './public/images/partners/proactive-bw.png');
        $('#partnerships .scroll-bar .synertrade').attr('src', './public/images/partners/synertrade-bw.png');
    }
});

// Get blogs from WordPress
function getBlogs() {
    $.getJSON("blogs", function(data) {
        var items = data;
        console.log(items);
    });
}

function setBlogImages() {
    $('#blogs .blog-container .blog').each(function() {
        var url = $(this).data('img');
        $(this).css("background-image", "url('" + url + "')");
    });
}