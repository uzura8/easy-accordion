export default {
  init: function(scopeElm, options = {}) {
    const toggleSelector = (options.toggleSelector !== undefined) ?
      options.toggleSelector : '.js-accordion';
    if (scopeElm === undefined) scopeElm = document;
    const els = scopeElm.querySelectorAll(toggleSelector);
    if (els === null || !els.length) return;

    for (let i = 0, n = els.length; i < n; i++) {
      els[i].addEventListener('click', {
        handleEvent: this.toggleAccordion,
        scopeElm: scopeElm,
        eventElm: els[i],
        triggerSelector: toggleSelector
      });
    }
  },
  destroy: function(scopeElm, options = {}) {
    const toggleSelector = (options.toggleSelector !== undefined) ?
      options.toggleSelector : '.js-accordion';
    if (scopeElm === undefined) scopeElm = document;
    const els = scopeElm.querySelectorAll(toggleSelector);
    if (els === null || !els.length) return;

    for (let i = 0, n = els.length; i < n; i++) {
      els[i].removeEventListener('click', {
        handleEvent: this.toggleAccordion,
        scopeElm: scopeElm,
        eventElm: els[i],
        triggerSelector: toggleSelector
      });
    }
  },
  toggleAccordion: function() {
    const $scope = this.scopeElm;
    const $trigger = this.eventElm;
    const activeClass = $trigger.dataset.active_class !== undefined ?
      $trigger.dataset.active_class : '_state-active';
    const contentClass = $trigger.dataset.content_class !== undefined ?
      $trigger.dataset.content_class : 'accordion-content';
    const isScroll = $trigger.dataset.scroll === "1" ?
      $trigger.dataset.scroll : false;
    const groupSelector = $trigger.dataset.group !== undefined ?
      $trigger.dataset.group : '';
    const targetSelector = $trigger.dataset.target;
    const $target = targetSelector !== undefined ?
      $scope.querySelector(targetSelector) : $trigger.nextElementSibling;
    const toOpen = !$target.classList.contains(activeClass);
    const closeBtnSelector = $trigger.dataset.close !== undefined ?
      $trigger.dataset.close : '';

    var $groupParent = null;
    if (toOpen && groupSelector) {
      $groupParent = ((elem, selector) => {
        for (; elem && elem !== $scope; elem = elem.parentNode) {
          if (elem.matches(selector)) return elem;
        }
        return null;
      })($trigger, groupSelector);
      if ($groupParent !== null) {
        const accordionTriggers = $groupParent.querySelectorAll(this.triggerSelector);
        for (let i = 0, n = accordionTriggers.length; i < n; i++) {
          accordionTriggers[i].classList.remove(activeClass);
        }
        const accordionContents = $groupParent.querySelectorAll('.' + contentClass);
        for (let i = 0, n = accordionContents.length; i < n; i++) {
          accordionContents[i].classList.remove(activeClass);
        }
      }
    }

    $trigger.classList.toggle(activeClass);
    if ($target !== null) $target.classList.toggle(activeClass);

    if (toOpen && isScroll) {
      const $scrollTarget = $groupParent ? $groupParent : $trigger;
      ((targetElm) => {
        const targetPosY = targetElm.getBoundingClientRect().top;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = targetPosY + scrollTop;
        window.scrollTo(0, targetTop);
      })($scrollTarget);
    }
    // closeButton
    if (toOpen && closeBtnSelector && $target !== null) {
      const closeBtns = $target.querySelectorAll(closeBtnSelector);
      if (closeBtns !== null) {
        for (let i = 0, n = closeBtns.length; i < n; i++) {
          closeBtns[i].addEventListener('click', ((selfElm, closeBtnSelector, triggerElm, contentElm, activeClass) => {
            return function removeActive(event) {
              if (event.target.classList.contains(closeBtnSelector.slice(1))) {
                triggerElm.classList.remove(activeClass);
                contentElm.classList.remove(activeClass);
              }
              selfElm.removeEventListener('click', removeActive);
            }
          })(closeBtns[i], closeBtnSelector, $trigger, $target, activeClass), false);
        }
      }
    }
  }
}

