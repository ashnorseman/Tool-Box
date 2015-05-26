/**
 * Created by Ash.Zhang on 2015/5/7.
 */


_.mixin({


  // Arrays
  // --------------------------


  /**
   * Add default values to each of array items
   * @param {Array}   arr
   * @param {Object}  obj
   * @returns {Array}
   */
  defaultsArray: function (arr, obj) {

    return _.each(arr, function (item, i) {
      arr[i] = _.defaults(item, obj);
    });
  },


  /**
   * Pack the argument in an array
   * Return itself if it is an array.
   * @param {any} val
   * @returns {Array}
   */
  makeArray: function (val) {
    return _.isArray(val) ? val : [val];
  },


  /**
   * Move an item within its parent array
   * step > 0: move down
   * step < 0: move up
   * @param {Array} arr
   * @param {any} item
   * @param {number} step
   */
  moveIndex: function (arr, item, step) {
    var oldPos, newPos;

    if (!+step || (oldPos = _.indexOf(arr, item)) === -1) return;

    newPos = Math.min(Math.max(+step + oldPos, 0), arr.length - 1);
    arr.splice(oldPos, 1);
    arr.splice(newPos, 0, item);
  },


  // Dates
  // --------------------------


  /**
   * The start point (0 millisecond) of a day
   * @param {number|Date} timestamp
   * @returns {number}
   */
  dayStart: function (timestamp) {
    var date = new Date(timestamp);

    if (!_.isValidDate(date)) return _.dayStart(new Date());

    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
  },


  /**
   * The end point (last millisecond) of a day
   * @param {number|Date} timestamp
   * @returns {number}
   */
  dayEnd: function (timestamp) {
    var date = new Date(timestamp);

    if (!_.isValidDate(date)) return _.dayEnd(new Date());

    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).valueOf() - 1;
  },


  /**
   * Format a date to a string
   * Supports: YYYY, YY, MM, M, DD, D, HH, H, mm, m, ss, s
   * @param {number|Date} timestamp
   * @param {string}      [format='YYYY-MM-DD']
   * @returns {string}
   */
  formatTime: function (timestamp, format) {
    var date = new Date(timestamp),
        map;

    if (!_.isValidDate(date)) return _.formatTime(new Date(), format);

    format = _.isString(format) ? format : 'YYYY-MM-DD';
    map = {
      YYYY: date.getFullYear(),
      YY: ('' + date.getFullYear()).slice(-2),
      MM: _.pad(date.getMonth() + 1),
      M: date.getMonth() + 1,
      DD: _.pad(date.getDate()),
      D: date.getDate(),
      HH: _.pad(date.getHours()),
      H: date.getHours(),
      mm: _.pad(date.getMinutes()),
      m: date.getMinutes(),
      ss: _.pad(date.getSeconds()),
      s: date.getSeconds()
    };

    return format.replace(/(YYYY)|(\bYY\b)|(MM)|(\bM\b)|(DD)|(\bD\b)|(HH)|(\bH\b)|(mm)|(\bm\b)|(ss)|(\bs\b)/g, function (match) {
      return map[match];
    });
  },


  // Objects
  // --------------------------


  /**
   * Checks whether or not the value is "existy"
   * Both null and undefined are considered non-existy values.
   * All other values are existy.
   * @param {any} val
   * @returns {boolean}
   */
  exists: function (val) {
    return !_.isNull(val) && !_.isUndefined(val);
  },


  /**
   * Checks whether the value is a negative number
   * @param {number} num
   * @returns {boolean}
   */
  isNegative: function (num) {
    return num < 0;
  },


  /**
   * Checks whether the value is a positive number
   * @param {number} num
   * @returns {boolean}
   */
  isPositive: function (num) {
    return num > 0;
  },


  /**
   * Checks whether the value is pure object (neither function nor regex)
   * @param obj
   * @returns {boolean}
   */
  isPureObject: function (obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  },


  /**
   * Checks whether the value is a valid date
   * That is, the value is both an instance of Date and it represents an actual date.
   * @param {Date} date
   * @returns {boolean}
   */
  isValidDate: function (date) {
    return _.isDate(date) && _.isFinite(date.valueOf());
  },


  /**
   * Checks the string exists and is not empty
   * @param {string} str
   * @returns {boolean}
   */
  notEmpty: function (str) {
    return _.exists(str) && (str !== '');
  },


  /**
   * Behaves like _.defaults
   * But will log an error when a key already exists in the destination object
   * @param {any} obj
   * @returns {any}
   */
  safeExtendOwn: function (obj) {
    var length = arguments.length,
        index, source, keys, l, i, key;

    if (length < 2 || !_.exists(obj)) return obj;

    for (index = 1; index < length; index += 1) {
      source = arguments[index];
      keys = _.keys(source);
      l = keys.length;

      for (i = 0; i < l; i += 1) {
        key = keys[i];

        if (_.isUndefined(obj[key])) {
          obj[key] = source[key];
        } else {
          _.error(['Key "', key, '" already exists.'].join(''));
        }
      }
    }

    return obj;
  },


  /**
   * Snapshots/clones an object deeply
   * @param {Object} obj
   * @returns {Object}
   */
  snapshot: function (obj) {
    if (!_.exists(obj) || typeof obj !== 'object') return obj;

    return _.reduce(_.keys(obj), function (result, key) {
      result[key] = _.snapshot(obj[key]);
      return result;
    }, new obj.constructor());
  },


  // Utility
  // --------------------------


  /**
   * Capitalize a string
   * @param {string} str
   * @returns {string}
   */
  capitalize: function (str) {
    str = _.exists(str) ? ('' + str) : '';
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  },


  /**
   * Safe console.error
   */
  error: function () {
    (window.console && window.console.log.apply) ? window.console.info.apply(console, arguments) : (window.console && window.console.info(arguments[0]));
  },


  /**
   * Parse integer based 10
   * @param {number} val
   * @returns {number}
   */
  int: function (val) {
    return parseInt(val, 10);
  },


  /**
   * Format number to styles like '1,234,567.00' or '-1,234,567.00'
   * @param {number} num
   * @param {number} digits
   * @returns {string}
   */
  formatNumber: function (num, digits) {
    var sign = (num + '').slice(0, 1) === '-' ? '-' : '';

    if (_.isNaN(+num)) return '';

    if (digits) num = (+num).toFixed(digits);

    num = (num + '').replace('-', '').split('.');

    // Integer part
    result = _.reduceRight(num[0], function (res, digit, index) {
      return ((!((num[0].length - index) % 3) && index) ? ',' : '') + digit + res;
    }, '');

    // Fractional part
    if (!_.isUndefined(num[1])) {
      result += '.';

      result += _.reduce(num[1], function (res, digit, index) {
        return res + digit + ((index % 3 === 2 && index !== num[1].length - 1) ? ',' : '');
      }, '');
    }

    return sign + result;
  },


  /**
   * Safe console.log
   */
  log: function () {
    (window.console && window.console.log.apply) ? window.console.log.apply(console, arguments) : (window.console && window.console.log(arguments[0]));
  },


  /**
   * Convert a string to number if possible.
   * If the string can be convert to a number, return the number, or return the string.
   * @param {string} str
   * @returns {number|string}
   */
  num: function (str) {
    return _.isFinite(str) ? +str : str;
  },


  /**
   * Pad a string with any character to given length
   * @param {string}  str
   * @param {number}  [targetLen=2]
   * @param {string}  [pad='0']
   * @param {boolean} [fromRight=false]
   * @returns {string}
   */
  pad: function (str, targetLen, pad, fromRight) {
    var addCount;

    str = _.exists(str) ? ('' + str) : '';
    targetLen = _.isFinite(targetLen) ? Math.abs(Math.floor(targetLen)) : 2;
    pad = (_.exists(pad) && ('' + pad).length > 0) ? ('' + pad).charAt(0) : '0';
    fromRight = !!fromRight;

    if ((addCount = targetLen - str.length) <= 0) return str;

    if (fromRight) {
      return str + new Array(addCount + 1).join(pad);
    } else {
      return new Array(addCount + 1).join(pad) + str;
    }
  },


  /**
   * Parse number in formats like `1,234,567.00` to `1234567`
   * @param {string} str
   * @returns {number}
   */
  parseNumber: function (str) {
    return +(str.replace(/,/g, ''));
  },


  /**
   * Parse a query string to an object
   * @param {string} queryStr - like '?a=b&c=d'
   * @returns {Object}
   */
  parseQuery: function (queryStr) {
    var query = _.isString(queryStr) ? queryStr.slice(1) : '';

    if (!query.length) return {};

    return _.reduce(query.split('&'), function (result, q) {
      result[q.split('=')[0]] = q.split('=')[1];
      return result;
    }, {});
  }
});


// Language
// --------------------------

(function (_) {
  var lang = {},
      langCode = '';


  /**
   * Add language locale keys
   * @param {{code:Object}}   options
   * @param {{locale:string}} options.code
   */
  _.addLang = function (options) {
    _.each(options, function (content, code) {
      lang[code] || (lang[code] = {});
      _.safeExtendOwn(lang[code], content);
    });
  };


  /**
   * Test if the language code has data
   * @param {string} code
   * @returns {boolean}
   */
  _.hasLang = function (code) {
    return _.exists(lang[code]);
  };


  /**
   * Return a parsed Locale code of current language
   * @param {string} locale
   * @returns {string}
   */
  _.parseLocale = function (locale) {

    if (!lang[langCode]) {
      return '';
    } else {
      return lang[langCode][locale] || '';
    }
  };


  /**
   * Set langCode
   * @param {string} code
   */
  _.setLang = function (code) {

    if (_.hasLang(code)) {
      langCode = code;
    } else {
      _.error('Language code does not exist.');
    }
  };
}(_));
