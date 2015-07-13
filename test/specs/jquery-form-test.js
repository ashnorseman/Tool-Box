
// jQuery Form Test
// ---------------------------


describe.only('jQuery Form', function () {
  var $body = $(document.body);

  it('addValidation(options)', function () {
    var $input = $('<input value="10">');

    $input.addValidation({
      type: 'min',
      data: 1,
      predict: function (value, validation) {
        var valid = +value >= validation.data;

        valid ? $(this).trigger('valid') : $(this).trigger('invalid');

        return valid;
      }
    });

    expect($input[0].validation.min).to.be.an('object');
    expect($input[0].validation.min.type).to.be.equal('min');
    expect($input[0].validation.min.data).to.be.equal(1);
    expect($input[0].validation.min.predict()).to.be.equal(true);

    $input[0].validation.min.data = 100;
    expect($input[0].validation.min.predict()).to.be.equal(false);
  });

  it('isValid()', function () {
    var $input = $('<input required>');

    expect($input.isValid()).to.be.equal(false);

    $input.val(' ');
    expect($input.isValid()).to.be.equal(false);

    $input.val('a');
    expect($input.isValid()).to.be.equal(true);
  });

  it('isValid() - form', function () {
    var $form = $('<form></form>'),
        $input1 = $('<input required>'),
        $input2 = $('<input>');

    $form.appendTo($body);
    expect($form.isValid()).to.be.equal(true);

    $form.append($input1);
    $form.append($input2);
    expect($form.isValid()).to.be.equal(false);

    $input1.val('1');
    expect($form.isValid()).to.be.equal(true);

    $form.remove();
  });

  it('validate()', function () {
    var $input = $('<input required min="100" minlength="2" pattern="\\d+" data-format="number">'),
        $empty = $('<input>');

    expect($input[0].validationError).to.be.not.ok;
    expect($empty[0].validationError).to.be.not.ok;

    $input.validate();
    expect(_.keys($input[0].validationError)).to.be.length(5);

    $empty.validate();
    expect(_.keys($empty[0].validationError)).to.be.length(0);

    $input.val(55);
    $input.validate();
    expect(_.keys($input[0].validationError)).to.be.length(1);
    expect($input[0].validationError.min).to.be.an('object');

    $input.val(5);
    $input.validate();
    expect(_.keys($input[0].validationError)).to.be.length(2);
    expect($input[0].validationError.min).to.be.an('object');
    expect($input[0].validationError.minlength).to.be.an('object');

    $input.val('a');
    $input.validate();
    expect(_.keys($input[0].validationError)).to.be.length(4);
    expect($input[0].validationError.min).to.be.an('object');
    expect($input[0].validationError.minlength).to.be.an('object');
    expect($input[0].validationError.pattern).to.be.an('object');
    expect($input[0].validationError.format).to.be.an('object');
  });

  it('validate() - valid / invalid events', function () {
    var $input = $('<input required>'),
        validSpy = sinon.spy(),
        invalidSpy = sinon.spy();

    $input.on('valid', validSpy);
    $input.on('invalid', invalidSpy);

    $input.validate();
    expect(validSpy).to.be.not.called;
    expect(invalidSpy).to.be.calledOnce;
    expect(invalidSpy.firstCall.args[1]).to.be.equal($input[0].validationError);

    $input.val('1');
    $input.validate();
    expect(validSpy).to.be.calledOnce;
    expect(invalidSpy).to.be.calledOnce;
  });

  it('validate() - select-multiple', function () {
    var $select = $('<select multiple min="1" max="1"><option value=1>1</option><option value=2>2</option></select>');

    $select.validate();
    expect($select[0].validationError.min).to.be.an('object');

    $select.val(['1', '2']);
    $select.validate();
    expect($select[0].validationError.min).to.be.not.ok;
    expect($select[0].validationError.max).to.be.an('object');

    $select.val(1);
    $select.validate();
    expect($select[0].validationError.min).to.be.not.ok;
    expect($select[0].validationError.max).to.be.not.ok;
  });

  it('_collectValidation()', function () {
    var $input = $('<input required min="1" minlength="1" pattern="\\d+" data-format="number">'),
        $empty = $('<input>');

    $input._collectValidation();
    expect($input[0].validation.required.predict()).to.be.equal(false);
    expect($input[0].validation.min.predict()).to.be.equal(false);
    expect($input[0].validation.minlength.predict()).to.be.equal(false);
    expect($input[0].validation.pattern.predict()).to.be.equal(false);
    expect($input[0].validation.format.predict()).to.be.equal(false);

    $input.val(55);
    expect($input[0].validation.required.predict()).to.be.equal(true);
    expect($input[0].validation.min.predict()).to.be.equal(true);
    expect($input[0].validation.minlength.predict()).to.be.equal(true);
    expect($input[0].validation.pattern.predict()).to.be.equal(true);
    expect($input[0].validation.format.predict()).to.be.equal(true);

    $empty._collectValidation();
    expect($empty[0].validation).to.be.empty;
  });

  it('.form-valid, .form-invalid, .has-valid, .has-invalid', function () {
    var $input = $('<input>').appendTo($body);

    $input.trigger($.Event('valid'));
    expect($input.hasClass('form-valid')).to.be.ok;
    expect($body.hasClass('has-valid')).to.be.ok;

    $input.trigger($.Event('invalid'));
    expect($input.hasClass('form-valid')).to.be.not.ok;
    expect($body.hasClass('has-valid')).to.be.not.ok;
    expect($input.hasClass('form-invalid')).to.be.ok;
    expect($body.hasClass('has-invalid')).to.be.ok;

    $input.remove();
  });
});