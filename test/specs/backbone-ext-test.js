/**
* Created by Ash.Zhang on 2015/5/12.
*/


describe('backbone-ext', function () {

  describe('extend', function () {

    it('Model', function () {
      var Parent = Backbone.Model.extend({
            defaults: {
              parent: 'p'
            }
          }),
          Child = Parent.extend({
            defaults: {
              child: 'c'
            }
          }),
          child = new Child({
            option: 'optionStr'
          });

      expect(child.get('parent')).to.be.equal('p');
      expect(child.get('child')).to.be.equal('c');
      expect(child.get('option')).to.be.equal('optionStr');
    });

    it('overwrites parent function', function () {
      var Parent = Backbone.Model.extend({
            initialize: function () {
              this.set('parent', 'parent');
            }
          }),
          Child = Parent.extend({
            initialize: function () {
              this.set('parent', 'p');
            }
          }),
          child = new Child();

      expect(child.get('parent')).to.be.equal('p');
    });

    it('ItemView', function () {
      var Parent = Backbone.ItemView.extend({
            viewEvents: {
              pve: 'onPve'
            },
            onPve: function () {}
          }),
          pveSpy = sinon.spy(Parent.prototype, 'onPve'),
          Child = Parent.extend({
            viewEvents: {
              cve: 'onCve'
            },
            onCve: function () {}
          }),
          cveSpy = sinon.spy(Child.prototype, 'onCve'),
          child = new Child();

      expect(pveSpy).to.be.not.called;
      child.trigger('pve', 'p');
      expect(pveSpy).to.be.calledOnce;
      expect(pveSpy).to.be.calledOn(child);
      expect(pveSpy).to.be.calledWith('p');

      expect(cveSpy).to.be.not.called;
      child.trigger('cve', 'c');
      expect(cveSpy).to.be.calledOnce;
      expect(cveSpy).to.be.calledOn(child);
      expect(cveSpy).to.be.calledWith('c');
    });
  });

  describe('_super', function () {

    it('Model', function () {
      var GrandParent = Backbone.Model.extend({
            initialize: function (options) {
              this.set('grandParent', options.grandParent);
            }
          }),
          Parent = GrandParent.extend({
            initialize: function (options) {
              this._super(options);
              this.set('parent', options.parent);
            }
          }),
          Child = Parent.extend({
            initialize: function (options) {
              this._super(options);
              this.set('child', 'child');
            }
          }),
          child = new Child({
            grandParent: 'grandParent',
            parent: 'parent'
          });

      expect(child.get('grandParent')).to.be.equal('grandParent');
      expect(child.get('parent')).to.be.equal('parent');
      expect(child.get('child')).to.be.equal('child');
    });

    it('ItemView', function () {
      var GrandParent = Backbone.ItemView.extend({
            disable: function () {
              this.grandParentDisabled = true;
            }
          }),
          Parent = GrandParent.extend({
            disable: function () {
              this._super();
              this.parentDisabled = true;
            }
          }),
          Child = Parent.extend({
            disable: function () {
              this._super();
              this.childDisabled = true;
            }
          }),
          child = new Child({
            parent: 'parent'
          });

      child.disable();
      expect(child.childDisabled).to.be.ok;
      expect(child.parentDisabled).to.be.ok;
      expect(child.grandParentDisabled).to.be.ok;
    });
  });

  describe('ItemView', function () {

    it('inherits Backbone.View', function () {
      var View = Backbone.ItemView.extend({
            attr: 'value',
            onClick: function () {
              return 'clicked';
            }
          });

      expect(View.prototype.tagName).to.be.ok;
      expect(View.prototype.on).to.be.a('function');
      expect(View.prototype.setElement).to.be.a('function');
      expect(View.prototype.attr).to.be.a('string');
      expect(View.prototype.onClick).to.be.a('function');
    });

    it('creates an ItemView instance', function () {
      var View = Backbone.ItemView.extend({
            attr: 'value',
            onClick: function () {
              return 'clicked';
            }
          }),
          view,
          spy = sinon.spy(View.prototype, 'onClick');

      view = new View();
      expect(spy).to.be.not.called;
      view.onClick();
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall).to.be.calledOn(view);
      expect(spy.firstCall).returned('clicked');
    });

    it('links model and view', function () {
      var model = new Backbone.Model(),
          view = new Backbone.ItemView({
            model: model
          });

      expect(model.view).to.be.equal(view);
      expect(view.model).to.be.equal(model);
    });

    it('inherits model methods: get, set', function () {
      var model = new Backbone.Model(),
          view = new Backbone.ItemView({
            model: model
          });

      expect(view.get('attr')).to.be.not.ok;
      view.set('attr', 'value');
      expect(view.get('attr')).to.be.equal('value');
      view.set({
        attr1: 'value1',
        attr2: 'value2'
      });
      expect(view.get('attr1')).to.be.ok;
      expect(view.get('attr2')).to.be.ok;
    });

    it('modelEvents', function () {
      var model = new Backbone.Model(),
          View = Backbone.ItemView.extend({
            modelEvents: {
              change: 'modelChange',
              destroy: function () {
                return 'destroyed';
              }
            },
            modelChange: function () {
              return 'changed';
            }
          }),
          view,
          spyChange = sinon.spy(View.prototype, 'modelChange'),
          spyDestroy = sinon.spy(View.prototype.modelEvents, 'destroy');

      view = new View({
        model: model
      });

      expect(spyChange).to.be.not.called;
      model.trigger('change');
      expect(spyChange).to.be.calledOnce;
      expect(spyChange.firstCall).to.be.calledOn(view);
      expect(spyChange.firstCall).returned('changed');

      expect(spyDestroy).to.be.not.called;
      model.trigger('destroy');
      expect(spyDestroy).to.be.calledOnce;
      expect(spyDestroy.firstCall).to.be.calledOn(view);
      expect(spyDestroy.firstCall).returned('destroyed');
    });

    it('built-in callbacks: onInitialize, onRender, onRemove', function () {
      var View = Backbone.ItemView.extend({
            onInitialize: function () {
              return 'initialize';
            },
            onRender: function () {
              return 'render';
            },
            onRemove: function () {
              return 'remove';
            }
          }),
          spyInitialize = sinon.spy(View.prototype, 'onInitialize'),
          spyRender = sinon.spy(View.prototype, 'onRender'),
          spyRemove = sinon.spy(View.prototype, 'onRemove'),
          view;

      expect(spyInitialize).to.be.not.called;
      view = new View();
      expect(spyInitialize).to.be.calledOnce;
      expect(spyInitialize.firstCall).to.be.calledOn(view);
      expect(spyInitialize.firstCall).returned('initialize');

      expect(spyRender).to.be.not.called;
      view.render();
      expect(spyRender).to.be.calledOnce;
      expect(spyRender.firstCall).to.be.calledOn(view);
      expect(spyRender.firstCall).returned('render');

      expect(spyRemove).to.be.not.called;
      view.remove();
      expect(spyRemove).to.be.calledOnce;
      expect(spyRemove.firstCall).to.be.calledOn(view);
      expect(spyRemove.firstCall).returned('remove');
    });

    it('viewEvents', function () {
      var View = Backbone.ItemView.extend({
            viewEvents: {
              change: 'onChange',
              clear: function () {
                return 'clear';
              }
            },
            onChange: function () {
              return 'change';
            }
          }),
          spyChange = sinon.spy(View.prototype, 'onChange'),
          spyClear = sinon.spy(View.prototype.viewEvents, 'clear'),
          view = new View();

      expect(spyChange).to.be.not.called;
      view.trigger('change');
      expect(spyChange).to.be.calledOnce;
      expect(spyChange.firstCall).to.be.calledOn(view);
      expect(spyChange.firstCall).returned('change');

      expect(spyClear).to.be.not.called;
      view.trigger('clear');
      expect(spyClear).to.be.calledOnce;
      expect(spyClear.firstCall).to.be.calledOn(view);
      expect(spyClear.firstCall).returned('clear');
    });

    it('template', function () {
      var View = Backbone.ItemView.extend({
            template: '<p>text</p>'
          }),
          View2 = Backbone.ItemView.extend({
            template: '<p><%= attr %></p>'
          }),
          view = new View(),
          view2 = new View2({
            model: new Backbone.Model({
              attr: 'value'
            })
          });

      view.render();
      expect(view.$('p').text()).to.be.equal('text');

      view2.render();
      expect(view2.$('p').text()).to.be.equal('value');
    });

    it('ui', function () {
      var View = Backbone.ItemView.extend({
            template: '<p>text</p><p class="para">paragraph</p>',
            ui: {
              p: 'p:eq(0)',
              para: '.para'
            }
          }),
          view = new View();

      view.render();
      expect(view.ui.p.text()).to.be.equal('text');
      expect(view.ui.para.text()).to.be.equal('paragraph');
    });

    it('.linkView(linkView, options) - forth', function () {
      var child = new Backbone.ItemView({
            model: new Backbone.Model()
          }),
          Parent = Backbone.ItemView.extend({
            template: '<p></p>',
            onSubModelChange: function () {
              return 'sub model change';
            },
            onSubViewChange: function () {
              return 'sub view change';
            }
          }),
          spyModel = sinon.spy(Parent.prototype, 'onSubModelChange'),
          spyView = sinon.spy(Parent.prototype, 'onSubViewChange'),
          parent = new Parent();

      parent.render();

      parent.linkView(child, {
        holder: 'p',
        anotherName: 'sub',
        thisName: 'sup',
        modelEventsListening: {
          change: 'onSubModelChange'
        },
        viewEventsListening: {
          change: 'onSubViewChange'
        }
      });

      expect(parent.sub).to.be.equal(child);
      expect(child.sup).to.be.equal(parent);
      expect(parent.$('p').html()).to.be.equal('<div></div>');

      expect(spyModel).to.be.not.called;
      child.model.trigger('change');
      expect(spyModel).to.be.calledOnce;
      expect(spyModel.firstCall).to.be.calledOn(parent);
      expect(spyModel.firstCall).returned('sub model change');

      expect(spyView).to.be.not.called;
      child.trigger('change');
      expect(spyView).to.be.calledOnce;
      expect(spyView.firstCall).to.be.calledOn(parent);
      expect(spyView.firstCall).returned('sub view change');
    });

    it('.linkView(linkView, options) - back', function () {
      var Child = Backbone.ItemView.extend({
            onSupModelChange: function () {
              return 'sup model change';
            },
            onSupViewChange: function () {
              return 'sup view change';
            }
          }),
          parent = new Backbone.ItemView({
            model: new Backbone.Model()
          }),
          spyModel = sinon.spy(Child.prototype, 'onSupModelChange'),
          spyView = sinon.spy(Child.prototype, 'onSupViewChange'),
          child = new Child();

      parent.linkView(child, {
        holder: 'p',
        anotherName: 'sub',
        thisName: 'sup',
        modelEventsListened: {
          change: 'onSupModelChange'
        },
        viewEventsListened: {
          change: 'onSupViewChange'
        }
      });

      expect(spyModel).to.be.not.called;
      parent.model.trigger('change');
      expect(spyModel).to.be.calledOnce;
      expect(spyModel.firstCall).to.be.calledOn(child);
      expect(spyModel.firstCall).returned('sup model change');

      expect(spyView).to.be.not.called;
      parent.trigger('change');
      expect(spyView).to.be.calledOnce;
      expect(spyView.firstCall).to.be.calledOn(child);
      expect(spyView.firstCall).returned('sup view change');
    });
  });

  describe('Module', function () {

    it('creates a Model', function () {
      var Mod = Backbone.Module({

            dataDefaults: {
              prop: 'value'
            },

            dataHandlers: {
              initialize: function (options) {
                this.init = options.init;
              }
            }
          }),
          mod = Mod.create({
            newProp: 'newValue',
            init: true
          });

      expect(Mod.Model).to.be.ok;
      expect(mod.model.get('prop')).to.be.equal('value');
      expect(mod.model.get('newProp')).to.be.equal('newValue');
      expect(mod.model.init).to.be.ok;
    });
  });

  it('creates a View and renders DOM elements', function () {
    var Mod = Backbone.Module({
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

          domEvents: {
            click: 'clickLink'
          },

          domApi: {
            clickLink: function (e) {
              this.set('link', this.ui.span.text());
            }
          }
        }),
        mod = Mod.create({
          text: 'Link',
          viewInit: true
        });

    mod.render().$el.appendTo('body');

    expect(Mod.View).to.be.ok;
    expect(mod.get('viewInit')).to.be.ok;

    mod.$el.click();
    expect(mod.get('link')).to.be.equal('Link');

    mod.remove();
  });

  it('creates a View and listens to model events', function () {
    var Mod = Backbone.Module({

          modelEvents: {
            'change:link': 'changeLink'
          },

          modelApi: {
            changeLink: function (model, value) {
              this.set('linkChanged', value);
            }
          }
        }),
        mod = Mod.create();

    mod.set('link', 'Link');
    expect(mod.get('link')).to.be.equal('Link');
    expect(mod.get('linkChanged')).to.be.equal('Link');
  });

  it('creates a View and listens to view events', function () {
    var Mod = Backbone.Module({

          viewEvents: {
            viewChange: 'viewChange'
          },

          viewApi: {
            viewChange: function (value) {
              this.set('viewChanged', value);
            }
          }
        }),
        mod = Mod.create();

    mod.trigger('viewChange', 'new view');
    expect(mod.get('viewChanged')).to.be.equal('new view');
  });
});
