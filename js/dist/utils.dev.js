"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var btf = {
  debounce: function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;

      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
  throttle: function throttle(func, wait, options) {
    var timeout, context, args;
    var previous = 0;
    if (!options) options = {};

    var later = function later() {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function throttled() {
      var now = new Date().getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        previous = now;
        func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
    };

    return throttled;
  },
  sidebarPaddingR: function sidebarPaddingR() {
    var innerWidth = window.innerWidth;
    var clientWidth = document.body.clientWidth;
    var paddingRight = innerWidth - clientWidth;

    if (innerWidth !== clientWidth) {
      document.body.style.paddingRight = paddingRight + 'px';
    }
  },
  snackbarShow: function snackbarShow(text) {
    var showAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;
    var _GLOBAL_CONFIG$Snackb = GLOBAL_CONFIG.Snackbar,
        position = _GLOBAL_CONFIG$Snackb.position,
        bgLight = _GLOBAL_CONFIG$Snackb.bgLight,
        bgDark = _GLOBAL_CONFIG$Snackb.bgDark;
    var bg = document.documentElement.getAttribute('data-theme') === 'light' ? bgLight : bgDark;
    Snackbar.show({
      text: text,
      backgroundColor: bg,
      showAction: showAction,
      duration: duration,
      pos: position,
      customClass: 'snackbar-css'
    });
  },
  diffDate: function diffDate(d) {
    var more = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var dateNow = new Date();
    var datePost = new Date(d);
    var dateDiff = dateNow.getTime() - datePost.getTime();
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var result;

    if (more) {
      var monthCount = dateDiff / month;
      var dayCount = dateDiff / day;
      var hourCount = dateDiff / hour;
      var minuteCount = dateDiff / minute;

      if (monthCount > 12) {
        result = datePost.toISOString().slice(0, 10);
      } else if (monthCount >= 1) {
        result = parseInt(monthCount) + ' ' + GLOBAL_CONFIG.date_suffix.month;
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + ' ' + GLOBAL_CONFIG.date_suffix.day;
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + ' ' + GLOBAL_CONFIG.date_suffix.hour;
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + ' ' + GLOBAL_CONFIG.date_suffix.min;
      } else {
        result = GLOBAL_CONFIG.date_suffix.just;
      }
    } else {
      result = parseInt(dateDiff / day);
    }

    return result;
  },
  loadComment: function loadComment(dom, callback) {
    if ('IntersectionObserver' in window) {
      var observerItem = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          callback();
          observerItem.disconnect();
        }
      }, {
        threshold: [0]
      });
      observerItem.observe(dom);
    } else {
      callback();
    }
  },
  scrollToDest: function scrollToDest(pos) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    var currentPos = window.pageYOffset;
    var isNavFixed = document.getElementById('page-header').classList.contains('fixed');
    if (currentPos > pos || isNavFixed) pos = pos - 70;

    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: pos,
        behavior: 'smooth'
      });
      return;
    }

    var start = null;
    pos = +pos;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      var progress = currentTime - start;

      if (currentPos < pos) {
        window.scrollTo(0, (pos - currentPos) * progress / time + currentPos);
      } else {
        window.scrollTo(0, currentPos - (currentPos - pos) * progress / time);
      }

      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  },
  animateIn: function animateIn(ele, text) {
    ele.style.display = 'block';
    ele.style.animation = text;
  },
  animateOut: function animateOut(ele, text) {
    ele.addEventListener('animationend', function f() {
      ele.style.display = '';
      ele.style.animation = '';
      ele.removeEventListener('animationend', f);
    });
    ele.style.animation = text;
  },
  getParents: function getParents(elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }

    return null;
  },
  siblings: function siblings(ele, selector) {
    return _toConsumableArray(ele.parentNode.children).filter(function (child) {
      if (selector) {
        return child !== ele && child.matches(selector);
      }

      return child !== ele;
    });
  },

  /**
   * @param {*} selector
   * @param {*} eleType the type of create element
   * @param {*} options object key: value
   */
  wrap: function wrap(selector, eleType, options) {
    var createEle = document.createElement(eleType);

    for (var _i = 0, _Object$entries = Object.entries(options); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      createEle.setAttribute(key, value);
    }

    selector.parentNode.insertBefore(createEle, selector);
    createEle.appendChild(selector);
  },
  unwrap: function unwrap(el) {
    var elParentNode = el.parentNode;

    if (elParentNode !== document.body) {
      elParentNode.parentNode.insertBefore(el, elParentNode);
      elParentNode.parentNode.removeChild(elParentNode);
    }
  },
  isHidden: function isHidden(ele) {
    return ele.offsetHeight === 0 && ele.offsetWidth === 0;
  },
  getEleTop: function getEleTop(ele) {
    var actualTop = ele.offsetTop;
    var current = ele.offsetParent;

    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }

    return actualTop;
  },
  loadLightbox: function loadLightbox(ele) {
    var service = GLOBAL_CONFIG.lightbox;

    if (service === 'mediumZoom') {
      var zoom = mediumZoom(ele);
      zoom.on('open', function (e) {
        var photoBg = document.documentElement.getAttribute('data-theme') === 'dark' ? '#121212' : '#fff';
        zoom.update({
          background: photoBg
        });
      });
    }

    if (service === 'fancybox') {
      ele.forEach(function (i) {
        if (i.parentNode.tagName !== 'A') {
          var dataSrc = i.dataset.lazySrc || i.src;
          var dataCaption = i.title || i.alt || '';
          btf.wrap(i, 'a', {
            href: dataSrc,
            'data-fancybox': 'gallery',
            'data-caption': dataCaption,
            'data-thumb': dataSrc
          });
        }
      });

      if (!window.fancyboxRun) {
        Fancybox.bind('[data-fancybox]', {
          Hash: false,
          Thumbs: {
            autoStart: false
          }
        });
        window.fancyboxRun = true;
      }
    }
  },
  initJustifiedGallery: function initJustifiedGallery(selector) {
    var runJustifiedGallery = function runJustifiedGallery(i) {
      if (!btf.isHidden(i)) {
        fjGallery(i, {
          itemSelector: '.fj-gallery-item',
          rowHeight: i.getAttribute('data-rowHeight'),
          gutter: 4,
          onJustify: function onJustify() {
            this.$container.style.opacity = '1';
          }
        });
      }
    };

    if (Array.from(selector).length === 0) runJustifiedGallery(selector);else selector.forEach(function (i) {
      runJustifiedGallery(i);
    });
  },
  updateAnchor: function updateAnchor(anchor) {
    if (anchor !== window.location.hash) {
      if (!anchor) anchor = location.pathname;
      var title = GLOBAL_CONFIG_SITE.title;
      window.history.replaceState({
        url: location.href,
        title: title
      }, title, anchor);
    }
  },
  getScrollPercent: function getScrollPercent(currentTop, ele) {
    var docHeight = ele.clientHeight;
    var winHeight = document.documentElement.clientHeight;
    var headerHeight = ele.offsetTop;
    var contentMath = docHeight > winHeight ? docHeight - winHeight : document.documentElement.scrollHeight - winHeight;
    var scrollPercent = (currentTop - headerHeight) / contentMath;
    var scrollPercentRounded = Math.round(scrollPercent * 100);
    var percentage = scrollPercentRounded > 100 ? 100 : scrollPercentRounded <= 0 ? 0 : scrollPercentRounded;
    return percentage;
  }
};