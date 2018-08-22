$(document).ready(function() {
    // Cookie consent
    $("#cookie").hide();
    checkConsent();

    // Load right flag in menu to set language
    if(checkLang().indexOf("nl") != -1) {
        $("#language").append('<a onclick="setLang(\'en\')"><img src="./public/images/en.png" alt="English"></a>');
        Cookies.set("ulang", "nl");
    } else {
        $("#language").append('<a onclick="setLang(\'nl\')"><img src="./public/images/nl.png" alt="Nederlands"></a>');
        Cookies.set("ulang", "en");
    }

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
        if( $('#hero-slider').length ) {
            var aboveNav = $("#hero-slider").height();
            var contentHeight = $("#nav-bar").height() + 96;
            if($(window).scrollTop() > aboveNav) {
                $("#nav-bar").addClass("sticky");
                $("#reasons").css("margin-top", contentHeight + "px");
            } else {
                $("#nav-bar").removeClass("sticky");
                $("#reasons").css("margin-top", "96px");
            }
        }
    });

    if( $("#nav-bar").hasClass("sticky") ) {
        var contentHeight = $("#nav-bar").height() + 96;
        $("#reasons").css("margin-top", contentHeight + "px");
    }

    // Set height for different elements and show/hide mobile menu
    heightElements();
    heightIconBlock('why');

    // Fire functions
    setWidthDaphne();
    puzzleHover();
    setBlogImages();
    blogHover();
    copyright();
    setActiveNavItem();
    randomContactImage();

    // WOW LANDINGSPAGE
    var hoveredListItem = 0;
    if( $('.landingspage').length ) {
        $('.header-item').hover(
            function() {
                $(this).parent().find('.overlay').css('background-color', 'rgba(255, 255, 255, 0.9)');
            },
            function() {
                $(this).parent().find('.overlay').css('background-color', 'rgba(255, 255, 255, 0.7)');
            }
        );

	    $('.text-item').hide();
        $('.text-default').show();
        
        $('.header-item').hover(function() {
            $('.text-item').hide();
            checkClassNum($(this).attr('class'));
        }, function() { });
    
        $('.header-img > img').click(function() {
            $('.header-item').removeClass('active');
            $('.text-item').hide();
            $('.header-item').connections('remove');
            $('.text-default').show();
        });

        $('#inpage_scroll_btn').click(function() {
            $(document).scrollTo('#welkom', 300);
        });

        placeBlogHoverText();
    }
});

// Check if user accepted cookies and show banner if not
function checkConsent() {
    if( Cookies.get("cookies-consent") != "true" ) {
        $("#cookie").delay( 1000 ).fadeIn();
    }
}

// Accept cookies
function acceptCookies() {
    Cookies.set("cookies-consent", "true");
    $("#cookie").delay( 500 ).fadeOut();
}

// Check the language
function checkLang() {
    var userLang = navigator.language || navigator.userLanguage;
    var url = window.location.href;
    if( url.indexOf("?clang=") == -1 ) {
        return userLang;
    } else {
        return url.substr(-2, 2);
    }
}

// Set the language
function setLang($event) {
    var url = window.location.href;
    if( url.indexOf("?clang=") == -1 ) {
        window.location.href = url + "?clang=" + $event;
    } else {
        var tempUrl = url.substr(0, url.length - 2);
        window.location.href = tempUrl + $event;
    }
}

function setActiveNavItem() {
    var url = window.location.pathname;
    if(url.indexOf('as-a-service') > -1) {
        // Set our services as active
        $('#nav-bar .menu-item-2 a').addClass('active');
    }
}

function copyright() {
    var year = (new Date()).getFullYear();
    var html = `<p class="copyright">&copy; LAKRAN Procurement Professionals ${year}</p>`;
    $('footer .container').prepend(html);
}

function blogHover() {
    $('#blogs .blog').hover(
        function() {
            var blogHeight = $(this).innerHeight();
            var titleHeight = $(this).find('.blog-title').height();
            var top = (blogHeight / 2) - (titleHeight / 2);
            $(this).find('.blog-title').animate({
                height: "100%",
                paddingTop: top + 'px'
            }, 400);
        },
        function() {
            var height = $(this).find('.blog-title h3').height() + 60;
            $(this).find('.blog-title').animate({
                height: height + 'px',
                paddingTop: '30px',
                paddingBottom: '30px'
            }, 400);
        }
    );
}

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
    var howHeight = $("#reasons .block-reasons .why .text-block").innerHeight();
    // $("#reasons .block-reasons .how .text-block").css("height", howHeight + "px");
    // $("#reasons .block-reasons .how .image-block").css("height", howHeight + "px");
    // $("#reasons .block-reasons .what .text-block").css("height", howHeight + "px");
    // $("#reasons .block-reasons .what .image-block").css("height", howHeight + "px");

    // Set height of map so its the same as the text
    var heightText = $("#footer .footer-text").height();
    $("#map").css("height", heightText + "px");

    // Set height circles on services pages
    if( $('.service-page').length ) {
        var wCircle = $('.service-page .service-circles .circle').width();
        $('.service-page .service-circle').css('width', wCircle + 'px');
        $('.service-page .service-circle').css('height', wCircle + 'px');
    }
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

// Hover services puzzle pieces
function puzzleHover() {
    $('#svgpuzzle .puzzle-piece').hover(
        function() {
            var classes = $(this).attr('class');
            var service = classes.replace('puzzle-piece ', '');
            service = service.replace(' overlay', '');
            $('#ourservices .left-text .text').hide();
            $('#ourservices .left-text .' + service).show();
        }, function() {

        }
    );
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
    });
}

function setBlogImages() {
    $('#blogs .blog-container .blog').each(function() {
        var url = $(this).data('img');
        $(this).css("background-image", "url('" + url + "')");
    });
}

// Google Maps
var map;
function initMap() {
    if($('#map').length) {
        var lakran = {lat: 51.987260, lng: 5.908726};
        map = new google.maps.Map(document.getElementById('map'), {
            center: lakran,
            zoom: 15,
        });
        var marker = new google.maps.Marker({
            position: lakran,
            map: map
        });
    }
}

// Show random person in the extended contact section
function randomContactImage() {
    if( $('#contact-extended').length ) {
        var num = Math.floor( (Math.random() * 10) + 1 );
        switch(num) {
            case 1:
                setContactImage('Babs Hessing', 'Consultant', 'babs');
                break;
            case 2:
                setContactImage('Bart van Beek', 'Consultant', 'bart');
                break;
            case 3:
                setContactImage('Efisio Caredda', 'Principal Consultant', 'efisio');
                break;
            case 4: 
                setContactImage('Ellis Mendelsohn', 'Consultant', 'ellis');
                break;
            case 5:
                setContactImage('Herman Ursinus', 'Managing Director', 'herman');
                break;
            case 6:
                setContactImage('Lieske van den Berg', 'Consultant', 'lieske');
                break;
            case 7:
                setContactImage('Luis Gomez', 'Consultant', 'luis')
                break;
            case 8:
                setContactImage('Minke Mensink', 'Director LAKRAN VMS Services', 'minke');
                break;
            case 9: 
                setContactImage('René Berns', 'Managing consultant', 'rene');
                break;
            case 10:
                setContactImage('Sander Hollings', 'Recruiter', 'sander');
                break;
            default:
                setContactImage('René Berns', 'Managing consultant', 'rene');
        }
    }
}

// Set name, function and img filename for a person in the extended contact version
function setContactImage(name, title, img) {
    $('#contact-extended .person .names').text(name);
    $('#contact-extended .person .title').text(title);
    $('#contact-extended .person .image img').attr('src', './public/images/persons/' + img + '.png');
}

// WOW LANDINGSPAGE
function checkClassNum(str) {
	if( str.indexOf('item-1') > 0 ) {
		hoveredListItem = 1;
	} else if( str.indexOf('item-2') > 0 ) {
		hoveredListItem = 2;
	} else if( str.indexOf('item-3') > 0 ) {
		hoveredListItem = 3;
	} else if( str.indexOf('item-4') > 0 ) {
		hoveredListItem = 4;
	} else if( str.indexOf('item-5') > 0 ) {
		hoveredListItem = 5;
	} else if( str.indexOf('item-6') > 0 ) {
		hoveredListItem = 6;
	} else {
		hoveredListItem = 0;
	}
	getTextField();
}

function getTextField() {
	if( hoveredListItem != 0 ) {
		$('.header-item').removeClass('active');
		$('.header-item').connections('remove');
		$('.text-' + hoveredListItem).show();
		$('.item-' + hoveredListItem).addClass('active');
 		$('.text-' + hoveredListItem + ' > .con').connections({ to: '.item-' + hoveredListItem});
 	} else {
 		$('.text-default').show();
 	}
}

function hideTextField() {
	$('.text-' + hoveredListItem).hide();
	$('.header-item').connections('remove');
	hoveredListItem = 0;
	$('.text-default').show();
}

function placeBlogHoverText() {  
    $('.g-empathy').hover(
        function() {
            $('.blog-hovertitle').html("Empathy. Stage 1:<br>Empathy map" );
        }, function() {
            $('.blog-hovertitle').html("");
        }
    );
    $('.g-daphne').hover(
        function(){
            if( Cookies.get("ulang") == "nl" ) {
                $('.blog-hovertitle').html("LAKRAN presents WOW:<br>Maak kennis met…" ); 
            } else {
                $('.blog-hovertitle').html("LAKRAN presents WOW:<br>Meet…" ); 
            }
        }, function() {
            $('.blog-hovertitle').html("");
        }
    );
    $('.g-define').hover(
        function(){
            $('.blog-hovertitle').html( "Define. Stage 2:<br>Define map" );
        }, function() {
            $('.blog-hovertitle').html("");
        }
    );
    $('.g-ideate').hover(
        function(){
            $('.blog-hovertitle').html( "Ideate. Stage 3:<br> Ideate map" );
        }, function() {
            $('.blog-hovertitle').html("");
        }
    );
    $('.g-prototype').hover(
        function(){
            $('.blog-hovertitle').html( "Prototype. Stage 4:<br> Prototype map" );
        }, function() {
            $('.blog-hovertitle').html("");
        }
    );
    $('.g-test').hover(
        function(){
            $('.blog-hovertitle').html( "Test. Stage 5:<br> Test map" );
        }, function() {
            $('.blog-hovertitle').html("");
        }
    );
}
