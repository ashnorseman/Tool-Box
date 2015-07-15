
// jQuery Form
// ---------------------------


$(function (w, d) {
  var $d = $(d),
      HTML5_VALIDS = ['required', 'min', 'max', 'minlength', 'maxlength', 'pattern'],
      CUSTOM_VALIDS = [
        'format',   // email, number
        'minimum',  // a list of checkbox or radio in a form, check at least n
        'maximum'   // check at most n
      ],
      VALID_PREDICTS = {
        required: function (value, validation) {
          var type = validation.input.type;

          // For checkbox or radio, check `checked` status
          if (type === 'checkbox' || type === 'radio') {
            return validation.input.checked;
          }

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
        },
        minimum: function (value, validation) {
          return checkedSibling(validation.input).length >= +validation.data;
        },
        maximum: function (value, validation) {
          return checkedSibling(validation.input).length <= +validation.data;
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

  function checkedSibling(input) {
    return $(input).closest('form').find('[name=' + input.name + ']:checked');
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


  // Settings
  // ---------------------------

  $.form = {

    addCustomValidation: function (options) {
      var type = options.type,
          predict = options.predict;

      if (!_.isString(type) || !_.isFunction(predict)) return;

      if (!_.contains(CUSTOM_VALIDS, type)) {
        CUSTOM_VALIDS.push(type);
      }

      VALID_PREDICTS[type] = predict;
    }
  };


  // Form APIs
  // ---------------------------

  $.fn.extend({


    // Validations
    // ---------------------------

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
     * - triggers `valid` or `invalid` event
     * @returns {boolean}
     */
    isValid: function () {
      var error = {},
          valid;

      if (this[0].tagName.toUpperCase() === 'FORM') {

        valid = _.reduce(this.find(':enabled:not(:button)'), function (valid, input) {
          var inputResult = $(input)._validate();

          if (inputResult) {
            error[input.name] = inputResult;
          }

          return !inputResult && valid;
        }, true);

        this[0].validationError = error;
        valid ? this.trigger('valid') : this.trigger('invalid', error);

        return valid;
      } else {
        return !this._validate();
      }
    },


    /**
     * Validate an input
     * - error data is saved at `HTMLElement.validationError`
     * - triggers `valid` or `invalid` event
     * @returns {Null|Object} - Null: valid / Object: invalid with error message
     */
    _validate: function () {
      var input = this[0],
          value = this.val(),
          error = {},
          valid;

      this._collectValidation();

      // Do not validate inputs without validations
      if (_.isEmpty(input.validation)) return null;

      // Do not validate empty non-required validations
      if (!input.validation.required && (_.isEmpty(value) || !value.length)) {
        input.validationError = error;
        return null;
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
    },


    // Value
    // ---------------------------


    /**
     * Clear validation status and value
     * - triggers `clear` event
     * @returns {jQuery}
     */
    clear: function () {
      var type;

      if (this[0].tagName.toUpperCase() === 'FORM') {

        // Clear each input
        this.find(':input:not(:button)').each(function () {
          $(this).clear();
        });

        // Trigger event
        this.trigger('clear');
      } else {
        type = this[0].type;

        // Set value to null or unchecked
        if (type === 'checkbox' || type === 'radio') {
          this[0].checked = false;
        } else {
          this.val(null);
        }

        // Error data
        this[0].validationError = null;

        // Remove relative classes
        this
            .removeClass('form-valid form-invalid')
            .parent()
            .removeClass('has-valid has-invalid');

        // Trigger event
        this.trigger('clear');
      }

      return this;
    },
    
    
    // Submit
    // ---------------------------


    /**
     * Collect form data
     * - checkbox: Array of checked values
     * - radio: checked value
     * - select-one: selected value
     * - select-multiple: Array of selected values
     * - other: value
     * @param {string|HTMLElement|jQuery}  form
     * @returns {Object}
     */
    getFormData: function (form) {
      var $form = form ? $(form) : this.closest('form'),
          formData = {};

      $form.find(':input:not(:button)').each(function (i, input) {
        var value;

        if (!_.notEmpty(input.name) || !_.notEmpty(value = $(input).val())) return;

        switch(input.type) {

        // All checked `checkbox`
        case 'checkbox':
          formData[input.name] || (formData[input.name] = []);

          if (input.checked) {
            formData[input.name].push(value);
          }
          break;

        // Checked `radio`
        case 'radio':
          if (input.checked) {
            formData[input.name] = value;
          }
          break;

        // Other
        default:
          formData[input.name] = value;
        }
      });

      return formData;
    },


    /**
     * Use ajax to submit the form data
     * @param {string} [url]
     * @param {Object} options
     * @param {string} options.url - or form `action`
     * @param {string} options.method - default: 'POST' or form `method`
     * @param {Object} options.data - data submit with the form
     * @returns {Deferred}
     */
    submit: function (url, options) {
      var $form = this.closest('form');

      // Only submit valid forms
      if (!$form.isValid()) return this;

      if (_.isString(url)) {

        // url, options
        options || (options = {});
      } else {

        // options
        options = _.isObject(url) ? url : {};
        url = options.url || $form.attr('action');
      }

      options.method || (options.method = $form.attr('method') || 'post');
      options.data || (options.data = {});
      _.extend(options.data, $form.getFormData());

      return $.ajax(url, options);
    }
  });


  // Events
  // ---------------------------


  /**
   * Toggle valid / invalid CSS classes
   */
  $d.on('valid invalid', ':enabled', function (e) {

    $(e.target)
        .removeClass('form-valid form-invalid')
        .addClass('form-' + e.type)
        .parent()
        .removeClass('has-valid has-invalid')
        .addClass('has-' + e.type);

    e.stopPropagation();
  });


  /**
   * Hit enter to trigger `click` event on submit button
   * - Button:
   *   = <form data-submit="#submit-button"> (outside the form)
   *   = <button data-action="submit"> (within the form)
   */
  $d.on('keypress', 'input, select', function (e) {
    var $form, $button;

    if (e.which === 13) {
      $form = $(e.target).closest('form');

      if ($form.length) {

        if ($form.data('submit')) {
          $button = $($form.data('submit'));
        } else {
          $button =$form.find('[data-action=submit]');
        }

        $button.length && $button.trigger($.events.click);
      }

      e.preventDefault();
    }
  });

}(window, document));