var iframe, resize;

iframe = null;

resize = function() {
  iframe.width(window.innerWidth);
  iframe.height(window.innerHeight - 50);
  return null;
};

$(function() {
  var _this = this;
  iframe = $('iframe');
  $(window).on('resize', resize);
  $('.more').on('click', function() {
    if ($('.calendar').hasClass('show')) {
      $('.more').removeClass('opened');
      return $('.calendar').removeClass('show');
    } else {
      $('.more').addClass('opened');
      return $('.calendar').addClass('show');
    }
  });
  return resize();
});
