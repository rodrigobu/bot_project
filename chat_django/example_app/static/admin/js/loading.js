/*if(!('Spinner' in window)){
   $('head').append(
       "<script src='/static/admin/js/spin.min.js'>"+"<"+"/script>"
   );
};*/
var _spin = new Spinner({
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '20%', // Top position relative to parent in px
      left: '50%', // Left position relative to parent in px
      lines: 10,
      length: 20,
      width: 5,
      radius: 10
    }).spin();
var _spin_loading = _spin.el;
$.loading = {};
$.loading.show = function(){
    $('.loading-container').show();
};
$.loading.hide = function(){
    $('.loading-container').hide();
};
window.onload = function(){
    $('body').append(
        $('<div class="ui-widget-overlay ui-helper-hidden loading-container" style="z-index: 999999 !important">')
    );
    $('.loading-container').append(_spin_loading);
    $(_spin_loading).css({
        'top': '50%',
        'left': '55%',
        'position': 'fixed'
    });
    $.loading.hide();
};