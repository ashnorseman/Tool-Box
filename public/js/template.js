/**
 * Created by AshZhang on 15/8/19.
 */


(function (w) {
  var directiveReg = /\{\{#(if|each)(?:\s+(\w+))?}}(.+?)\{\{\/\1}}/g;


  /**
   * Simple replacement
   * @param {string} str - '<p>{{=propA}} {{=propB}}</p>'
   * @param {Object} obj
   * @returns {string}
   */
  function renderObj(str, obj) {
    var propReg = /{{=(\w+)}}/g;

    return str.replace(propReg, function (match, prop) {
      return obj[prop];
    });
  }


  /**
   * Each replacement
   * @param {string} str - '{{#each (list)}}<p>{{=propA}} {{=propB}}</p>{{/each}}'
   * @param {string} listProp - the array property
   * @param {Array|Object} obj
   * @returns {string}
   */
  function renderEach(str, listProp, obj) {
    var list = listProp ? obj[listProp] : obj,
        result = '', i;

    for (i = 0; i < list.length; i += 1) {
      result += Template(str, list[i]);
    }

    return result;
  }


  /**
   * Template
   * - supports `if` and `each`
   * @param {string} str
   * @param {object} obj
   * @returns {string}
   */
  w.Template = function (str, obj) {

    if (directiveReg.test(str)) {
      str = str.replace(directiveReg, function (match, directive, param, subStr) {

        switch (directive) {
        case 'if':
          if (obj[param]) {
            return Template(subStr, obj);
          }
          return '';
        case 'each':
          return renderEach(subStr, param, obj);
        }
      });
    }

    return renderObj(str, obj);
  };
}(window));