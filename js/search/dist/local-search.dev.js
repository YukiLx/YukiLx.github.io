"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

window.addEventListener('load', function () {
  var loadFlag = false;
  var dataObj = [];
  var $searchMask = document.getElementById('search-mask');

  var openSearch = function openSearch() {
    var bodyStyle = document.body.style;
    bodyStyle.width = '100%';
    bodyStyle.overflow = 'hidden';
    btf.animateIn($searchMask, 'to_show 0.5s');
    btf.animateIn(document.querySelector('#local-search .search-dialog'), 'titleScale 0.5s');
    setTimeout(function () {
      document.querySelector('#local-search-input input').focus();
    }, 100);

    if (!loadFlag) {
      search();
      loadFlag = true;
    } // shortcut: ESC


    document.addEventListener('keydown', function f(event) {
      if (event.code === 'Escape') {
        closeSearch();
        document.removeEventListener('keydown', f);
      }
    });
  };

  var closeSearch = function closeSearch() {
    var bodyStyle = document.body.style;
    bodyStyle.width = '';
    bodyStyle.overflow = '';
    btf.animateOut(document.querySelector('#local-search .search-dialog'), 'search_close .5s');
    btf.animateOut($searchMask, 'to_hide 0.5s');
  };

  var searchClickFn = function searchClickFn() {
    document.querySelector('#search-button > .search').addEventListener('click', openSearch);
  };

  var searchClickFnOnce = function searchClickFnOnce() {
    document.querySelector('#local-search .search-close-button').addEventListener('click', closeSearch);
    $searchMask.addEventListener('click', closeSearch);
    if (GLOBAL_CONFIG.localSearch.preload) dataObj = fetchData(GLOBAL_CONFIG.localSearch.path);
  }; // check url is json or not


  var isJson = function isJson(url) {
    var reg = /\.json$/;
    return reg.test(url);
  };

  var fetchData = function fetchData(path) {
    var data, response, res, t, a, $loadDataItem;
    return regeneratorRuntime.async(function fetchData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = [];
            _context.next = 3;
            return regeneratorRuntime.awrap(fetch(path));

          case 3:
            response = _context.sent;

            if (!isJson(path)) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return regeneratorRuntime.awrap(response.json());

          case 7:
            data = _context.sent;
            _context.next = 20;
            break;

          case 10:
            _context.next = 12;
            return regeneratorRuntime.awrap(response.text());

          case 12:
            res = _context.sent;
            _context.next = 15;
            return regeneratorRuntime.awrap(new window.DOMParser().parseFromString(res, 'text/xml'));

          case 15:
            t = _context.sent;
            _context.next = 18;
            return regeneratorRuntime.awrap(t);

          case 18:
            a = _context.sent;
            data = _toConsumableArray(a.querySelectorAll('entry')).map(function (item) {
              return {
                title: item.querySelector('title').textContent,
                content: item.querySelector('content') && item.querySelector('content').textContent,
                url: item.querySelector('url').textContent
              };
            });

          case 20:
            if (response.ok) {
              $loadDataItem = document.getElementById('loading-database');
              $loadDataItem.nextElementSibling.style.display = 'block';
              $loadDataItem.remove();
            }

            return _context.abrupt("return", data);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  var search = function search() {
    if (!GLOBAL_CONFIG.localSearch.preload) {
      dataObj = fetchData(GLOBAL_CONFIG.localSearch.path);
    }

    var $input = document.querySelector('#local-search-input input');
    var $resultContent = document.getElementById('local-search-results');
    var $loadingStatus = document.getElementById('loading-status');
    $input.addEventListener('input', function () {
      var _this = this;

      var keywords = this.value.trim().toLowerCase().split(/[\s]+/);
      if (keywords[0] !== '') $loadingStatus.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';else {
        $resultContent.innerHTML = '';
        return;
      }
      var str = '<div class="search-result-list">';
      if (keywords.length <= 0) return;
      var count = 0; // perform local searching

      dataObj.then(function (data) {
        data.forEach(function (data) {
          var isMatch = true;
          var dataTitle = data.title ? data.title.trim().toLowerCase() : '';
          var dataContent = data.content ? data.content.trim().replace(/<[^>]+>/g, '').toLowerCase() : '';
          var dataUrl = data.url.startsWith('/') ? data.url : GLOBAL_CONFIG.root + data.url;
          var indexTitle = -1;
          var indexContent = -1;
          var firstOccur = -1; // only match articles with not empty titles and contents

          if (dataTitle !== '' || dataContent !== '') {
            keywords.forEach(function (keyword, i) {
              indexTitle = dataTitle.indexOf(keyword);
              indexContent = dataContent.indexOf(keyword);

              if (indexTitle < 0 && indexContent < 0) {
                isMatch = false;
              } else {
                if (indexContent < 0) {
                  indexContent = 0;
                }

                if (i === 0) {
                  firstOccur = indexContent;
                }
              }
            });
          } else {
            isMatch = false;
          } // show search results


          if (isMatch) {
            if (firstOccur >= 0) {
              // cut out 130 characters
              // let start = firstOccur - 30 < 0 ? 0 : firstOccur - 30
              // let end = firstOccur + 50 > dataContent.length ? dataContent.length : firstOccur + 50
              var start = firstOccur - 30;
              var end = firstOccur + 100;
              var pre = '';
              var post = '';

              if (start < 0) {
                start = 0;
              }

              if (start === 0) {
                end = 100;
              } else {
                pre = '...';
              }

              if (end > dataContent.length) {
                end = dataContent.length;
              } else {
                post = '...';
              }

              var matchContent = dataContent.substring(start, end); // highlight all keywords

              keywords.forEach(function (keyword) {
                matchContent = matchContent.replaceAll(keyword, '<span class="search-keyword">' + keyword + '</span>');
                dataTitle = dataTitle.replaceAll(keyword, '<span class="search-keyword">' + keyword + '</span>');
              });
              str += '<div class="local-search__hit-item"><a href="' + dataUrl + '"><span class="search-result-title">' + dataTitle + '</span>';
              count += 1;

              if (dataContent !== '') {
                str += '<p class="search-result">' + pre + matchContent + post + '</p>';
              }
            }

            str += '</a></div>';
          }
        });

        if (count === 0) {
          str += '<div id="local-search__hits-empty">' + GLOBAL_CONFIG.localSearch.languages.hits_empty.replace(/\$\{query}/, _this.value.trim()) + '</div>';
        }

        str += '</div>';
        $resultContent.innerHTML = str;
        if (keywords[0] !== '') $loadingStatus.innerHTML = '';
        window.pjax && window.pjax.refresh($resultContent);
      });
    });
  };

  searchClickFn();
  searchClickFnOnce(); // pjax

  window.addEventListener('pjax:complete', function () {
    !btf.isHidden($searchMask) && closeSearch();
    searchClickFn();
  });
});