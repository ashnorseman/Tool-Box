/**
 * Created by Ash.Zhang on 2015/5/12.
 */


(function (Model, View) {
  var modelMethods = ['get', 'set', 'unset', 'clear'],

      // Supports `onInitialize`, `onRender`, `onRemove`
      defaultCallbacks = ['initialize', 'render', 'remove'],

      ItemView;


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
    View.apply(this, arguments);
    this.modelShortcut(modelMethods);

    // Events listening
    this.listenToModelEvents(_.result(this, 'modelEvents'));
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
      this.listenToModelEvents(options.modelEventsListening, anotherView.model);
      this.listenToViewEvents(options.viewEventsListening, anotherView);
      anotherView.listenToModelEvents(options.modelEventsListened, this.model);
      anotherView.listenToViewEvents(options.viewEventsListened, this);

      return this;
    },


    /**
     * Listen to model events map
     * Like: { modelEvents: { 'change:value': 'render' } }
     * @param {{event: string|Function}}  modelEvents
     * @param {Backbone.Model}            [model]
     * @returns {Backbone.ItemView}
     */
    listenToModelEvents: function (modelEvents, model) {
      var key, method;

      model || (model = this.model);
      if (!model || !modelEvents) return this;

      for (key in modelEvents) if (modelEvents.hasOwnProperty(key)) {
        method = modelEvents[key];
        if (!_.isFunction(method)) method = this[modelEvents[key]];
        if (method) this.listenTo(model, key, method);
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
          cb = viewEvents[key];
          if (!_.isFunction(cb)) cb = this[viewEvents[key]];
          if (!cb) return;

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
     * Make model methods callable by the view
     * `this` still refers to the model in methods
     * @param {[string]} modelMethods
     * @returns {Backbone.ItemView}
     */
    modelShortcut: function (modelMethods) {

      _.each(modelMethods, function (method) {
        this[method] = function () {
          if (this.model) return this.model[method].apply(this.model, arguments);
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
      var key, $el;

      if (!this.ui) return;

      for (key in this.ui) if (this.ui.hasOwnProperty(key)) {
        $el = this.$(this.ui[key]);

        if ($el.length) {
          this.ui[key] = $el;
        } else {
          delete this.ui[key];
        }
      }
    }
  });


  ItemView.extend = View.extend;

}(Backbone.Model, Backbone.View));
