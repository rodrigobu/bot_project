$(function(){

    var first_click = true;
    $('.help-video-list li').click(function(){
        var extra_args = '';
        if(!first_click){
            extra_args = 'autoplay'
        }
        first_click = false

        $('.help-video-list li').removeClass('active');
        $(this).addClass('active');
        var url = $(this).data('url');
        $('.help-video-container').html('<video width="423" height="317" ' + extra_args  + ' controls><source src="' + url + '" type="video/mp4"></video> ');
    });

    $("#id_item_painel_help, #help-button, .open-help").click(function(e){
        e.preventDefault();
        $('.help-video-list li:first-child').click();
        $("#help-me").dialog({
            title: $("#help-me").data('title'),
            width: 800,
            height: 380 
        })
    });
});
