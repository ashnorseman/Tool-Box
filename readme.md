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

* * *

Underscore Plugins
------------------

### Arrays

#### `_.castArray(val)`

Pack the argument in an array

Return itself if it is an array.

    @param {any} val
    @returns {Array}

#### `_.createArray(len, defaults)`

Create an array of certain length filled with default values

    @param {number} len
    @param {any}    defaults
    @returns {Array}

#### `_.defaultsArray(arr, obj)`

Add default values to each of array items

    @param {Array}   arr
    @param {Object}  obj
    @returns {Array}

#### `_.moveIndex(arr, item, step)`

Move an item within its parent array

step > 0: move down

step < 0: move up

    @param {Array} arr
    @param {any} item
    @param {number} step

### Dates

#### `_.dayStart(timestamp)`

The start point (0 millisecond) of a day

    @param {number|Date} timestamp
    @returns {number}

#### `_.dayEnd(timestamp)`

The end point (last millisecond) of a day

    @param {number|Date} timestamp
    @returns {number}

#### `_.formatTime(timestamp, format)`

Format a date to a string

Supports: YYYY, YY, MM, M, DD, D, HH, H, mm, m, ss, s

    @param {number|Date} timestamp
    @param {string}      [format='YYYY-MM-DD']
    @returns {string}

### Objects

#### `_.exists(val)`

Checks whether or not the value is "existy"

Both null and undefined are considered non-existy values.

All other values are existy.

    @param {any} val
    @returns {boolean}

#### `_.isNegative(num)`

Checks whether the value is a negative number

    @param {number} num
    @returns {boolean}

#### `_.isPositive(num)`

Checks whether the value is a positive number

    @param {number} num
    @returns {boolean}

#### `_.isPureObject(obj)`

Checks whether the value is pure object (neither function nor regex)

    @param obj
    @returns {boolean}

#### `_.isValidDate(date)`

Checks whether the value is a valid date

That is, the value is both an instance of Date and it represents an actual date.

    @param {Date} date
    @returns {boolean}

#### `_.notEmpty(str)`

Checks the string exists and is not empty

    @param {string} str
    @returns {boolean}

#### `_.safeExtendOwn(obj)`

Behaves like _.defaults

But will log an error when a key already exists in the destination object

    @param {any} obj
    @returns {any}

#### `_.snapshot(obj)`

Snapshots/clones an object deeply

    @param {Object} obj
    @returns {Object}

### Utility

#### `_.capitalize(str)`

Capitalize a string

Default behavior will not change letters after the first one

    @param {string}  str
    @param {boolean} lowerRest (lowercase following letters)
    @returns {string}

#### `_.error()`

Safe console.error

#### `_.int(val)`

Parse integer based 10

    @param {number} val
    @returns {number}

#### `_.formatNumber(num, digits)`

Format number to styles like '1,234,567.00' or '-1,234,567.00'

    @param {number} num
    @param {number} digits
    @returns {string}

#### `_.log()`

Safe console.log

#### `_.num(str)`

Convert a string to number if possible.
If the string can be convert to a number, return the number, or return the string.

    @param {string} str
    @returns {number|string}

#### `_.pad(str, targetLen, pad, fromRight)`

Pad a string with any character to given length

    @param {string}  str
    @param {number}  [targetLen=2]
    @param {string}  [pad='0']
    @param {boolean} [fromRight=false]
    @returns {string}

#### `_.parseNumber(str)`

Parse number in formats like `1,234,567.00` to `1234567`

    @param {string} str
    @returns {number}

#### `_.parseQuery(queryStr)`

Parse a query string to an object

    @param {string} queryStr - like '?a=b&c=d'
    @returns {Object}

### Language

#### `_.addLang(options)`

Add language locale keys

    @param {{code:Object}}   options
    @param {{locale:string}} options.code

#### `_.hasLang(code)`

Test if the language code has data

    @param {string} code
    @returns {boolean}

#### `_.parseLocale(locale)`

Return a parsed Locale code of current language

    @param {string} locale
    @returns {string}

#### `_.setLang(code)`

Set langCode

    @param {string} code

* * *

Backbone Plugin
---------------

### .extend(options)

Extends settings objects like `defaults`, `events`, `modelEvents`, `viewEvents`.

Parent methods will be overwritten.

Tested on Model and View. Don't use it on Collection.

    @param {Object} options
    @returns {Object}

### ._super(method, args)

Call parent's method

    @param {string} method
    @param args
    @private

### Backbone.ItemView

#### `Backbone.ItemView.extend()`

    Backbone.ItemView.extend({
      template: '<div class="data"><%= attr %></div>',

      ui: {
        data: '.data'
      },

      events: {
        'click .data': 'onClickData'
      },

      modelEvents: {
        change: 'onModelChange'
      },

      viewEvents: {
        clear: 'onViewChange'
      },

      onInitialize: function () {},
      onRender: function () {},
      onRemove: function () {},

      onClickData: function () {},

      onModelChange: function () {},

      onViewChange: function () {}
    });

`ui`: elements saved at `this.ui.data`

`modelEvents`: model events listened

`viewEvents`: view events listened

`onInitialize, onRender, onRemove`: callbacks fired after `initialize, render, remove`

#### `itemView.get()`
#### `itemView.set()`
#### `itemView.unset()`
#### `itemView.clear()`

These are shortcut methods to the model.

#### `itemView.modelShortcut(modelMethods)`

Make model methods callable by the view

`this` still refers to the model in methods

    @param {[string]} modelMethods
    @returns {Backbone.ItemView}

#### `itemView.listenToModelEvents(modelEvents, model)`

Listen to model events map

Like: { modelEvents: { 'change:value': 'render' } }

    @param {{event: string|Function}} modelEvents
    @param {Backbone.Model}           [model]
    @returns {Backbone.ItemView}

#### `itemView.listenToViewEvents(viewEvents, view)`

Listen to view events map

`viewEvents` can be an array or a map

An array will auto generate callbacks like `render` -> `onRender`

    @param {[string]|{event: string|Function}}  viewEvents
    @param {Backbone.View}                      [view]
    @returns {Backbone.ItemView}

#### `itemView.linkView(anotherView, options)`

Link another view, and listens for its view events and model events

`~EventsListening` means listen to another view or its model's events

`~EventsListened` means another view is listening to this view or its models events

    @param {Backbone.ItemView}         anotherView
    @param {Object}                    options
    @param {string|jQuery|HTMLElement} options.holder (effective after parent render)
    @param {object}                    options.modelEventsListening
    @param {object}                    options.viewEventsListening
    @param {object}                    options.modelEventsListened
    @param {object}                    options.viewEventsListened
    @param {string}                    [options.anotherName]
    @param {string}                    [options.thisName]
    @returns {Backbone.ItemView}
