var iframe;

iframe = null;

$(function() {
  var _this = this;
  iframe = $('iframe');
  return $(window).on('resize', function() {
    iframe.width(window.innerWidth);
    return iframe.height(window.height - 50);
  });
});
