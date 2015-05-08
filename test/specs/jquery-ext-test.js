/**
 * Created by Ash.Zhang on 2015/5/8.
 */


describe('jquery-ext', function () {

  it('center', function () {
    var $center = $('<div id="center" style="position: absolute; left: 0; top: 0; width: 100px; height: 100px;">').appendTo('body'),
        $centerBig = $('<div id="center" style="position: absolute; left: 0; top: 0; width: 2000px; height: 2000px;">').appendTo('body');

    $center.center();
    expect(_.int($center.css('left'))).to.be.equal((document.documentElement.clientWidth - 100) / 2);
    expect(_.int($center.css('top'))).to.be.equal((document.documentElement.clientHeight - 100) / 2);

    $centerBig.center(50, 50);
    expect(_.int($centerBig.css('left'))).to.be.equal(50);
    expect(_.int($centerBig.css('top'))).to.be.equal(50);

    $center.remove();
    $centerBig.remove();
  });

  it('swapWith', function () {
    var a = 0;

    $('<div id="swap-1">Swap 1</div>' +
      '<div id="swap-2">Swap 2</div>' +
      '<div id="swap-3">Swap 3</div>').appendTo('body');

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

  it('coverPos', function () {
    var $cover = $('<div id="coverPoint" style="position: absolute; left: 0; top: 0; width: 200px; height: 200px;"></div>').appendTo('body');

    expect($cover.coverPoint(-100, -100)).to.be.not.ok;
    expect($cover.coverPoint(0, 0)).to.be.ok;
    expect($cover.coverPoint(100, 100)).to.be.ok;
    expect($cover.coverPoint(200, 200)).to.be.ok;
    expect($cover.coverPoint(300, 300)).to.be.not.ok;
    $cover.remove();
  });

  it('isChildOf', function () {
    var $child;

    $('body').append(
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
});
