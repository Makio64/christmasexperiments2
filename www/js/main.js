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

var _this = this;

window.XMAS = {
  width: 0,
  height: 0,
  body: null,
  thumbs: null,
  timer: null,
  init: function() {
    var _this = this;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.body = document.body;
    this.thumbs = [];
    $('.experiment').each(function(idx, obj) {
      return _this.thumbs.push(obj);
    });
    this.initEvents();
    this.showThumbs();
    return null;
  },
  showThumbs: function(evt) {
    var i, idx, thumb, _i, _ref;
    idx = -1;
    if (_this.XMAS.thumbs.length === 0) {
      $(window).off('scroll');
    }
    for (i = _i = 0, _ref = _this.XMAS.thumbs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      thumb = _this.XMAS.thumbs[i];
      if ((thumb.offsetTop > document.body.scrollTop && (thumb.offsetTop + 200) <= document.body.scrollTop + window.innerHeight) || $('.experiment-24').hasClass('show')) {
        if (thumb.className !== "experiment show") {
          $(thumb).addClass('show');
        }
        idx = i;
      }
    }
    if (idx !== -1) {
      _this.XMAS.thumbs.splice(idx, 1);
      idx = -1;
    }
    return null;
  },
  initEvents: function() {
    $(window).on('scroll', _this.XMAS.showThumbs);
    return null;
  }
};

$(function() {
  XMAS.init();
  (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1&appId=220813356385";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));;
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');;
  return null;
});
