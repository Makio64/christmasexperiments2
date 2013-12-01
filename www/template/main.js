var _this = this;

({
  initUI: function() {
    var description;
    description = document.getElementsByName('description')[0].getAttribute('content');
    alert('ko');
    return null;
  },
  onClickHandler: function(e) {
    console.log(e);
    window.open('https://twitter.com/share?url=http://google.com');
    return null;
  },
  openSharer: function() {
    return null;
  }
});

initUI();
