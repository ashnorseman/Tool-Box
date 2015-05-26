/**
 * Created by Ash.Zhang on 2015/5/26.
 */


describe('detect-device', function () {

  it('mobile', function () {
    expect(window.isMobile).to.be.not.ok;
    expect($('html').hasClass('no-mobile')).to.be.ok;
    expect($('html').hasClass('mobile')).to.be.not.ok;
  });

  it('dpr', function () {
    expect(window.dpr).to.be.equal(1);
    expect(/dpr=1/.test(document.cookie)).to.be.ok;
  });
});
