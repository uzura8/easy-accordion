(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.EasyAccordion = factory());
}(this, function () { 'use strict';

  var EasyAccordion = {
    init: function(targetElm) {
      if (targetElm === undefined) targetElm = document;
      var els = targetElm.querySelectorAll('.js-accordion');
      if (els === null || !els.length) return;

      for (var i = 0, n = els.length; i < n; i++) {
        els[i].addEventListener('click', {
          handleEvent: this.createAccordion,
          scopeElm: targetElm,
          eventElm: els[i]
        });
      }
    },
    remove: function(targetElm) {
      if (targetElm === undefined) targetElm = document;
      var els = targetElm.querySelectorAll('.js-accordion');
      if (els === null || !els.length) return;

      for (var i = 0, n = els.length; i < n; i++) {
        els[i].removeEventListener('click', {
          handleEvent: this.createAccordion,
          scopeElm: targetElm,
          eventElm: els[i]
        });
      }
    },
    createAccordion: function() {
      var targetElm = this.scopeElm;
      var $el = this.eventElm;
      var activeClass = $el.dataset.active_class !== undefined ?
        $el.dataset.active_class : '_state-active';
      var contentClass = $el.dataset.content_class !== undefined ?
        $el.dataset.content_class : 'accordion-content';
      var isScroll = $el.dataset.scroll === "1" ? $el.dataset.scroll : false;
      var groupSelector = $el.dataset.group !== undefined ? $el.dataset.group : '';
      var target = $el.dataset.target;
      var $target = target !== undefined ?
        targetElm.querySelector(target) : $el.nextElementSibling;
      var toOpen = $target !== null && !$target.classList.contains(activeClass);
      var closeBtnSelector = $el.dataset.close !== undefined ? $el.dataset.close : '';

      var $groupParent = null;
      if (toOpen && groupSelector) {
        $groupParent = (function (elem, selector) {
          for (; elem && elem !== targetElm; elem = elem.parentNode) {
            if (elem.matches(selector)) return elem;
          }
          return null;
        })($el, groupSelector);
        if ($groupParent !== null) {
          var accordionTriggers = $groupParent.querySelectorAll('.js-accordion');
          for (var i = 0, n = accordionTriggers.length; i < n; i++) {
            accordionTriggers[i].classList.remove(activeClass);
          }
          var accordionContents = $groupParent.querySelectorAll('.' + contentClass);
          for (var i = 0, n = accordionContents.length; i < n; i++) {
            accordionContents[i].classList.remove(activeClass);
          }
        }
      }

      $el.classList.toggle(activeClass);
      if ($target !== null) $target.classList.toggle(activeClass);

      if (toOpen && isScroll) {
        var $scrollTarget = $groupParent ? $groupParent : $el;
        (function (targetElm) {
          var targetPosY = targetElm.getBoundingClientRect().top;
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          var targetTop = targetPosY + scrollTop;
          window.scrollTo(0, targetTop);
        })($scrollTarget);
      }
      // closeButton
      if (toOpen && closeBtnSelector && $target !== null) {
        var closeBtns = $target.querySelectorAll(closeBtnSelector);
        if (closeBtns !== null) {
          for (var i = 0, n = closeBtns.length; i < n; i++) {
            closeBtns[i].addEventListener('click', (function(selfElm, closeBtnSelector, triggerElm, contentElm, activeClass) {
              return function removeActive(event) {
                if (event.target.classList.contains(closeBtnSelector.slice(1))) {
                  triggerElm.classList.remove(activeClass);
                  contentElm.classList.remove(activeClass);
                }
                selfElm.removeEventListener('click', removeActive);
              }
            })(closeBtns[i], closeBtnSelector, $el, $target, activeClass), false);
          }
        }
      }
    }
  };

  return EasyAccordion;

}));
