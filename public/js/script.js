$(document).ready(function() {
    // Cookie consent
    $("#cookie").hide();
    checkConsent();

    // Don't show mobile menu on page load
    if($(window).width() < 769) {
        $("#nav-bar .right-menu .menu-items").hide();
    }

    $(window).change(function() {
        if($(window).width() < 769) {
            $("#nav-bar .right-menu .menu-items").hide();
            $(".dropdown > .dropdown-menu").hide();
        } else {
            $("#nav-bar .right-menu .menu-items").show();
        }
    });

    $('#ourservices .popups .popup').hover(
        function() {
            clearTimeout(puzzleTimeout);
            if( $(window).width() >= 991 ) {
                $(this).show();
            }
        }, function() {
            if( $(window).width() >= 991 ) {
                setTimeout(() => {
                    $(this).fadeOut();
                }, 1000)
            }
        }
    )

    // Load right flag in menu to set language
    if(checkLang().indexOf("nl") != -1) {
        $("#language").find('.current').find('img').attr('src', './public/images/lang/nl.png').attr('alt', 'Nederlands');
        Cookies.set("ulang", "nl");
    } else {
        $("#language").find('.current').find('img').attr('src', './public/images/lang/en.png').attr('alt', 'English');;
        Cookies.set("ulang", "en");
        hideContent();
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

    if( $(".service-page").length ) {
        $(".service-page .software-logos a").hover(
            function() {
                var comp = $(this).attr('class');
                $(this).find('.bw.' + comp).hide();
                $(this).find('.color.' + comp).show();
            },
            function() {
                var comp = $(this).attr('class');
                $(this).find('.color.' + comp).hide();
                $(this).find('.bw.' + comp).show();
            }
        )
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
    setRoadmapStage();

    // Newsletter popup
    $("#newsletter-popup").hide();
    showNewsletterPopup();

    // Countup on customer case pages
    if( $(".customer-case").length ) {
        $(".counter").each(function() {
            var $this = $(this).find(".num");
            var countTo = $this.attr('data-count');

            $({countNum: $this.text()}).animate({
                countNum: countTo
            },{
                duration: 1000,
                easing: 'linear',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }

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

// Timeout for puzzlehover
var puzzleTimeout;

// Check for hover on dropdown menu
if($(window).width() > 768) {
    $('.dropdown').hover(
        function() {
            $(".dropdown > .dropdown-menu").slideDown();
        }, 
        function() {
            $(".dropdown > .dropdown-menu").slideUp();
        }
    );
}

// Hide content for now when language is English
function hideContent() {
    $("#blogs").hide();
    // $("#whitepapers").hide();
    $(".menu-item-3").hide();
    $("#wow .blog-daphne").hide();
    $("#wow #whitepapersblogs").hide();
    $("#wow .mobile-menu-2").hide();
    $("#nav-bar.wow .menu-item-5").hide();
    $(".roadmap-page .section .stage .btn-primary-invert").hide();
}

// Mobile menu toggle
function toggleMobileMenu() {
    var menu = $("#nav-bar .right-menu .menu-items");
    var icon = $("#nav-bar .right-menu .mobile-toggle .nav-icon");
    if( menu.css("display") === "none" ) {
        // open menu and change icon to cross
        menu.slideDown();
        icon.addClass("open");
        menu.find("#language").hide();
        menu.find(".mobile-lang").show();
    } else {
        // close menu and change icon to bars
        menu.slideUp();
        icon.removeClass("open");
        menu.find("#language").show();
        menu.find(".mobile-lang").hide();
    }
}

// When window is resized, calculate heights and widths again
$(window).resize(function() {
    setWidthDaphne();
    heightElements();
    heightIconBlock('why');
    if($(window).width() < 769) {
        $("#nav-bar .right-menu .menu-items").hide();
    } else {
        $("#nav-bar .right-menu .menu-items").show();
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
    Cookies.set("cookies-consent", "true", {expires: 365});
    $("#cookie").delay( 500 ).fadeOut();
}

// Check the language
function checkLang() {
    var cookieLang = Cookies.get("ulang");
    var userLang = navigator.language || navigator.userLanguage;
    var url = window.location.href;
    // Check if language is set in cookies
    if( cookieLang != undefined ) {
        return cookieLang;
    } 
    // Get language from browser language
    else if( url.indexOf("?clang=") == -1 ) {
        return userLang;
    } 
    // Get language from url
    else {
        return url.substr(-2, 2);
    }
}

// Set the language
function setLang($event) {
    var url = window.location.href;
    var path = window.location.pathname;
    
    Cookies.set("ulang", $event);
    // if (url.indexOf("roadmap") > -1 ){
    //     window.location.href = url
    // } else 
    if( url.indexOf("?clang=") == -1 ) {
        window.location.href = url + "?clang=" + $event;
    } else {
        var tempUrl = url.substr(0, url.length - 2);
        window.location.href = tempUrl + $event;
    }
    console.log(url);
    console.log(path);
}

function setActiveNavItem() {
    var url = window.location.pathname;
    if(url.indexOf('as-a-service') > -1) {
        // Set our services as active
        $('#nav-bar .menu-item-2 a').addClass('active');
    }
}

function goBack() {
    window.history.back();
}

function copyright() {
    var year = (new Date()).getFullYear();
    var html = "<p class='copyright'>&copy; LAKRAN Procurement Professionals " + year + "</p>";
    $('footer .container').prepend(html);
}

// Set with of coffee Daphne
function setWidthDaphne() {
    var winWidth = $(window).width();
    $('#ourservices .coffee-daphne .with-cloud').css('width', winWidth + 'px');
}

// Scroll to menu item
function menuClick(name) {
    // Check if homepage
    if( window.location.pathname == "/" == true ) {
        var offsetTop = 70;
        if(name == "#ourservices") {
            var padding = $(name).css("padding-top");
            padding = Number(padding.replace("px", "")) - offsetTop;
            offsetTop -= padding;
        }
        $("html, body").animate({
            scrollTop: $(name).offset().top - offsetTop
        }, 1000);
        if($(window).width() < 769) {
            toggleMobileMenu();
        }
    } else {
        window.location.href = "/";
    }
}

function wowMenuClick(name) {
    var offsetTop = 70;
    $("html, body").animate({
        scrollTop: $(name).offset().top - offsetTop
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
    var titleHeight = $("#reasons .block-reasons .why .text-block h4").innerHeight();
    var textHeight = howHeight - titleHeight;
    $("#reasons .block-reasons .how .text-block").css("height", textHeight + "px");
    $("#reasons .block-reasons .how .image-block").css("height", howHeight + "px");
    $("#reasons .block-reasons .what .text-block").css("height", textHeight + "px");
    $("#reasons .block-reasons .what .image-block").css("height", howHeight + "px");

    // Set height of map so its the same as the text
    var heightText = $("#footer .footer-text").height();
    $("#map").css("height", heightText + "px");

    // Set height circles on services pages
    if( $('.service-page').length ) {
        var wCircle = $('.service-page .service-circles .circle').width();
        $('.service-page .service-circle').css('width', wCircle + 'px');
        $('.service-page .service-circle').css('height', wCircle + 'px');
    }

    // Set height circles on customer pages
    var counterCircle = $('.customer-case .counter').innerWidth() + 20;
    $('.customer-case .counter').css("height", counterCircle + "px");
}

// Scroll to right reason
function scrollToReason($event) {
    $("html, body").animate({
        scrollTop: $("#reasons").offset().top - 50
    }, 1000);
    selectReason($event);
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
            $('#ourservices .popups .popup').hide();

            service = service.replace(' overlay', '');
            $('#ourservices .left-text .text').hide();
            $('#ourservices .right-text .text').hide();
            $('#ourservices .left-text .' + service).show();
            $('#ourservices .right-text .' + service).show();

            if( $(window).width() >= 991) {
                $('#ourservices .popups .' + service).fadeIn();
            }
        }, function() {
            var classes = $(this).attr('class');
            var service = classes.replace('puzzle-piece ', '');
            service = service.replace(' overlay', '');
            puzzleTimeout = setTimeout(() => {
                $('#ourservices .popups .' + service).fadeOut();
            }, 1000);
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

    // Set interval so logo's move every 8 seconds if window is bigger then 550px
    if( $(window).width() > 550 ) {
        var logoInterval = setInterval(next, 8000);
    }

    // Set the event handlers for the buttons
    $('#partnerships .next').click(next);

    $('#partnerships .prev').click(prev);

    // Set the hover of the logo's
    if( $(window).width() > 550 ) {
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
    }

    function next() {
        clickCount++;

        carousel.finish().animate({
            left : '-=' + itemWidth
        },300, function(){
            //Find the first item and append it as the last item.
            lastItem = carousel.find('li:first');
            lastItem.remove().appendTo(carousel);
            lastItem.css('left', ((carouselChild.length-1)*(itemWidth))+(clickCount*itemWidth));
            lastItem.hover(
                function() {
                    refreshPartnerImages();
                    clearInterval(logoInterval);
                    var classes = $(this).find('.logo').attr('class');
                    var brand = classes.replace('logo ', '');
                    partnerMouseEnter(brand);
                },
                function(){}
            )
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
        lastItem.hover(
            function() {
                refreshPartnerImages();
                clearInterval(logoInterval);
                var classes = $(this).find('.logo').attr('class');
                var brand = classes.replace('logo ', '');
                partnerMouseEnter(brand);
            },
            function(){}
        )
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

function changePartnerLogo($event) {
    var imgWrap = $("#partnerships .mobile .img-wrap");
    imgWrap.find(".color").hide();
    imgWrap.find(".bw").show();
    imgWrap.find("." + $event + ".bw").hide();
    imgWrap.find("." + $event + ".color").show();

    var partnerInfo = $("#partnerships .partner-info");
    partnerInfo.find(".info").hide();
    partnerInfo.find(".base").hide();
    partnerInfo.find("." + $event).show();
}

$("#partnerships .mobile .img-wrap").hover(
    function() {
        $(this).find(".color").show();
        $(this).find(".bw").hide();
    }, function() {
        $(this).find(".color").hide();
        $(this).find(".bw").show();
    }
)

$("#solutioning-page .software-logos img").hover(
    function() {
        var name = $(this).attr("class");
        $("#solutioning-page .partner-info .base").hide();
        $("#solutioning-page .partner-info .info").hide();
        $("#solutioning-page .partner-info ." + name).fadeIn();
    }, function() {}
)

// Get blogs from WordPress
function getBlogs() {
    $.getJSON("blogs", function(data) {
        var items = data;
    });
}

function setBlogImages() {
    $('#blogs .blog-container .blog').each(function() {
        var url = $(this).data('img');
        $(this).css("background", "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url('" + url + "')");
    });
}

function blogHover() {
    if( $(window).width() > 630 ) {
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

// Open a modal
function openModal(id) {
    $(id).fadeIn();
}

// Close a modal
function closeModal(id) {
    $(id).fadeOut();
}

// Close modal when you click outside
$(document).click(function(event) {
    if($(event.target).closest(".modal").length) {
        if(!$(event.target).is("input")) {
            $("body").find(".modal").fadeOut();
        }
    }
});

// Open newsletter popup, after 6 sec, when there is no cookie for it and if windowwidth is bigger than 600px
function showNewsletterPopup() {
    if( Cookies.get("newsletter") != "closed" && $(window).width() > 600 ) {
        $("#newsletter-popup").delay(6000).fadeIn();
    }
}

// Close newsletter popup and set a cookie for one day
function closeNewsletterPopup() {
    $("#newsletter-popup").fadeOut();
    Cookies.set("newsletter", "closed", { expires: 1 });
}

// Show random person in the extended contact section
function randomContactImage() {
    if( $('#contact-extended').length ) {
        var num = Math.floor( (Math.random() * 10) + 1 );
        switch(num) {
            case 1:
                setContactImage('Babs Hessing', 'Consultant', 'babs-games');
                break;
            case 2:
                setContactImage('Bart van Beek', 'Consultant', 'bart');
                break;
            case 3:
                setContactImage('Efisio Caredda', 'Principal Consultant', 'efisio');
                break;
            case 4: 
                setContactImage('Ellis Mendelsohn', 'Consultant', 'ellis-bril');
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
                // For now set on Rene, must be Sandra in the future
                setContactImage('René Berns', 'Managing consultant', 'rene');
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
 		$('.text-' + hoveredListItem + ' > .con').connections({ 
             to: '.item-' + hoveredListItem,
             css: {
                 border: '2px solid white'
             }
        });
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

// WOW Roadmappage
function getQueryString() {
    var vars = [];
    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('?');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function setRoadmapStage() {
    if( $('.roadmap-page') ) {
        var queryStrings = getQueryString();
        console.log(queryStrings);
        if( queryStrings.step != undefined) {
            if( queryStrings.hasOwnProperty('step') ) {
                var step = queryStrings.step;
                $(".roadmap-page .section." + step).addClass('show');
                $(".roadmap-page .stappenplan-hexagon .hexagon-stage-" + step).addClass("active-stage");
                $("#slide-menu-stages .mobile-stages-nav ." + step).addClass("active");
            }
        } else {
            $(".roadmap-page .section.empathy").addClass('show');
            $(".roadmap-page .stappenplan-hexagon .hexagon-stage-empathy").addClass("active-stage");
            $("#slide-menu-stages .mobile-stages-nav .empathy").addClass("active");
        }
    }
}

function openRoadmapMobileMenu() {
    $("#slide-menu-stages .mobile-stages-nav").slideToggle();
}
