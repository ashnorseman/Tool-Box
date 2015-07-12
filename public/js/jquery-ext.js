/**
 * Created by Ash.Zhang on 2015/5/7.
 */


$.fn.extend({


  // Manipulation
  // --------------------------


  /**
   * Place the element at the center of the screen
   * You can set up margins if the element is larger than screen size.
   * @param {number} [marginTop=0]
   * @param {number} [marginLeft=0]
   * @returns {jQuery}
   */
  center: function (marginTop, marginLeft) {
    marginLeft = _.isPositive(marginLeft) ? +marginLeft : 0;
    marginTop = _.isPositive(marginTop) ? +marginTop : 0;

    return this.css({
      left: Math.max((document.documentElement.clientWidth - this.outerWidth()) / 2, marginLeft),
      top: Math.max((document.documentElement.clientHeight - this.outerHeight()) / 2, marginTop) + $(window).scrollTop()
    });
  },


  /**
   * Hide loading effect
   * @returns {jQuery}
   */
  hideLoading: function () {

    if (this[0].posStatic) {
      this[0].style.position = '';
      delete this[0].posStatic;
    }

    return this.children('.loading').remove().end();
  },


  /**
   * Show loading effect (used with css)
   * @returns {jQuery}
   */
  showLoading: function () {

    if (this.css('position') === 'static') {
      this.css('position', 'relative')[0].posStatic = true;
    }

    return this.append('<div class="loading"></div>');
  },


  /**
   * Swap two elements
   * Returns the original element.
   * @param {string|HTMLElement|jQuery} el
   * @returns {jQuery}
   */
  swapWith: function (el) {
    var $el = $(el),
        $cloneThis = this.clone(true),
        $cloneEl = $el.clone(true);

    $el.replaceWith($cloneThis);
    this.replaceWith($cloneEl);
    return $cloneThis;
  },


  // Offset
  // --------------------------


  /**
   * Test if an element covers the coordinate point (x, y)
   * x, y are relative to document.
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  coverPoint: function (x, y) {
    var offset = this.offset();

    return (x >= offset.left) && (y >= offset.top) && (x <= offset.left + this.outerWidth()) && (y <= offset.top + this.outerHeight());
  },


  // Traversing
  // --------------------------


  /**
   * Test if an element is the child of another
   * @param {string|HTMLElement|jQuery} parent
   * @returns {boolean}
   */
  isChildOf: function (parent) {
    var node = this[0].parentNode;

    parent = $(parent)[0];

    do {
      if (node === parent) return true;
      node = node.parentNode;
    } while (node);

    return false;
  }
});


// Events
// --------------------------

$(function (w, d) {
  var $d = $(d);


  // Different event names for desktop and mobile devices
  $.events = {
    click: w.isMobile ? 'touchend' : 'click'
  };


  /**
   * Click on document to close opened elements and its relevant elements
   */
  $d.on($.events.click, function (e) {

    $('[data-document-close]').each(function (i, el) {
      if (e.target === el || $(e.target).isChildOf(el)) return;

      $(el).removeClass('opened');
      $(el.getAttribute('data-document-close')).removeClass('opened');
    });
  });


  /**
   * Enter key shortcut
   * Hitting enter key on the element will trigger `click` event on relative `data-enter` element.
   */
  $d.on('keyup', '[data-enter]', function (e) {

    if (e.which === 13) {
      $(e.target.getAttribute('data-enter')).trigger($.events.click);
    }
  });


  /**
   * Accesskey
   * Trigger a click event from accesskey (when not focused on any inputs)
   */
  $d.on('keyup', function (e) {
    var tag = e.target.tagName.toUpperCase();

    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      $('[data-accesskey=' + e.which + ']').trigger($.events.click);
    }
  });


  /**
   * Checkbox select-all kit
   */

  // All
  $d.on('change', '[data-select-all]', function (e) {
    var checked = e.target.checked;

    $('[name="' + e.target.getAttribute('data-select-all') + '"]')
      .filter(checked ? ':not(:checked)' : ':checked')
      .prop('checked', checked)
      .trigger('change');
  });

  // Single
  $d.on('change', '[data-select]', function (e) {
    if (e.target.type !== 'checkbox') return;

    $(e.target.getAttribute('data-select'))
      .prop('checked', !$('[name="' + e.target.name + '"]:not(:checked)').length);
  });


  /**
   * Toggle Class
   * Click on the element to toggle classes of other elements.
   */
  $d.on($.events.click, '[data-toggle]', function (e) {
    var $el = $(e.target).closest('[data-toggle]');

    $($el[0].getAttribute('data-toggle'))
      .toggleClass($el[0].getAttribute('data-toggle-class'));

    // Prevent event conflict
    e.stopPropagation();
  });

}(window, document));
