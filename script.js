// LightBox//////////////////////////////////////
$(document).ready(function () {
    $(window).scroll(function () {
        // if ($(window).scrollTop() >= $('header').height()) {
        //   $('nav').addClass('fixed-top');
        //   $('body').css('padding-top', $('nav').height());
        // } else {
        //   $('nav').removeClass('fixed-top');
        //   $('body').css('padding-top', "0");
        // }

        if ($(this).width() > 1200) {
            if ($(this).scrollTop() > 50) {
                // console.log('more than 50');
                $('#navBg').fadeIn();
                $('#banner_nav').addClass('scrolled');
            } else {
                $('#navBg').fadeOut();
                $('#banner_nav').removeClass('scrolled');
            }
        }

        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn(100);
        } else {
            $('#back-to-top').fadeOut(100);
        }
    });


    //scroll body to 0px on click/////////////////////////////
    $('#back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        return false;
    });
})











