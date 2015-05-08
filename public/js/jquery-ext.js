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
