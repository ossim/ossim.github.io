$(document).ready(function() {
    $('#icon').hover(function() {
        $('#tag').fadeIn("fast");
    }, function(){
        $('#tag').fadeOut("fast");
    });

    $('#scrolltop').click(function() {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });

    $('.unit').click(function() {
        if ($(this).hasClass("active")){
            return;
        } else {
            $('.unit').removeClass("active");
            $(this).addClass("active");
        }
    });
});