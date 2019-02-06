(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.EasyAccordion = factory());
}(this, function () { 'use strict';

  var EasyAccordion = {
    init: function(scopeElm, options) {
      if ( options === void 0 ) options = {};

      var toggleSelector = (options.toggleSelector !== undefined) ?
        options.toggleSelector : '.js-accordion';
      if (scopeElm === undefined) { scopeElm = document; }
      var els = scopeElm.querySelectorAll(toggleSelector);
      if (els === null || !els.length) { return; }

      for (var i = 0, n = els.length; i < n; i++) {
        els[i].addEventListener('click', {
          handleEvent: this.toggleAccordion,
          scopeElm: scopeElm,
          eventElm: els[i],
          triggerSelector: toggleSelector
        });
      }
    },
    destroy: function(scopeElm, options) {
      if ( options === void 0 ) options = {};

      var toggleSelector = (options.toggleSelector !== undefined) ?
        options.toggleSelector : '.js-accordion';
      if (scopeElm === undefined) { scopeElm = document; }
      var els = scopeElm.querySelectorAll(toggleSelector);
      if (els === null || !els.length) { return; }

      for (var i = 0, n = els.length; i < n; i++) {
        els[i].removeEventListener('click', {
          handleEvent: this.toggleAccordion,
          scopeElm: scopeElm,
          eventElm: els[i],
          triggerSelector: toggleSelector
        });
      }
    },
    toggleAccordion: function() {
      var $scope = this.scopeElm;
      var $trigger = this.eventElm;
      var activeClass = $trigger.dataset.active_class !== undefined ?
        $trigger.dataset.active_class : '_state-active';
      var contentClass = $trigger.dataset.content_class !== undefined ?
        $trigger.dataset.content_class : 'accordion-content';
      var isScroll = $trigger.dataset.scroll === "1" ?
        $trigger.dataset.scroll : false;
      var groupSelector = $trigger.dataset.group !== undefined ?
        $trigger.dataset.group : '';
      var targetSelector = $trigger.dataset.target;
      var $target = targetSelector !== undefined ?
        $scope.querySelector(targetSelector) : $trigger.nextElementSibling;
      var toOpen = !$target.classList.contains(activeClass);
      var closeBtnSelector = $trigger.dataset.close !== undefined ?
        $trigger.dataset.close : '';

      var $groupParent = null;
      if (toOpen && groupSelector) {
        $groupParent = (function (elem, selector) {
          for (; elem && elem !== $scope; elem = elem.parentNode) {
            if (elem.matches(selector)) { return elem; }
          }
          return null;
        })($trigger, groupSelector);
        if ($groupParent !== null) {
          var accordionTriggers = $groupParent.querySelectorAll(this.triggerSelector);
          for (var i = 0, n = accordionTriggers.length; i < n; i++) {
            accordionTriggers[i].classList.remove(activeClass);
          }
          var accordionContents = $groupParent.querySelectorAll('.' + contentClass);
          for (var i$1 = 0, n$1 = accordionContents.length; i$1 < n$1; i$1++) {
            accordionContents[i$1].classList.remove(activeClass);
          }
        }
      }

      $trigger.classList.toggle(activeClass);
      if ($target !== null) { $target.classList.toggle(activeClass); }

      if (toOpen && isScroll) {
        var $scrollTarget = $groupParent ? $groupParent : $trigger;
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
          for (var i$2 = 0, n$2 = closeBtns.length; i$2 < n$2; i$2++) {
            closeBtns[i$2].addEventListener('click', (function (selfElm, closeBtnSelector, triggerElm, contentElm, activeClass) {
              return function removeActive(event) {
                if (event.target.classList.contains(closeBtnSelector.slice(1))) {
                  triggerElm.classList.remove(activeClass);
                  contentElm.classList.remove(activeClass);
                }
                selfElm.removeEventListener('click', removeActive);
              }
            })(closeBtns[i$2], closeBtnSelector, $trigger, $target, activeClass), false);
          }
        }
      }
    }
  };

  return EasyAccordion;

}));
