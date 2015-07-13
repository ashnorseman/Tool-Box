
// jQuery Form
// ---------------------------


$(function (w, d) {
  var $d = $(d),
      HTML5_VALIDS = ['required', 'min', 'max', 'minlength', 'maxlength', 'pattern'],
      CUSTOM_VALIDS = ['format'],
      VALID_PREDICTS = {
        required: function (value) {
          return value !== '';
        },
        min: function (value, validation) {

          if (_.isString(value)) {

            // input or select-one
            return +value >= +validation.data;
          } else {

            // select-multiple
            value || (value = []);

            return value.length >= +validation.data;
          }
        },
        max: function (value, validation) {

          if (_.isString(value)) {

            // input or select-one
            return +value <= +validation.data;
          } else {

            // select-multiple
            value || (value = []);

            return value.length <= +validation.data;
          }
        },
        minlength: function (value, validation) {
          return value.length >= +validation.data;
        },
        maxlength: function (value, validation) {
          return value.length <= +validation.data;
        },
        pattern: function (value, validation) {
          return new RegExp(validation.data).test(value);
        },
        format: function (value, validation) {
          var pattern;

          switch (validation.data) {
          case 'email':
            pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
            break;
          case 'number':
            pattern = /^[-+]?[0-9]*\.?[0-9]+$/;
            break;
          default:
            pattern = /./;
          }

          return new RegExp(pattern).test(value);
        }
      };


  // Methods
  // ---------------------------

  function collectValidationData(input, criteria, validations, prefixed) {
    var data = prefixed ? input.getAttribute('data-' + criteria) : input.getAttribute(criteria);

    if (_.exists(data)) validations.push({
      type: criteria,
      data: data,
      predict: VALID_PREDICTS[criteria]
    });
  }


  // Validation Constructor
  // ---------------------------

  /**
   * Validation constructor
   * @param {Object}  options
   * @constructor
   */
  function Validation(options) {
    var input = options.input,
        predict = options.predict,
        validation = this;

    if (!input) return;

    // predict(validation) is called on input
    // - The first argument is trimmed value
    if (_.isFunction(predict)) {

      options.predict = function () {
        var value = $(input).val();

        if (_.isString(value)) {
          value = $.trim(input.value);
        }

        return predict.call(input, value, validation);
      };
    }

    _.extend(this, options);
  }


  // Form APIs
  // ---------------------------

  $.fn.extend({


    /**
     * Add validation options to a form control
     * @param {Object|Array}  options - or an array of options
     * @param {string}    options.type - required
     * @param {Object}    options.data
     * @param {Function}  options.predict(trimmedValue, validation) - returns: boolean
     *    - trimmedValue: trimmed value or empty string
     *    - validation:   Validation object
     */
    addValidation: function (options) {
      var input = this[0];

      options = _.castArray(options);
      input.validation || (input.validation = {});

      _.each(options, function (option) {
        if (!option.type) return;

        option.input = input;
        input.validation[option.type] = new Validation(option);
      });

      return this;
    },


    /**
     * If the input or form is valid
     * - For a form, validate each input. If any input is invalid, the form is invalid
     * @returns {boolean}
     */
    isValid: function () {

      if (this[0].tagName.toUpperCase() === 'FORM') {

        return _.reduce(this.find(':enabled:visible:not(:button)'), function (valid, input) {
          return !$(input).validate() && valid;
        }, true);
      } else {
        return !this.validate();
      }
    },


    /**
     * Validate an input
     * - error data is saved at `HTMLElement.validationError`
     * - triggers `valid` or `invalid` event
     * @returns {Null|Object} - Null: valid / Object: invalid with error message
     */
    validate: function () {
      var input = this[0],
          error = {},
          valid;

      if (!input.validation) {
        this._collectValidation();
      }

      _.each(input.validation, function (validation, type) {

        if (!validation.predict()) {
          error[type] = validation;
        }
      });

      input.validationError = error;
      valid = _.isEmpty(error);
      valid ? this.trigger('valid') : this.trigger('invalid', error);

      return valid ? null : error;
    },


    /**
     * Generate validation objects from HTML
     * - validation data is saved at `HTMLElement.validation`
     * @private
     */
    _collectValidation: function () {
      var input = this[0],
          validations = [];

      // HTML5 validations
      _.each(HTML5_VALIDS, function (criteria) {
        collectValidationData(input, criteria, validations, false);
      });

      // Custom validations with `data-` prefix
      _.each(CUSTOM_VALIDS, function (criteria) {
        collectValidationData(input, criteria, validations, true);
      });

      return this.addValidation(validations);
    }
  });


  // Events
  // ---------------------------


  /**
   * Toggle valid / invalid CSS classes
   */
  $d.on('valid invalid', ':enabled:visible', function (e) {

    $(e.target)
        .removeClass('form-valid form-invalid')
        .addClass('form-' + e.type)
        .parent()
        .removeClass('has-valid has-invalid')
        .addClass('has-' + e.type);
  });

}(window, document));