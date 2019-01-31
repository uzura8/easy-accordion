'use strict';

function simpleAccordion(targetElm) {
  var selfSelector = '.js-accordion';
  if (targetElm === undefined) targetElm = document;
  var els = targetElm.querySelectorAll(selfSelector);
  if (els === null) return;

  for (var i = 0, n = els.length; i < n; i++) {
    els[i].addEventListener('click', function() {
      var $el = this;
      var activeClass = $el.dataset.active_class !== undefined ?
            $el.dataset.active_class : '_state-active';
      var contentClass = $el.dataset.content_class !== undefined ?
            $el.dataset.content_class : 'accordion-content';
      var isScroll = $el.dataset.scroll === '1' ? $el.dataset.scroll : false;
      var groupSelector = $el.dataset.group !== undefined ? $el.dataset.group : '';
      var target = $el.dataset.target;
      var $target = target !== undefined ?
            targetElm.querySelector(target) : $el.nextElementSibling;
      var toOpen = $target !== null && !$target.classList.contains(activeClass);

      // Close other accordions in group
      var $groupParent = null;
      if (toOpen && groupSelector) {
        $groupParent = (function(elem, selector) {
          for (; elem && elem !== targetElm; elem = elem.parentNode) {
            if (elem.matches(selector)) return elem;
          }
          return null;
        })($el, groupSelector);
        if ($groupParent !== null) {
          var accordionTriggers = $groupParent.querySelectorAll(selfSelector);
          for (var i = 0, n = accordionTriggers.length; i < n; i++) {
            accordionTriggers[i].classList.remove(activeClass);
          }
          var accordionContents = $groupParent.querySelectorAll('.' + contentClass);
          for (var i = 0, n = accordionContents.length; i < n; i++) {
            accordionContents[i].classList.remove(activeClass);
          }
        }
      }

      // Toggle target accordion
      $el.classList.toggle(activeClass);
      if ($target !== null) $target.classList.toggle(activeClass);

      // Scroll
      if (toOpen && isScroll) {
        var $scrollTarget = $groupParent ? $groupParent : $el;
        (function(targetElm) {
          var targetPosY = targetElm.getBoundingClientRect().top;
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          var targetTop = targetPosY + scrollTop;
          window.scrollTo(0, targetTop);
        })($scrollTarget);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  simpleAccordion();
});

