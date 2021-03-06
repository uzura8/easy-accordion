const EasyAccordion = {
  handleEvent: function(scopeElm, triggerSelector, type, func, isRemove = false) {
    var els = scopeElm.querySelectorAll(triggerSelector);
    if (els == null || !els.length) return;
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
    if (scopeElm == null) scopeElm = document;

    const toggleSelector = (options.toggleSelector != null) ?
      options.toggleSelector : '.js-accordion';
    this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion);

    const closeSelector = (options.closeSelector != null) ?
      options.closeSelector : '.js-accordion-close';
    this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion);

    const selectSelector = (options.selectSelector != null) ?
      options.selectSelector : '.js-accordion-select';
    this.handleEvent(scopeElm, selectSelector, 'change', this.selectAccordion);
  },
  destroy: function(scopeElm, options = {}) {
    if (scopeElm == null) scopeElm = document;

    const toggleSelector = (options.toggleSelector != null) ?
      options.toggleSelector : '.js-accordion';
    this.handleEvent(scopeElm, toggleSelector, 'click', this.toggleAccordion, true);

    const closeSelector = (options.closeSelector != null) ?
      options.closeSelector : '.js-accordion-close';
    this.handleEvent(scopeElm, closeSelector, 'click', this.closeAccordion, true);

    const selectSelector = (options.selectSelector != null) ?
      options.selectSelector : '.js-accordion-select';
    this.handleEvent(scopeElm, selectSelector, 'change', this.selectAccordion, true);
  },
  toggleAccordion: function() {
    const $scope = this.scopeElm;
    const $trigger = this.eventElm;
    const activeClass = $trigger.dataset.active_class != null ?
      $trigger.dataset.active_class : 'is-active';
    const contentClass = $trigger.dataset.content_class != null ?
      $trigger.dataset.content_class : 'accordion-content';
    const isScroll = $trigger.dataset.scroll === '1' ?
      $trigger.dataset.scroll : false;
    const groupSelector = $trigger.dataset.group != null ?
      $trigger.dataset.group : '';
    const targetSelector = $trigger.dataset.target;
    const $target = targetSelector != null ?
      $scope.querySelector(targetSelector) : $trigger.nextElementSibling;
    const toOpen = !$target.classList.contains(activeClass);

    var $groupParent = null;
    if (toOpen && groupSelector) {
      $groupParent = EasyAccordion.closest($trigger, groupSelector, $scope);
      if ($groupParent != null) {
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
    if ($target != null) $target.classList.toggle(activeClass);

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
    const $eventTarget = event.target;
    const activeClass = $trigger.dataset.active_class != null ?
      $trigger.dataset.active_class : 'is-active';
    const isScroll = $trigger.dataset.scroll === '1' ?
      $trigger.dataset.scroll : false;
    const ignoreSelector = $trigger.dataset.ignore;
    if (ignoreSelector && $eventTarget != $trigger) {
      if (EasyAccordion.closest($eventTarget, ignoreSelector, $scope) != null) {
        return;
      }
    }

    const toggleTriggerSelector = $trigger.dataset.trigger;
    if (toggleTriggerSelector == null  || !toggleTriggerSelector) return;
    const $toggleTrigger = $scope.querySelector(toggleTriggerSelector);
    if ($toggleTrigger == null) return;
    $toggleTrigger.classList.remove(activeClass);

    const targetSelector = $toggleTrigger.dataset.target;
    const $target = targetSelector != null ?
      $scope.querySelector(targetSelector) : $toggleTrigger.nextElementSibling;
    if ($target == null) return;
    $target.classList.remove(activeClass);

    if (isScroll) {
      ((targetElm) => {
        const targetPosY = targetElm.getBoundingClientRect().top;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = targetPosY + scrollTop;
        window.scrollTo(0, targetTop);
      })($toggleTrigger);
    }
  },
  selectAccordion: function() {
    const $scope = this.scopeElm;
    const $trigger = this.eventElm;
    const selectedIndex = $trigger.selectedIndex;
    const selectedValue = $trigger.options[selectedIndex].value;

    const activeClass = $trigger.dataset.active_class != null ?
      $trigger.dataset.active_class : 'is-active';
    const contentClass = $trigger.dataset.content_class != null ?
      $trigger.dataset.content_class : 'accordion-content';
    const groupSelector = $trigger.dataset.group != null ?
      $trigger.dataset.group : '';

    var toOpen = false;
    var $target = null;
    if (selectedValue) {
      const targetSelector = selectedValue;
      $target = $scope.querySelector(targetSelector);
      toOpen = !$target.classList.contains(activeClass);
    }
    var $groupParent = null;
    if (groupSelector) {
      $groupParent = EasyAccordion.closest($trigger, groupSelector, $scope);
      if ($groupParent != null) {
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
    if ($target != null && toOpen) $target.classList.add(activeClass);
  },
  closest: function(node, searchSelector, scopeElm) {
    if (searchSelector == null || !searchSelector) return null;
    if (scopeElm == null) scopeElm = document;

    const isIE = node.matches == null
    while(node != null && node != scopeElm) {
      if (isIE) {
        if (node.msMatchesSelector(searchSelector)) return node;
      } else {
        if (node.matches(searchSelector)) return node;
      }
      node = node.parentElement || node.parentNode;
    }
    return null;
  }
}

export default EasyAccordion;
