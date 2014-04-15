function goTop()
{
    $(window).scroll(function(e) {
        if($(window).scrollTop()>100)
            $("#gotop").fadeIn(1000);
        else
            $("#gotop").fadeOut(1000);
    });
};

$(function(){
    $("#gotop").click(function(e) {
            $('body,html').animate({scrollTop:0},1000);
    });
    $("#gotop").mouseover(function(e) {
        $(this).css("background","url(img/toph.png) no-repeat 0px 0px");
    });
    $("#gotop").mouseout(function(e){
        $(this).css("background","url(img/top.png) no-repeat 0px 0px");
    });
    goTop();
});