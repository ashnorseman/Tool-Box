/**
* Created by Ash.Zhang on 2015/5/7.
*/


describe('underscore-ext', function () {

  it('_.castArray', function () {
    expect(_.castArray(1)).to.be.deep.equal([1]);
    expect(_.castArray([1, 2])).to.be.deep.equal([1, 2]);
  });

  it('_.createArray', function () {
    expect(_.createArray(2, 'a')).to.be.deep.equal(['a', 'a']);
    expect(_.createArray(3, 9)).to.be.deep.equal([9, 9, 9]);
    expect(_.createArray(0, 0)).to.be.deep.equal([]);
  });

  it('_.defaultsArray', function () {
    var arrA = [{ name: 'a' }, { value: 'b' }],
        resA = _.defaultsArray(arrA, { name: 'c', value: 'd' });

    expect(resA[0].name).to.be.equal('a');
    expect(resA[0].value).to.be.equal('d');
    expect(resA[1].name).to.be.equal('c');
    expect(resA[1].value).to.be.equal('b');
  });

  it('_.moveIndex', function () {
    var arr = [1, 2, 3];

    _.moveIndex(arr, 2, -999);
    expect(arr[0]).to.be.equal(2);
    _.moveIndex(arr, 2, 999);
    expect(arr[2]).to.be.equal(2);
    _.moveIndex(arr, 2, -1);
    expect(arr[1]).to.be.equal(2);
    _.moveIndex(arr, 2, 1);
    expect(arr[2]).to.be.equal(2);
    _.moveIndex(arr, 2, -2);
    expect(arr[0]).to.be.equal(2);
    _.moveIndex(arr, 2, 2);
    expect(arr[2]).to.be.equal(2);
  });

  it('_.addDate', function () {
    var oldDate = new Date(2014, 0, 31);

    expect(_.addDate(oldDate, 1).getDate()).to.be.equal(1);
    expect(_.addDate(oldDate, 2).getDate()).to.be.equal(2);
    expect(_.addDate(oldDate, -1).getDate()).to.be.equal(30);
    expect(_.addDate(oldDate, -31).getDate()).to.be.equal(31);
  });

  it('_.addWeek', function () {
    var oldDate = new Date(2014, 0, 1);

    expect(_.addWeek(oldDate, 1).getDate()).to.be.equal(8);
    expect(_.addWeek(oldDate, 2).getDate()).to.be.equal(15);
    expect(_.addWeek(oldDate, -1).getDate()).to.be.equal(25);
    expect(_.addWeek(oldDate, -2).getDate()).to.be.equal(18);
  });

  it('_.addMonth', function () {
    var oldDate = new Date(2014, 0, 31);

    expect(_.addMonth(oldDate, 1).valueOf()).to.be.equal(new Date(2014, 1, 28).valueOf());
    expect(_.addMonth(oldDate, 2).valueOf()).to.be.equal(new Date(2014, 2, 31).valueOf());
    expect(_.addMonth(oldDate, -1).valueOf()).to.be.equal(new Date(2013, 11, 31).valueOf());
    expect(_.addMonth(oldDate, -2).valueOf()).to.be.equal(new Date(2013, 10, 30).valueOf());
  });

  it('_.addYear', function () {
    var oldDate = new Date(2012, 1, 29);

    expect(_.addYear(oldDate, 1).valueOf()).to.be.equal(new Date(2013, 2, 1).valueOf());
    expect(_.addYear(oldDate, 4).valueOf()).to.be.equal(new Date(2016, 1, 29).valueOf());
    expect(_.addYear(oldDate, -1).valueOf()).to.be.equal(new Date(2011, 2, 1).valueOf());
    expect(_.addYear(oldDate, -2).valueOf()).to.be.equal(new Date(2010, 2, 1).valueOf());
  });

  it('_.dayStart', function () {
    var today = new Date(),
        todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).valueOf(),
        otherDay = new Date(2014, 4, 7, 11, 30, 45, 555),
        otherDayStart = new Date(otherDay.getFullYear(), otherDay.getMonth(), otherDay.getDate()).valueOf();

    expect(_.dayStart()).to.be.equal(todayStart);
    expect(_.dayStart(new Date())).to.be.equal(todayStart);
    expect(_.dayStart(new Date().valueOf())).to.be.equal(todayStart);
    expect(_.dayStart(otherDay)).to.be.equal(otherDayStart);
    expect(_.dayStart(otherDay.valueOf())).to.be.equal(otherDayStart);
  });

  it('_.dayEnd', function () {
    var today = new Date(),
        todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).valueOf() - 1,
        otherDay = new Date(2014, 4, 7, 11, 30, 45, 555),
        otherDayEnd = new Date(2014, 4, 8).valueOf() - 1;

    expect(_.dayEnd()).to.be.equal(todayEnd);
    expect(_.dayEnd(new Date())).to.be.equal(todayEnd);
    expect(_.dayEnd(new Date().valueOf())).to.be.equal(todayEnd);
    expect(_.dayEnd(otherDay)).to.be.equal(otherDayEnd);
    expect(_.dayEnd(otherDay.valueOf())).to.be.equal(otherDayEnd);
  });

  it('_.formatTime', function () {
    var today = new Date(),
        todayStr = today.getFullYear() + '-' +
          _.pad(today.getMonth() + 1) + '-' +
          _.pad(today.getDate()),
        todayStrFull = todayStr + ' ' +
          _.pad(today.getHours()) + ':' +
          _.pad(today.getMinutes()) + ':' +
          _.pad(today.getSeconds()),
        otherDay = new Date(2014, 0, 1, 2, 5, 8),
        otherDayStr = '14-1-1 2:5:8',
        otherDayStrFull = '2014-01-01 02:05:08';

    expect(_.formatTime()).to.be.equal('');
    expect(_.formatTime(today)).to.be.equal(todayStr);
    expect(_.formatTime(today, 'YYYY-MM-DD HH:mm:ss')).to.be.equal(todayStrFull);
    expect(_.formatTime(otherDay, 'YY-M-D H:m:s')).to.be.equal(otherDayStr);
    expect(_.formatTime(otherDay, 'YYYY-MM-DD HH:mm:ss')).to.be.equal(otherDayStrFull);
  });

  it('_.exists', function () {
    expect(_.exists(null)).to.be.not.ok;
    expect(_.exists(undefined)).to.be.not.ok;
    expect(_.exists(0)).to.be.ok;
  });

  it('_.isNegative', function () {
    expect(_.isNegative(1)).to.be.not.ok;
    expect(_.isNegative(1.1)).to.be.not.ok;
    expect(_.isNegative(-1)).to.be.ok;
    expect(_.isNegative(-1.1)).to.be.ok;
    expect(_.isNegative(NaN)).to.be.not.ok;
  });

  it('_.isPositive', function () {
    expect(_.isPositive(1)).to.be.ok;
    expect(_.isPositive(1.1)).to.be.ok;
    expect(_.isPositive(-1)).to.be.not.ok;
    expect(_.isPositive(-1.1)).to.be.not.ok;
    expect(_.isPositive(NaN)).to.be.not.ok;
  });

  it('_.isPureObject', function () {
    expect(_.isPureObject({})).to.be.ok;
    expect(_.isPureObject(function () {})).to.be.not.ok;
    expect(_.isPureObject(/a/)).to.be.not.ok;
    expect(_.isPureObject(null)).to.be.not.ok;
    expect(_.isPureObject([])).to.be.not.ok;
  });

  it('_.isValidDate', function () {
    expect(_.isValidDate(new Date())).to.be.ok;
    expect(_.isValidDate(new Date(undefined))).to.be.not.ok;
    expect(_.isValidDate(new Date(2015, 4, 7))).to.be.ok;
    expect(_.isValidDate(new Date('Ash'))).to.be.not.ok;
  });

  it('_.notEmpty', function () {
    expect(_.notEmpty('')).to.be.not.ok;
    expect(_.notEmpty(null)).to.be.not.ok;
    expect(_.notEmpty(undefined)).to.be.not.ok;
    expect(_.notEmpty('abc')).to.be.ok;
  });

  it('_.safeExtendOwn', function () {
    var noRep = _.safeExtendOwn({ a: 'a', b: 'b' }, { c: 'c', d: 'd' }),
        hasOld = _.safeExtendOwn({ a: 'a', b: 'b' }, { b: 'c', c: 'c' }),
        empty = _.safeExtendOwn({}, { a: 'a', b: 'b' });

    expect(noRep.a).to.be.equal('a');
    expect(noRep.b).to.be.equal('b');
    expect(noRep.c).to.be.equal('c');
    expect(noRep.d).to.be.equal('d');
    expect(hasOld.a).to.be.equal('a');
    expect(hasOld.b).to.be.equal('b');
    expect(hasOld.c).to.be.equal('c');
    expect(empty.a).to.be.equal('a');
    expect(empty.b).to.be.equal('b');
  });

  it('_.snapshot', function () {
    var src = {
          u: undefined,
          n: null,
          str: 'Ash',
          arr: [1, 3, 5],
          obj: { a: 'b' },
          method: function () {
            return 'Lee';
          }
        },
        cloned = _.snapshot(src);

    expect(cloned.u).to.be.equal(undefined);
    expect(cloned.n).to.be.equal(null);
    expect(cloned.str).to.be.equal('Ash');
    expect(cloned.arr).to.be.length(3);
    expect(cloned.arr[0]).to.be.equal(1);
    expect(cloned.obj.a).to.be.equal('b');
    expect(cloned.method()).to.be.equal('Lee');

    src.u = 'u';
    src.n = 'n';
    src.str = '';
    src.arr = [];
    src.obj = null;
    src.method = function () {};

    expect(cloned.u).to.be.equal(undefined);
    expect(cloned.n).to.be.equal(null);
    expect(cloned.str).to.be.equal('Ash');
    expect(cloned.arr).to.be.length(3);
    expect(cloned.arr[0]).to.be.equal(1);
    expect(cloned.obj.a).to.be.equal('b');
    expect(cloned.method()).to.be.equal('Lee');
  });

  it('_.capitalize', function () {
    expect(_.capitalize(null)).to.be.equal('');
    expect(_.capitalize(undefined)).to.be.equal('');
    expect(_.capitalize('a')).to.be.equal('A');
    expect(_.capitalize('abc')).to.be.equal('Abc');
    expect(_.capitalize('aBC')).to.be.equal('ABC');
    expect(_.capitalize('aBC', true)).to.be.equal('Abc');
    expect(_.capitalize(0)).to.be.equal('0');
  });

  it('_.int', function () {
    expect(_.int('15px')).to.be.equal(15);
    expect(_.int('15.5px')).to.be.equal(15);
    expect(_.int('-15.5px')).to.be.equal(-15);
    expect(isNaN(_.int('px'))).to.be.ok;
  });

  it('_.formatNumber', function () {
    expect(_.formatNumber(1)).to.be.equal('1');
    expect(_.formatNumber(12)).to.be.equal('12');
    expect(_.formatNumber(123)).to.be.equal('123');
    expect(_.formatNumber(1234567)).to.be.equal('1,234,567');
    expect(_.formatNumber(123456789)).to.be.equal('123,456,789');
    expect(_.formatNumber(12, 2)).to.be.equal('12.00');
    expect(_.formatNumber(123.123, 2)).to.be.equal('123.12');
    expect(_.formatNumber(1234567, 2)).to.be.equal('1,234,567.00');
    expect(_.formatNumber(1234567.1234567, 6)).to.be.equal('1,234,567.123,457');
    expect(_.formatNumber(-123456789)).to.be.equal('-123,456,789');
    expect(_.formatNumber(-1234567.1234567, 6)).to.be.equal('-1,234,567.123,457');
  });

  it('_.num', function () {
    expect(_.num('1.00')).to.be.equal(1);
    expect(_.num('1.02')).to.be.equal(1.02);
    expect(_.num('abc')).to.be.equal('abc');
  });

  it('_.pad', function () {
    expect(_.pad(5)).to.be.equal('05');
    expect(_.pad(5, 4)).to.be.equal('0005');
    expect(_.pad(5, 4, '-')).to.be.equal('---5');
    expect(_.pad(5, 4, '-', true)).to.be.equal('5---');
  });

  it('_.parseNumber', function () {
    expect(_.parseNumber('1234567')).to.be.equal(1234567);
    expect(_.parseNumber('123,456,789')).to.be.equal(123456789);
    expect(_.parseNumber('1,234,567.00')).to.be.equal(1234567);
    expect(_.parseNumber('-1,234,567.123,456,7')).to.be.equal(-1234567.1234567);
  });

  it('_parseQuery', function () {
    var query = _.parseQuery('?a=b&c=d'),
        simple = _.parseQuery('?e=f'),
        empty = _.parseQuery('?');

    expect(query.a).to.be.equal('b');
    expect(query.c).to.be.equal('d');
    expect(simple.e).to.be.equal('f');
    expect(empty).to.be.deep.equal({});
  });

  it('_.addLang & _.hasLang & _.parseLocale', function () {
    expect(_.hasLang('zh')).to.be.not.ok;
    expect(_.hasLang('en')).to.be.not.ok;

    _.addLang({
      en: {
        test: 'Test'
      },
      zh: {
        test: '测试'
      }
    });

    expect(_.hasLang('zh')).to.be.ok;
    expect(_.hasLang('en')).to.be.ok;

    _.setLang('en');
    expect(_.parseLocale('test')).to.be.equal('Test');
    expect(_.parseLocale('no')).to.be.equal('');
    _.setLang('zh');
    expect(_.parseLocale('test')).to.be.equal('测试');
    expect(_.parseLocale('no')).to.be.equal('');

    _.addLang({
      en: {
        test: 'Test 2',
        more: 'More'
      },
      zh: {
        test: '测试 2',
        more: '更多'
      }
    });

    _.setLang('en');
    expect(_.parseLocale('test')).to.be.equal('Test');
    expect(_.parseLocale('more')).to.be.equal('More');
    _.setLang('zh');
    expect(_.parseLocale('test')).to.be.equal('测试');
    expect(_.parseLocale('more')).to.be.equal('更多');

    _.setLang('foo');
    expect(_.parseLocale('test')).to.be.equal('测试');
    expect(_.parseLocale('more')).to.be.equal('更多');
  });
});
