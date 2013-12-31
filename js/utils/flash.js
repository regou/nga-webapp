define(function (require, exports, module) {
  var getYoukuId = function (url) {
    var rule = new RegExp(/^http:\/\/v\.youku\.com\/v_show\/id_([a-z0-9A-Z]*)/);
    var tmp;
    if (tmp = url.match(rule)) {
      if (tmp.length === 2) {
        return tmp[1];
      }
    }
    return '';
  };

  var youku = function (elem) {
    window.elem = elem;
    var url = elem.getAttribute('data-url');
    var id = getYoukuId(url);
    var request = function (success) {
      $.ajax({
        url: 'http://api.3g.youku.com/layout/phone2_1/play',
        data: {
          "point": "1",
          "id": id,
          "pid": "352e7f78a0bc479b",
          "format": "4",
          "ver": "2.3.1",
          "network": "WIFI",
        },
        type: 'get',
        dataType: 'json',
        success: success,
        error: function () {
          console.log(arguments);
        }
      });
    };
    var success = function (data) {
      var url, video;
      if (data && data.results && data.results['3gphd'] && data.results['3gphd'][0]) {
        url = data.results['3gphd'][0].url;
      }
      if (url) {
        video = document.createElement('video');
        video.setAttribute('src', url);
        elem.appendChild(video);
      }
    };
    request(success);
  };

  var jQueryFactory = (function ($) {
    $.extend($.fn, {
      youku: function () {
        var i, len;
        for (i = 0, len = this.length; i < len; i++) {
          youku(this[i]);
        }
      }
    });
  });

  if (typeof jQuery !== 'undefined') {
    jQueryFactory(jQuery);
  } else if (typeof $ !== 'undefined') {
    jQueryFactory($);
  }

  return {
    youku: youku
  };
});