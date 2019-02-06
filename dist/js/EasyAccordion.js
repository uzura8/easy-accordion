(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.EasyAccordion = factory());
}(this, function () { 'use strict';

  var EasyAccordion = {
    handleEvent: function(scopeElm, triggerSelector, type, func, isRemove) {
      if ( isRemove === void 0 ) isRemove = false;

      var els = scopeElm.querySelectorAll(triggerSelector);
      if (els === null || !els.length) { return; }
      for (var i = 0, n = els.length; i < n; i++) {
        var listener = {
          handleEvent: func,
          scopeElm: scopeElm,
          eventElm: els[i],
          triggerSelector: triggerSelector
        };
        if (isRemove) {
          els[i].removeEventListener(type, listener);
        } else {
          els[i].addEventListener(type, listener);
        }
      }
    },
    init: function(scopeElm, options) {
      if ( options === void 0 ) options = {};

      if (scopeElm === undefined) { scopeElm = document; }

      var toggleSelector = (options.toggleSelector !== undefined) ?
        options.toggleSelector : '.js-accordion';
      this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion);

      var closeSelector = (options.closeSelector !== undefined) ?
        options.closeSelector : '.js-accordion-close';
      this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion);
    },
    destroy: function(scopeElm, options) {
      if ( options === void 0 ) options = {};

      if (scopeElm === undefined) { scopeElm = document; }

      var toggleSelector = (options.toggleSelector !== undefined) ?
        options.toggleSelector : '.js-accordion';
      this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion, true);

      var closeSelector = (options.closeSelector !== undefined) ?
        options.closeSelector : '.js-accordion-close';
      this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion, true);
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
    },
    closeAccordion: function(event) {
      var $scope = this.scopeElm;
      var $trigger = this.eventElm;
      var activeClass = $trigger.dataset.active_class !== undefined ?
        $trigger.dataset.active_class : '_state-active';
      var toggleTriggerSelector = $trigger.dataset.toggle_selector !== undefined ?
        $trigger.dataset.toggle_selector : '.js-accordion';
      var toggleTriggers = $scope.querySelectorAll(toggleTriggerSelector);
      if (toggleTriggers === null || !toggleTriggers.length) { return; }
      for (var i = 0, n = toggleTriggers.length; i < n; i++) {
        var $toggleTrigger = toggleTriggers[i];
        $toggleTrigger.classList.remove(activeClass);

        var targetSelector = $toggleTrigger.dataset.target;
        var $target = targetSelector !== undefined ?
          $scope.querySelector(targetSelector) : $toggleTrigger.nextElementSibling;
        if ($target === null) { continue; }
        $target.classList.remove(activeClass);
      }
    }
  };

  return EasyAccordion;

}));
