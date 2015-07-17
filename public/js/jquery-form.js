
// jQuery Form
// ---------------------------


$(function (w, d) {
  var $d = $(d);


  // Methods
  // ---------------------------

  function collectValidationData(input, criteria, validations, prefixed) {
    var data,
        validate;

    if (prefixed) {

      // Custom
      data = input.getAttribute('data-' + criteria);

      validate = _.extend({}, Validation.Types.custom[criteria], {
        data: data
      });
    } else {

      // HTML5
      data = input.getAttribute(criteria);

      validate = _.extend({}, Validation.Types.html5[criteria], {
        data: data
      });
    }

    if (_.exists(data)) {
      validations.push(validate);
    }
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

  Validation.Types = {

    html5: {
      required: {
        type: 'required',
        errorMsg: '请输入必填项',
        predict: function (value, validation) {
          var type = validation.input.type;

          // For checkbox or radio, check `checked` status
          if (type === 'checkbox' || type === 'radio') {
            return validation.input.checked;
          }

          return value !== '';
        }
      },
      min: {
        type: 'min',
        errorMsg: '您输入的数字不得小于 <%= data %>',
        predict: function (value, validation) {

          if (_.isString(value)) {

            // input or select-one
            return +value >= +validation.data;
          } else {

            // select-multiple
            value || (value = []);

            return value.length >= +validation.data;
          }
        }
      },
      max: {
        type: 'max',
        errorMsg: '您输入的数字不得大于 <%= data %>',
        predict: function (value, validation) {

          if (_.isString(value)) {

            // input or select-one
            return +value <= +validation.data;
          } else {

            // select-multiple
            value || (value = []);

            return value.length <= +validation.data;
          }
        }
      },
      minlength: {
        type: 'minlength',
        errorMsg: '您输入的文字长度不得小于 <%= data %>',
        predict: function (value, validation) {
          return value.length >= +validation.data;
        }
      },
      maxlength: {
        type: 'maxlength',
        errorMsg: '您输入的文字长度不得大于 <%= data %>',
        predict: function (value, validation) {
          return value.length <= +validation.data;
        }
      },
      pattern: {
        type: 'pattern',
        errorMsg: '您输入的内容格式不正确',
        predict: function (value, validation) {
          return new RegExp(validation.data).test(value);
        }
      }
    },

    custom: {
      format: {
        type: 'format',
        errorMsg: '请输入正确格式的<%= { email: "电子邮件", number: "数字" }[data] %>',
        predict: function (value, validation) {
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
      },
      minimum: {
        type: 'minimum',
        errorMsg: '请至少选择 <%= data %> 项',
        predict: function (value, validation) {
          return checkedSibling(validation.input).length >= +validation.data;
        }
      },
      maximum: {
        type: 'maximum',
        errorMsg: '请最多选择 <%= data %> 项',
        predict: function (value, validation) {
          return checkedSibling(validation.input).length <= +validation.data;
        }
      }
    }
  };

  Validation.prototype.invalidMessage = function () {

    return _.template(this.errorMsg)({
      data: this.data
    });
  };


  // Settings
  // ---------------------------

  $.form = {

    addCustomValidation: function (options) {
      var type = options.type,
          predict = options.predict;

      if (!_.isString(type) || !_.isFunction(predict)) return;

      if (!Validation.Types.custom[type]) {
        Validation.Types.custom[type] = {
          type: type,
          predict: predict
        };
      }
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
      _.each(Validation.Types.html5, function (type) {
        collectValidationData(input, type.type, validations, false);
      });

      // Custom validations with `data-` prefix
      _.each(Validation.Types.custom, function (type) {
        collectValidationData(input, type.type, validations, true);
      });

      return this.addValidation(validations);
    },


    // Value
    // ---------------------------


    /**
     * Get the value from input name in a form
     * - checkbox single: boolean
     * - checkbox list: array of checked value
     * - radio: check value
     * - default: value
     * @param {string} name
     * @returns {any}
     */
    getVal: function (name) {
      var $input = this.find('[name=' + name + ']'),
          type = $input[0].type,
          value;

      switch(type) {

      // All checked `checkbox`
      case 'checkbox':

        // One checkbox -> true / false
        if ($input.length === 1) {
          return $input[0].checked;
        }

        // A list of checkbox -> checked value
        value = _.map($input.filter(':checked'), function (input) {
          return input.value;
        });

        return value.length ? value : null;

      // Checked `radio`
      case 'radio':
        value = $input.filter(':checked').val();
        return value === void 0 ? null : value;

      // Other
      default:
        return $input.val();
      }
    },


    /**
     * Set value to inputs in a form
     * @param {string} name
     * @param {any} value
     * @param {Object}  options
     * @param {Boolean} options.validate - validate the input or not
     * @returns {jQuery}
     */
    setVal: function (name, value, options) {
      var $input = this.find('[name=' + name + ']'),
          type = $input[0].type,
          validate = options && options.validate,
          radio;

      switch(type) {

      // All checked `checkbox`
      case 'checkbox':

        // One checkbox -> true / false
        if ($input.length === 1) {
          $input[0].checked = value;
          break;
        }

        // A list of checkbox -> checked value
        value = _.castArray(value);

        $input.each(function () {

          // values are casted to string and compare
          this.checked = (function (value, input) {
            var len = value.length;

            while (len--) {
              if (input.value + '' === value[len] + '') {
                return true;
              }
            }

            return false;
          }(value, this));
        });

        break;

      // Checked `radio`
      case 'radio':
        radio = _.find($input, function (input) {
          return input.value + '' === value + '';
        });

        if (radio) {
          radio.checked = true;
        }

        break;

      // Other
      default:
        $input.val(value);
      }

      if (validate) {
        $input._validate();
      }

      return this;
    },


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
     * - checkbox single: checked value
     * - checkbox list: Array of checked values
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

          // Single
          if ($form.find('[name=' + input.name + ']').length === 1) {
            formData[input.name] = input.checked;
            break;
          }

          // List
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
   * `valid` and `invalid` event
   * 1. Toggle valid / invalid CSS classes
   * 2. Generate invalid message
   */
  $d.on('valid invalid', ':enabled', function (e, options) {
    var $target = $(e.target),
        $parent = $target.parent(),
        $p,
        invalidMessage;

    $target
        .removeClass('form-valid form-invalid')
        .addClass('form-' + e.type);

    $parent
        .removeClass('has-valid has-invalid')
        .addClass('has-' + e.type);

    // Invalid message
    if (e.type === 'invalid') {
      invalidMessage = _.map(_.keys(options), function (key) {
        return options[key].invalidMessage();
      }).join('<br>');

      if (($p = $parent.children('.form-error-text')).length) {
        $p.html(invalidMessage);
      } else {
        $parent.append('<p class="form-error-text">' + invalidMessage + '</p>');
      }
    } else {
      $parent.children('.form-error-text').remove();
    }

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