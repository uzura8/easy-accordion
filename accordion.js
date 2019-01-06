'use strict';

document.addEventListener('click', function(event) {
  var $el = event.target;
  var i = 0;
  while ($el.classList.contains('js-accordion') === false && i < 5) { // Check up to 5 levels above
    if ($el.parentElement === null) break;
    $el = $el.parentElement;
    i++;
  }
  if ($el.classList.contains('js-accordion') === false) return;

  var activeClass = $el.dataset.active_class !== undefined ? $el.dataset.active_class : 'is-active';
  var isScroll = $el.dataset.scroll == 1 ? $el.dataset.scroll : false;
  var groupSelector = $el.dataset.group !== undefined ? $el.dataset.group : '';
  var target = $el.dataset.target;
  var $target = target !== undefined ? document.getElementById(target) : $el.nextElementSibling;
  var toOpen = !$target.classList.contains(activeClass);

  // Close other accordions
  var $groupParent = null;
  if (toOpen && groupSelector.length > 0) {
    $groupParent = (function(elem, selector) {
      for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
      }
      return null;
    })($el, groupSelector);
    if ($groupParent !== null) {
      for (var i = 0, n = $groupParent.children.length; i < n; i++) {
        var $child = $groupParent.children[i];
        var $childTrigger = $child.querySelector('.js-accordion');
        if ($childTrigger) $childTrigger.classList.remove(activeClass);
        var $childAccordion = $child.querySelector('.accordion-content');
        if ($childAccordion) $childAccordion.classList.remove(activeClass);
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
}, false);
