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

      var toggleSelector = options.toggleSelector != null ?
        options.toggleSelector : '.js-accordion';
      this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion);

      var closeSelector = options.closeSelector != null ?
        options.closeSelector : '.js-accordion-close';
      this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion);

      var selectSelector = options.selectSelector != null ?
        options.selectSelector : '.js-accordion-select';
      this.handleEvent(scopeElm, selectSelector, 'change', this.selectAccordion);
    },
    destroy: function(scopeElm, options) {
      if ( options === void 0 ) options = {};

      if (scopeElm === undefined) { scopeElm = document; }

      var toggleSelector = options.toggleSelector != null ?
        options.toggleSelector : '.js-accordion';
      this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion, true);

      var closeSelector = options.closeSelector != null ?
        options.closeSelector : '.js-accordion-close';
      this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion, true);

      var selectSelector = options.selectSelector != null ?
        options.selectSelector : '.js-accordion-select';
      this.handleEvent(scopeElm, selectSelector, 'change', this.selectAccordion, true);
    },
    toggleAccordion: function() {
      var $scope = this.scopeElm;
      var $trigger = this.eventElm;
      var activeClass = $trigger.dataset.active_class != null ?
        $trigger.dataset.active_class : 'is-active';
      var contentClass = $trigger.dataset.content_class != null ?
        $trigger.dataset.content_class : 'accordion-content';
      var isScroll = $trigger.dataset.scroll === '1' ?
        $trigger.dataset.scroll : false;
      var groupSelector = $trigger.dataset.group != null ?
        $trigger.dataset.group : '';
      var targetSelector = $trigger.dataset.target != null ?
        $trigger.dataset.target : '';
      var $target = targetSelector ?
        $scope.querySelector(targetSelector) : $trigger.nextElementSibling;
      var toOpen = !$target.classList.contains(activeClass);

      var $groupParent = null;
      if (toOpen && groupSelector) {
        $groupParent = EasyAccordion.closest($trigger, groupSelector, $scope);
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
      var $eventTarget = event.target;
      var activeClass = $trigger.dataset.active_class != null ?
        $trigger.dataset.active_class : 'is-active';
      var ignoreSelector = $trigger.dataset.ignore;
      if (ignoreSelector && $eventTarget != $trigger) {
        if (EasyAccordion.closest($eventTarget, ignoreSelector, $scope) !== null) {
          return;
        }
      }

      var toggleTriggerSelector = $trigger.dataset.trigger;
      if (toggleTriggerSelector === undefined  || !toggleTriggerSelector) { return; }
      var $toggleTrigger = $scope.querySelector(toggleTriggerSelector);
      if ($toggleTrigger === undefined) { return; }
      $toggleTrigger.classList.remove(activeClass);

      var targetSelector = $toggleTrigger.dataset.target != null ?
        $toggleTrigger.dataset.target : '';
      var $target = targetSelector ?
        $scope.querySelector(targetSelector) : $toggleTrigger.nextElementSibling;
      if ($target == null) { return; }
      $target.classList.remove(activeClass);
    },
    selectAccordion: function() {
      var $scope = this.scopeElm;
      var $trigger = this.eventElm;
      var selectedIndex = $trigger.selectedIndex;
      var selectedValue = $trigger.options[selectedIndex].value;

      var activeClass = $trigger.dataset.active_class != null ?
        $trigger.dataset.active_class : 'is-active';
      var contentClass = $trigger.dataset.content_class != null ?
        $trigger.dataset.content_class : 'accordion-content';
      var groupSelector = $trigger.dataset.group != null ?
        $trigger.dataset.group : '';

      var toOpen = false;
      var $target = null;
      if (selectedValue) {
        var targetSelector = selectedValue;
        $target = $scope.querySelector(targetSelector);
        toOpen = !$target.classList.contains(activeClass);
      }
      var $groupParent = null;
      if (groupSelector) {
        $groupParent = EasyAccordion.closest($trigger, groupSelector, $scope);
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
      if ($target !== null && toOpen) { $target.classList.add(activeClass); }
    },
    closest: function(node, searchSelector, scopeElm) {
      if (searchSelector === null || !searchSelector) { return null; }
      if (scopeElm === null) { scopeElm = document; }

      var isIE = node.matches == null;
      while(node !== null && node != scopeElm) {
        if (isIE) {
          if (node.msMatchesSelector(searchSelector)) { return node; }
        } else {
          if (node.matches(searchSelector)) { return node; }
        }
        node = node.parentElement || node.parentNode;
      }
      return null;
    }
  };

  return EasyAccordion;

}));
