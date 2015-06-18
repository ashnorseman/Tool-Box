Tool Box
========

Detect Device
-------------

### Mobile

    window.isMobile         // => true, false
    $('html')[0].className  // => 'no-mobile', 'mobile'

### Device pixel ratio

    window.dpr      // => 1, 2, 3
    document.cookie // => 'dpr=1'

### jQuery events

    $.events.click  // => 'click', 'touchend'

jQuery Plugins
--------------

### Manipulation

#### `.center(marginTop, marginLeft)`

Place the element at the center of the screen

You can set up margins if the element is larger than screen size.

    @param {number} [marginTop=0]
    @param {number} [marginLeft=0]
    @returns {jQuery}

#### `.hideLoading()`

Hide loading effect (used with css)

    @returns {jQuery}

#### `.showLoading()`

Show loading effect (used with css)

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

### Events

#### `[data-document-close="#close"]`

Click on document to close opened elements and its relevant elements

#### `[data-enter="#enter"]`

Enter key shortcut

Hitting enter key on the element will trigger `click` event on relative `data-enter` element.

#### `[data-select-all="select-name"], [data-select="#select-all"]`

Checkbox select-all kit

#### `[data-toggle="#toggle"] [data-toggle-class="toggle-class"]`

Toggle Class

Click on the element to toggle classes of other elements.

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

Use `this._super()` to call parent's method.

Tested on Model and View. Don't use it on Collection.

    @param {Object} options
    @returns {Object}

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

#### `itemView.dataShortcut(methods, type)`

Make model or collection methods callable by the view

`this` still refers to the model or collection in methods

    @param {[string]} methods
    @param {string}    type - 'model' or 'collection'
    @returns {Backbone.ItemView}

#### `itemView.listenToDataEvents(dataEvents, model)`

Listen to model or collection events map

Like: { dataEvents: { 'change:value': 'render' } }

    @param {{event: string|Function}} dataEvents
    @param {Backbone.Model|Backbone.Collection} [data]
    @param {string} [type]
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

### Backbone.CollectionView

#### `Backbone.CollectionView.extend()`

    var CV = Backbone.CollectionView.extend({
      tagName: 'ul',
      childView: Backbone.ItemView.extend({
        tagName: 'li',
        template: '<%= id %>'
      }),
      collection: Backbone.Collection.extend({
        model: Backbone.Model
      }),
      sortable: true,
      onAdd: function (model, collection, prop) { }
      onRemove: function (model, collection, prop) { }
      onReset: function () { },
      onSort: function (view, newIndex) { }
    }),
    cv = new CV({
      collection: [ { id: 1 }, { id: 2 }, { id: 3 } ]
    });

`childView`: Backbone.ItemView

`collection`: Backbone.Collection

`onAdd`, `onRemove`, `onReset`: callbacks

`sortable` and `onSort`: drag and drop sorting (jQuery UI)

#### collectionView.add(model)
#### collectionView.remove(model)
#### collectionView.reset([model1, model2])

### Backbone.Module

#### Backbone.Module(options)

Backbone Module builder.

    var Mod = Backbone.Module({

      // Model settings
      dataDefaults: {
        prop: 'value'
      },

      dataHandlers: {
        initialize: function (options) {
          this.init = options.init;
        }
      },

      // View settings
      template: '<a><span><%= text %></span></span></a>',

      initialize: function (options) {
        this.set('viewInit', options.viewInit);
      },

      onRender: function () {
        this.setElement(this.$('a'));
      },

      ui: {
        span: 'span'
      },

      // DOM events
      domEvents: {
        click: 'clickLink'
      },

      domApi: {
        clickLink: function (e) {
          this.set('link', this.ui.span.text());
        }
      },

      // Model events
      modelEvents: {
        'change:link': 'changeLink'
      },

      modelApi: {
        changeLink: function (model, value) {
          this.set('linkChanged', value);
        }
      },

      // View events
      viewEvents: {
        viewChange: 'viewChange'
      },

      viewApi: {
        viewChange: function (value) {
          this.set('viewChanged', value);
        }
      }
    });

    @param {Object}    options
    @param {Object}    options.dataDefaults - Model `defaults`
    @param {Object}    options.dataHandlers - other Model settings
    @param {String}    options.template - View template
    @param {Object}    options.ui - ui hash
    @param {Function}  options.initialize
    @param {Function}  options.onInitialize
    @param {Function}  options.onRender
    @param {Function}  options.onRemove
    @param {Object}    options.domEvents
    @param {Object}    options.domApi
    @param {Object}    options.modelEvents
    @param {Object}    options.modelApi
    @param {Object}    options.viewEvents
    @param {Object}    options.viewApi

#### Module.create(options)

Create a Module instance.

    @param {Object} options
    @returns {ItemView}

### Backbone.ListModule

#### Backbone.ListModule(options)

Backbone ListModule builder.

    var Mod = Backbone.ListModule({

      // Model settings
      dataDefaults: {
        prop: 'value'
      },

      dataHandlers: {
        initialize: function (options) {
          this.init = options.init;
        }
      },

      // View settings
      tagName: 'ul',
      template: '<%= id %>',
      sortable: true,

      // ItemView settings
      itemSettings: {
        tagName: 'li',
        template: '<%= id %>',

        domEvents: {
          click: function (e) { }
        },

        modelEvents: {
          change: function (model, value) { }
        },

        viewEvents: {
          viewChange: function (value) { }
        }
      }
    });

    @param {Object}    options
    @param {Object}    options.itemSettings - ItemView settings

#### ListModule.create(collection)

Create a ListModule instance.

    @param {[Object]} collection
    @returns {CollectionView}

    var list = List.create([ { id: 1 }, { id: 2 } ]);

    list.children   // => [ItemView]
    list.collection // => Backbone.Collection