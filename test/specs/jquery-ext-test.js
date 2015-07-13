/**
* Created by Ash.Zhang on 2015/5/8.
*/


describe('jquery-ext', function () {
  var $body = $('body');

  it('center', function () {
    var $center = $('<div id="center" style="position: absolute; left: 0; top: 0; width: 100px; height: 100px;">').appendTo($body),
        $centerBig = $('<div id="center" style="position: absolute; left: 0; top: 0; width: 2000px; height: 2000px;">').appendTo($body);

    $center.center();
    expect(_.int($center.css('left'))).to.be.equal(_.int((document.documentElement.clientWidth - 100) / 2));
    expect(_.int($center.css('top'))).to.be.equal(_.int((document.documentElement.clientHeight - 100) / 2));

    $centerBig.center(50, 50);
    expect(_.int($centerBig.css('left'))).to.be.equal(50);
    expect(_.int($centerBig.css('top'))).to.be.equal(50);

    $center.remove();
    $centerBig.remove();
  });

  it('showLoading / hideLoading', function () {
    var $loading = $('<div id="loading"></div>').appendTo($body),
        $loading2 = $('<div id="loading-abs" style="position: absolute;"></div>').appendTo($body);

    $loading.showLoading();
    expect($loading.css('position')).to.be.equal('relative');
    expect($loading.children('.loading')).to.be.length(1);
    $loading.hideLoading();
    expect($loading.css('position')).to.be.equal('static');
    expect($loading.children('.loading')).to.be.length(0);

    $loading2.showLoading();
    expect($loading2.css('position')).to.be.equal('absolute');
    expect($loading2.children('.loading')).to.be.length(1);
    $loading2.hideLoading();
    expect($loading2.css('position')).to.be.equal('absolute');
    expect($loading2.children('.loading')).to.be.length(0);

    $loading.remove();
    $loading2.remove();
  });

  it('swapWith', function () {
    var a = 0;

    $('<div id="swap-1">Swap 1</div>' +
      '<div id="swap-2">Swap 2</div>' +
      '<div id="swap-3">Swap 3</div>').appendTo($body);

    $('#swap-1').click(function () {
      a = 10;
    }).swapWith('#swap-3')
      .trigger('click');

    expect($('#swap-3').next().attr('id')).to.be.equal('swap-2');
    expect($('#swap-2').next().attr('id')).to.be.equal('swap-1');
    expect(a).to.be.equal(10);

    $('#swap-3').click(function () {
      a = 100;
    }).swapWith('#swap-2')
      .trigger('click');

    expect($('#swap-2').next().attr('id')).to.be.equal('swap-3');
    expect($('#swap-3').next().attr('id')).to.be.equal('swap-1');
    expect(a).to.be.equal(100);

    $('#swap-1, #swap-2, #swap-3').remove();
  });

  it('coverPoint', function () {
    var $cover = $('<div id="coverPoint" style="position: absolute; left: 0; top: 0; width: 200px; height: 200px;"></div>').appendTo($body);

    expect($cover.coverPoint(-100, -100)).to.be.not.ok;
    expect($cover.coverPoint(0, 0)).to.be.ok;
    expect($cover.coverPoint(100, 100)).to.be.ok;
    expect($cover.coverPoint(200, 200)).to.be.ok;
    expect($cover.coverPoint(300, 300)).to.be.not.ok;
    $cover.remove();
  });

  it('isChildOf', function () {
    var $child;

    $body.append(
      '<div id="isChildOf-no-p"></div>' +
      '<div id="isChildOf-p">' +
        '<div>' +
          '<p><strong id="isChildOf-c">Child</strong></p>' +
        '</div>' +
      '</div>');

    $child = $('#isChildOf-c');

    expect($child.isChildOf('#isChildOf-p')).to.be.ok;
    expect($child.isChildOf(document.getElementById('isChildOf-p'))).to.be.ok;
    expect($child.isChildOf($('#isChildOf-p'))).to.be.ok;
    expect($child.isChildOf('body')).to.be.ok;
    expect($child.isChildOf('#isChildOf-no-p')).to.be.not.ok;

    $('#isChildOf-p, #isChildOf-no-p').remove();
  });

  it('[data-key]', function () {
    var $input = $('<input data-enter="#enter">').appendTo($body),
        $enter = $('<button type="button" id="enter"></button>').appendTo($body),
        $enter2 = $('<button type="button" id="enter-2"></button>').appendTo($body),
        spy = sinon.spy(),
        spy2 = sinon.spy(),
        e = $.Event('keyup');

    e.which = 13;
    $enter.on('click', spy);
    $enter2.on('click', spy2);

    expect(spy).to.be.not.called;
    expect(spy2).to.be.not.called;
    $input.trigger(e);
    expect(spy).to.be.calledOnce;
    expect(spy2).to.be.not.called;

    $input.remove();
    $enter.remove();
    $enter2.remove();
  });

  it('[data-accesskey]', function () {
    var $button = $('<button data-accesskey="65"></button>').appendTo($body),
        $input = $('<input>').appendTo($body),
        spy = sinon.spy(),
        e = $.Event('keyup');

    e.which = 65;
    e.target = document.body;
    $button.on('click', spy);

    expect(spy).to.be.not.called;
    $(document.body).trigger(e);
    expect(spy).to.be.calledOnce;

    e.target = $input[0];
    $input.trigger(e);
    expect(spy).to.be.calledOnce;

    e.target = document.body;
    $(document.body).trigger(e);
    expect(spy).to.be.calledTwice;

    $button.remove();
    $input.remove();
  });

  it('[data-toggle]', function () {
    var $btn = $('<button type="button" data-toggle="#toggle" data-toggle-class="toggle-class"></button>').appendTo($body),
        $p = $('<p id="toggle"></p>').appendTo($body);

    expect($p.hasClass('toggle-class')).to.be.not.ok;
    $btn.click();
    expect($p.hasClass('toggle-class')).to.be.ok;
    $btn.click();
    expect($p.hasClass('toggle-class')).to.be.not.ok;

    $btn.remove();
    $p.remove();
  });

  it('[data-document-close]', function () {
    var $close = $('<p class="opened" data-document-close="#document-close"></p>').appendTo($body),
        $closeTogether = $('<p class="opened" id="document-close"></p>').appendTo($body);

    $close.click();
    expect($close.hasClass('opened')).to.be.ok;
    expect($closeTogether.hasClass('opened')).to.be.ok;

    $body.click();
    expect($close.hasClass('opened')).to.be.not.ok;
    expect($closeTogether.hasClass('opened')).to.be.not.ok;

    $close.remove();
    $closeTogether.remove();
  });

  it('[data-select-all]', function () {
    var $all = $('<input type="checkbox" data-select-all="select-all" id="select-all">').appendTo($body),
        $1 = $('<input type="checkbox" name="select-all" data-select="#select-all">').appendTo($body),
        $2 = $('<input type="checkbox" name="select-all" data-select="#select-all">').appendTo($body),
        spy1 = sinon.spy(),
        spy2 = sinon.spy();

    $1.on('change', spy1);
    $2.on('change', spy2);

    expect(spy1).to.be.not.called;
    expect(spy2).to.be.not.called;

    $all.prop('checked', true).trigger('change');
    expect($all.prop('checked')).to.be.ok;
    expect($1.prop('checked')).to.be.ok;
    expect($2.prop('checked')).to.be.ok;
    expect(spy1).to.be.calledOnce;
    expect(spy2).to.be.calledOnce;

    $1.prop('checked', false).trigger('change');
    expect($all.prop('checked')).to.be.not.ok;
    expect($1.prop('checked')).to.be.not.ok;
    expect($2.prop('checked')).to.be.ok;
    expect(spy1).to.be.calledTwice;
    expect(spy2).to.be.calledOnce;

    $2.prop('checked', false).trigger('change');
    expect($all.prop('checked')).to.be.not.ok;
    expect($1.prop('checked')).to.be.not.ok;
    expect($2.prop('checked')).to.be.not.ok;
    expect(spy1).to.be.calledTwice;
    expect(spy2).to.be.calledTwice;

    $1.prop('checked', true).trigger('change');
    expect($all.prop('checked')).to.be.not.ok;
    expect($1.prop('checked')).to.be.ok;
    expect($2.prop('checked')).to.be.not.ok;
    expect(spy1).to.be.calledThrice;
    expect(spy2).to.be.calledTwice;

    $2.prop('checked', true).trigger('change');
    expect($all.prop('checked')).to.be.ok;
    expect($1.prop('checked')).to.be.ok;
    expect($2.prop('checked')).to.be.ok;
    expect(spy1).to.be.calledThrice;
    expect(spy2).to.be.calledThrice;

    $all.prop('checked', false).trigger('change');
    expect($all.prop('checked')).to.be.not.ok;
    expect($1.prop('checked')).to.be.not.ok;
    expect($2.prop('checked')).to.be.not.ok;
    expect(spy1.callCount).to.be.equal(4);
    expect(spy2.callCount).to.be.equal(4);

    $all.remove();
    $1.remove();
    $2.remove();
  });
});
