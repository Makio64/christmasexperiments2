var initUI, onClickHandler, openSharer,
  _this = this;

initUI = function() {
  var description;
  description = document.getElementsByName('description')[0].getAttribute('content');
  return null;
};

onClickHandler = function(e) {
  console.log(e);
  window.open('https://twitter.com/share?url=http://google.com');
  return null;
};

openSharer = function() {
  return null;
};

$(function() {
  return initUI();
});
