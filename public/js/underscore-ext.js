/**
 * Created by Ash.Zhang on 2015/5/7.
 */


_.mixin({


  // Arrays
  // --------------------------


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
   * Checks whether the value is a negative number.
   * @param num
   * @returns {boolean}
   */
  isNegative: function (num) {
    return num < 0;
  },


  /**
   * Checks whether the value is a positive number.
   * @param {number} num
   * @returns {boolean}
   */
  isPositive: function (num) {
    return num > 0;
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
    window.console && window.console.info.apply(console, arguments);
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
   * Safe console.log
   */
  log: function () {
    window.console && window.console.log.apply(console, arguments);
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
