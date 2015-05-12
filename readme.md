Tool Box
========

jQuery Plugins
--------------

### Manipulation

#### `.center(marginTop, marginLeft)`

Place the element at the center of the screen

You can set up margins if the element is larger than screen size.

    @param {number} [marginTop=0]
    @param {number} [marginLeft=0]
    @returns {jQuery}

#### `.swapWith(el)`

Swap two elements

Returns the original element.

    @param {string|HTMLElement|jQuery} el
    @returns {jQuery}

### Offset

#### `.coverPoint(x, y)`

Test if an element covers the coordinate point (x, y)

x, y are relative to document.

    @param {number} x
    @param {number} y
    @returns {boolean}

### Traversing

#### `.isChildOf(parent)`

Test if an element is the child of another

    @param {string|HTMLElement|jQuery} parent
    @returns {boolean}
