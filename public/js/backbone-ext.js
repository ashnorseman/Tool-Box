/**
 * Created by Ash.Zhang on 2015/5/12.
 */


(function (Model, Collection, View) {
  var modelMethods = ['get', 'set'],
      collectionMethods = ['add', 'remove', 'reset', 'set', 'get'],

  // Supports `onInitialize`, `onRender`, `onRemove`
      defaultCallbacks = ['initialize', 'render', 'remove', 'sort'],

      oldExtend = Model.extend,

      superFnReg = /\b_super\b/,

      extend,

      ItemView, CollectionView,

      Module;


  /**
   * Model and View inheritance
   * Extends settings objects like `defaults`, `events`, `modelEvents`, `viewEvents`.
   * Parent methods will be overwritten.
   * @param {Object} options
   * @returns {Object}
   */
  extend = function (options) {
    var inherited = oldExtend.apply(this, arguments),
        key, prop, parentProp;

    // Merge options
    for (key in options) if (options.hasOwnProperty(key)) {
      prop = options[key];
      parentProp = this.prototype[key];

      if (_.isPureObject(prop) && _.isPureObject(parentProp)) {

        // Properties
        inherited.prototype[key] = _.extend({}, parentProp, prop);
      } else if (_.isFunction(prop) && superFnReg.test(prop)) {

        // Methods
        inherited.prototype[key] = (function (fn, superFn) {

          return function () {
            var tempSuper = this._super,
                result;

            this._super = superFn;
            result = fn.apply(this, arguments);
            this._super = tempSuper;

            return result;
          };
        }(prop, parentProp));
      }
    }

    return inherited;
  };


  // ItemView
  // --------------------------


  /**
   * template
   * ui (available after render)
   * modelEvents
   * viewEvents
   * @constructor
   */
  ItemView = Backbone.ItemView = function () {

    // Inherits
    this.dataShortcut(modelMethods);
    View.apply(this, arguments);

    // Events listening
    this.listenToDataEvents(_.result(this, 'modelEvents'));
    this.listenToViewEvents(defaultCallbacks);              // Default
    this.listenToViewEvents(_.result(this, 'viewEvents'));  // Custom

    // Link
    this.model && (this.model.view = this);

    // Finish
    this.trigger('initialize');
  };


  // ItemView API
  // --------------------------

  _.extend(ItemView.prototype, View.prototype, {
    template: '',


    /**
     * Make `render` method to do something
     * Used for rendering the whole structure.
     * @returns {Backbone.ItemView}
     */
    render: function () {
      this._initTemplate();
      this.$el.html(this.template(this.model ? this.model.toJSON() : null));
      this._makeUiShortcuts();
      this.trigger('render');
      return this;
    },


    /**
     * Trigger a remove event
     * @returns {Backbone.ItemView}
     */
    remove: function () {
      this.trigger('remove');
      return View.prototype.remove.apply(this, arguments);
    },


    /**
     * Link another view, and listens for its view events and model events
     * `~EventsListening` means listen to another view or its model's events
     * `~EventsListened` means another view is listening to this view or its models events
     * @param {Backbone.ItemView}         anotherView
     * @param {Object}                    options
     * @param {string|jQuery|HTMLElement} options.holder (effective after parent render)
     * @param {object}                    options.modelEventsListening
     * @param {object}                    options.viewEventsListening
     * @param {object}                    options.modelEventsListened
     * @param {object}                    options.viewEventsListened
     * @param {string}                    [options.anotherName]
     * @param {string}                    [options.thisName]
     * @returns {Backbone.ItemView}
     */
    linkView: function (anotherView, options) {
      options || (options = {});

      // Links
      this[options.anotherName || 'child'] = anotherView;
      anotherView[options.thisName || 'parent'] = this;

      // Attach element
      if (options.holder) anotherView.$el.appendTo(this.$(options.holder));

      // Two-way event listening
      this.listenToDataEvents(options.modelEventsListening, anotherView.model);
      this.listenToViewEvents(options.viewEventsListening, anotherView);
      anotherView.listenToDataEvents(options.modelEventsListened, this.model);
      anotherView.listenToViewEvents(options.viewEventsListened, this);

      return this;
    },


    /**
     * Listen to data events map
     * Like: { dataEvents: { 'change:value': 'render' } }
     * @param {{event: string|Function}}            dataEvents
     * @param {Backbone.Model|Backbone.Collection}  [data]
     * @param {string}                              [type]
     * @returns {Backbone.ItemView}
     */
    listenToDataEvents: function (dataEvents, data, type) {
      var key, method;

      type = type || 'model';

      if (!(data || (data = this[type])) || !dataEvents) return this;

      // e.g. { click: 'getData', clear: function () {} }
      for (key in dataEvents) if (dataEvents.hasOwnProperty(key)) {
        if (!_.isFunction(method = dataEvents[key]) && !_.isFunction(method = this[method])) return;
        this.listenTo(data, key, method);
      }

      return this;
    },


    /**
     * Listen to view events map
     * `viewEvents` can be an array or a map
     * An array will auto generate callbacks like `render` -> `onRender`
     * @param {[string]|{event: string|Function}} viewEvents
     * @param {Backbone.View}                     [view]
     * @returns {Backbone.ItemView}
     */
    listenToViewEvents: function (viewEvents, view) {
      var cb, cbName, key;

      if (!viewEvents) return this;

      if (_.isArray(viewEvents)) {

        // e.g. ['initialize', 'render', 'remove']
        _.each(viewEvents, function (event) {
          cbName = 'on' + _.capitalize(event);
          if (!_.isFunction(cb = this[cbName])) return;
          this.on(event, cb);
        }, this);
      } else {

        // e.g. { click: 'getData', clear: function () {} }
        for (key in viewEvents) if (viewEvents.hasOwnProperty(key)) {
          if (!_.isFunction(cb = viewEvents[key]) && !_.isFunction(cb = this[cb])) return;

          if (view) {
            this.listenTo(view, key, cb); // Listen to another view
          } else {
            this.on(key, cb);             // This view
          }
        }
      }

      return this;
    },


    /**
     * Make model or collection methods callable by the view
     * `this` still refers to the model or collection in methods
     * @param {[string]}  methods
     * @param {string}    type - 'model' or 'collection'
     * @returns {Backbone.ItemView}
     */
    dataShortcut: function (methods, type) {
      type || (type = 'model');

      _.each(methods, function (method) {
        this[method] = function () {
          if (this[type]) return this[type][method].apply(this[type], arguments);
        }
      }, this);

      return this;
    },


    /**
     * If `template` is a string, make it function
     * @private
     */
    _initTemplate: function () {
      if (_.isFunction(this.template)) return;
      this.template = _.template(this.template);
    },


    /**
     * Make UI shortcuts from map { ui: { name: '.selector' } }
     * @private
     */
    _makeUiShortcuts: function () {
      var ui = this.ui,
          key, $el;

      if (!ui) return;

      for (key in ui) if (ui.hasOwnProperty(key)) {

        if (($el = this.$(ui[key])).length) {
          ui[key] = $el;
        } else {
          delete ui[key];
        }
      }
    }
  });


  // Collection View
  // --------------------------


  /**
   * Create a CollectionView with given ItemView and Model
   * @constructor
   */
  CollectionView = Backbone.CollectionView = extend.call(ItemView, {

    initialize: function (options) {
      this.initializing = true;
      options || (options = {});

      // Sort
      if (this.sortable) this._initSort();

      // collection data
      this.collection = new this.constructor.prototype.collection(options.collection);
      this.dataShortcut(collectionMethods, 'collection');
      this.listenToDataEvents({
        add: 'addChild',
        remove: 'removeChild',
        reset: 'resetChild'
      }, this.collection);

      // Generate views
      this.resetChild();

      this.initializing = false;
    },


    /**
     * Render the elements
     * @returns {Backbone.CollectionView}
     */
    render: function () {
      this.$el.empty();
      this.renderChildren(this.children);
      this.trigger('render');
      return this;
    },


    /**
     * Render an array of views or a single view
     * @param {[ItemView]|ItemView} views
     * @returns {Backbone.CollectionView}
     */
    renderChildren: function (views) {
      views = _.castArray(views);

      _.each(views, function (view) {
        this.$el.append(view.render().$el);
      }, this);

      return this;
    },


    /**
     * Init sorting functions
     * @returns {Backbone.CollectionView}
     * @private
     */
    _initSort: function () {
      var childProto = this.childView.prototype;

      // jQuery UI api
      this.$el.sortable({
        items: '> *',
        stop: _.bind(this._triggerSort, this)
      });

      // Extend childView's DOM sort event
      _.extend((childProto.events = childProto.events || {}), {
        sort: this._sort
      });

      return this;
    },


    /**
     * Trigger sort event from DOM element to views
     * @param {Event} e
     * @param {Object} ui
     * @private
     */
    _triggerSort: function (e, ui) {
      var $item = $(ui.item),
          newIndex = $item.parent().children().index($item);

      $item.trigger('sort', [newIndex, this]);
    },


    /**
     * Rearrange models and views
     * @param {Event}   e
     * @param {number}  newIndex
     * @param {Backbone.CollectionView} cv
     * @private
     */
    _sort: function (e, newIndex, cv) {
      cv.children.splice(newIndex, 1, this);
      cv.collection.models.splice(newIndex, 1, this.model);
      cv.trigger('sort', this, newIndex);
    },


    // Children management
    // -----------------------


    /**
     * Create and add the view of a model
     * @param {Object} model
     * @returns {Backbone.CollectionView}
     */
    addChild: function (model) {
      var child = new this.childView({
        model: model
      });

      child.parent = this;
      this.children.push(child);

      // Don't render the view or execute add callback when resetting
      if (!this.resetting) {
        this.renderChildren(child);
        if (_.isFunction(this.onAdd)) this.onAdd.apply(this, arguments);
      }

      return this;
    },


    /**
     * Remove the view of a model
     * @param {Object} model
     * @returns {Backbone.CollectionView}
     */
    removeChild: function (model) {
      this.children = _.without(this.children, model.view);
      model.view.remove();
      if (_.isFunction(this.onRemove)) this.onRemove.apply(this, arguments);
      return this;
    },


    /**
     * Reset child views
     * @returns {Backbone.CollectionView}
     */
    resetChild: function () {
      this.resetting = true;
      this.children = [];

      this.collection.each(function (model) {
        this.addChild(model);
      }, this);

      // Don't render view or trigger reset event on initializing stage
      if (!this.initializing) {
        this.render();
        if (_.isFunction(this.onReset)) this.onReset();
      }

      this.resetting = false;

      return this;
    }
  });


  CollectionView.extend = ItemView.extend = View.extend = Model.extend = extend;


  // Module Builder
  // --------------------------


  /**
   * Create a Module (View) easily
   * @param {Object}    options
   * @param {Object}    options.dataDefaults - Model `defaults`
   * @param {Object}    options.dataHandlers - other Model settings
   * @param {String}    options.template - View template
   * @param {Object}    options.ui - ui hash
   * @param {Function}  options.initialize
   * @param {Function}  options.onInitialize
   * @param {Function}  options.onRender
   * @param {Function}  options.onRemove
   * @param {Object}    options.domEvents
   * @param {Object}    options.domApi
   * @param {Object}    options.modelEvents
   * @param {Object}    options.modelApi
   * @param {Object}    options.viewEvents
   * @param {Object}    options.viewApi
   * @returns {ItemView}
   * @constructor
   */
  Module = Backbone.Module = function Module(options) {
    if (!(this instanceof Module)) return new Module(options);

    options || (options = {});

    options = _.safeExtendOwn({
      events: options.domEvents
    }, options, options.domApi, options.modelApi, options.viewApi);

    delete options.domEvents;
    delete options.domApi;
    delete options.modelApi;
    delete options.viewApi;

    this.Model = Model.extend(_.safeExtendOwn({
      defaults: options.dataDefaults
    }, options.dataHandlers));

    delete options.dataDefaults;
    delete options.dataHandlers;

    this.View = ItemView.extend(options);
  };

  _.extend(Module.prototype, {


    /**
     * Create a Module instance
     * @param {Object} options
     * @returns {ItemView}
     */
    create: function (options) {

      return new this.View(_.extend({
        model: new this.Model(options)
      }, options));
    }
  });


  // ListModule
  // -------------------------

  /**
   * Create a ListModule (View) easily
   * @param {Object}    options - CollectionView settings
   * @param {Object}    options.itemSettings - ItemView settings
   * @returns {CollectionView}
   * @constructor
   */
  ListModule = Backbone.ListModule = function (options) {
    if (!(this instanceof ListModule)) return new ListModule(options);

    options || (options = {});

    // Model
    this.Model = Model.extend(_.safeExtendOwn({
      defaults: options.dataDefaults
    }, options.dataHandlers));

    delete options.dataDefaults;
    delete options.dataHandlers;

    // Collection
    this.Collection = Collection.extend({
      model: this.Model
    });

    // Child views
    this.ChildView = Module(options.itemSettings).View;
    delete options.itemSettings;

    // View
    options = _.safeExtendOwn({
      childView: this.ChildView,
      collection: this.Collection,
      events: options.domEvents
    }, options, options.domApi, options.modelApi, options.viewApi);

    delete options.domEvents;
    delete options.domApi;
    delete options.modelApi;
    delete options.viewApi;

    this.View = CollectionView.extend(options);
  };


  _.extend(ListModule.prototype, {


    /**
     * Create a ListModule instance
     * @param {[Object]} collection
     * @returns {CollectionView}
     */
    create: function (collection) {

      return new this.View({
        collection: collection
      });
    }
  });


}(Backbone.Model, Backbone.Collection, Backbone.View));
