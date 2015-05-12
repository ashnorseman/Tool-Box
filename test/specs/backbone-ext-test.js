/**
 * Created by Ash.Zhang on 2015/5/12.
 */


describe('backbone-ext', function () {

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

    it('inherits model methods: get, set, unset, clear', function () {
      var model = new Backbone.Model(),
          view = new Backbone.ItemView({
            model: model
          });

      expect(view.get('attr')).to.be.not.ok;
      view.set('attr', 'value');
      expect(view.get('attr')).to.be.equal('value');
      view.unset('attr');
      expect(view.get('attr')).to.be.not.ok;
      view.set({
        attr1: 'value1',
        attr2: 'value2'
      });
      expect(view.get('attr1')).to.be.ok;
      expect(view.get('attr2')).to.be.ok;
      view.clear();
      expect(view.get('attr1')).to.be.not.ok;
      expect(view.get('attr2')).to.be.not.ok;
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
});