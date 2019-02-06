export default {
  handleEvent: function(scopeElm, triggerSelector, type, func, isRemove = false) {
    var els = scopeElm.querySelectorAll(triggerSelector);
    if (els === null || !els.length) return;
    for (let i = 0, n = els.length; i < n; i++) {
      let listener = {
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
  init: function(scopeElm, options = {}) {
    if (scopeElm === undefined) scopeElm = document;

    const toggleSelector = (options.toggleSelector !== undefined) ?
      options.toggleSelector : '.js-accordion';
    this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion);

    const closeSelector = (options.closeSelector !== undefined) ?
      options.closeSelector : '.js-accordion-close';
    this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion);
  },
  destroy: function(scopeElm, options = {}) {
    if (scopeElm === undefined) scopeElm = document;

    const toggleSelector = (options.toggleSelector !== undefined) ?
      options.toggleSelector : '.js-accordion';
    this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion, true);

    const closeSelector = (options.closeSelector !== undefined) ?
      options.closeSelector : '.js-accordion-close';
    this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion, true);
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
  },
  closeAccordion: function(event) {
    const $scope = this.scopeElm;
    const $trigger = this.eventElm;
    const activeClass = $trigger.dataset.active_class !== undefined ?
      $trigger.dataset.active_class : '_state-active';
    const toggleTriggerSelector = $trigger.dataset.toggle_selector !== undefined ?
      $trigger.dataset.toggle_selector : '.js-accordion';
    const toggleTriggers = $scope.querySelectorAll(toggleTriggerSelector);
    if (toggleTriggers === null || !toggleTriggers.length) return;
    for (let i = 0, n = toggleTriggers.length; i < n; i++) {
      let $toggleTrigger = toggleTriggers[i];
      $toggleTrigger.classList.remove(activeClass);

      let targetSelector = $toggleTrigger.dataset.target;
      let $target = targetSelector !== undefined ?
        $scope.querySelector(targetSelector) : $toggleTrigger.nextElementSibling;
      if ($target === null) continue;
      $target.classList.remove(activeClass);
    }
  }
}

