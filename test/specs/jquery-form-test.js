
// jQuery Form Test
// ---------------------------


describe.only('jQuery Form', function () {
  var $body = $(document.body);

  it('.addValidation(options)', function () {
    var $input = $('<input value="10">');

    $input.addValidation({
      type: 'custom',
      data: 1,
      predict: function (value, validation) {
        return +value >= validation.data;
      }
    });

    expect($input[0].validation.custom).to.be.an('object');
    expect($input[0].validation.custom.type).to.be.equal('custom');
    expect($input[0].validation.custom.data).to.be.equal(1);
    expect($input[0].validation.custom.predict()).to.be.equal(true);

    $input[0].validation.custom.data = 100;
    expect($input[0].validation.custom.predict()).to.be.equal(false);
  });

  it('.isValid()', function () {
    var $input = $('<input required>');

    expect($input.isValid()).to.be.equal(false);

    $input.val(' ');
    expect($input.isValid()).to.be.equal(false);

    $input.val('a');
    expect($input.isValid()).to.be.equal(true);
  });

  it('.isValid() - form', function () {
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

  it('_validate()', function () {
    var $input = $('<input required min="100" minlength="2" pattern="\\d+" data-format="number">'),
        $empty = $('<input>');

    expect($input[0].validationError).to.be.not.ok;
    expect($empty[0].validationError).to.be.not.ok;

    $input._validate();
    expect(_.keys($input[0].validationError)).to.be.length(5);

    $empty._validate();
    expect(_.keys($empty[0].validationError)).to.be.length(0);

    $input.val(55);
    $input._validate();
    expect(_.keys($input[0].validationError)).to.be.length(1);
    expect($input[0].validationError.min).to.be.an('object');

    $input.val(5);
    $input._validate();
    expect(_.keys($input[0].validationError)).to.be.length(2);
    expect($input[0].validationError.min).to.be.an('object');
    expect($input[0].validationError.minlength).to.be.an('object');

    $input.val('a');
    $input._validate();
    expect(_.keys($input[0].validationError)).to.be.length(4);
    expect($input[0].validationError.min).to.be.an('object');
    expect($input[0].validationError.minlength).to.be.an('object');
    expect($input[0].validationError.pattern).to.be.an('object');
    expect($input[0].validationError.format).to.be.an('object');
  });

  it('_validate() - empty and non-required', function () {
    var $input = $('<input min="100">');

    $input._validate();
    expect(_.keys($input[0].validationError)).to.be.length(0);
  });

  it('_validate() - a single checkbox or radio', function () {
    var $check1 = $('<input type="checkbox" required>'),
        $check2 = $('<input type="checkbox" required checked>'),
        $radio1 = $('<input type="radio" required>'),
        $radio2 = $('<input type="radio" required checked>');

    $check1._validate();
    expect($check1[0].validationError.required).to.be.an('object');

    $check2._validate();
    expect($check2[0].validationError.required).to.be.not.ok;

    $radio1._validate();
    expect($radio1[0].validationError.required).to.be.an('object');

    $radio2._validate();
    expect($radio2[0].validationError.required).to.be.not.ok;
  });

  it('_validate() - a list of checkbox or radio', function () {
    var $check1 = $('<input type="checkbox" name="checkbox" data-minimum="1" data-maximum="1">'),
        $check2 = $('<input type="checkbox" name="checkbox">'),
        $radio1 = $('<input type="radio" name="radio" data-minimum="1">'),
        $radio2 = $('<input type="radio" name="radio">'),
        $form = $('<form></form>');

    $form
        .append($check1).append($check2)
        .append($radio1).append($radio2);

    $check1._validate();
    expect($check1[0].validationError.minimum).to.be.an('object');
    expect($check1[0].validationError.maximum).to.be.not.ok;

    $check2.prop('checked', true);
    $check1._validate();
    expect($check1[0].validationError.minimum).to.be.not.ok;
    expect($check1[0].validationError.maximum).to.be.not.ok;

    $check1.prop('checked', true);
    $check1._validate();
    expect($check1[0].validationError.minimum).to.be.not.ok;
    expect($check1[0].validationError.maximum).to.be.an('object');

    $radio1._validate();
    expect($radio1[0].validationError.minimum).to.be.an('object');

    $radio2.prop('checked', true);
    $radio1._validate();
    expect($radio1[0].validationError.minimum).to.be.not.ok;
  });

  it('_validate() - custom', function () {
    var $input = $('<input min="5" value="1">');

    $input.addValidation({
      type: 'custom',
      data: 'custom',
      predict: function (value, validation) {
        return value === validation.data;
      }
    });

    $input._validate();
    expect($input[0].validationError.min).to.be.an('object');
    expect($input[0].validationError.custom).to.be.an('object');
  });

  it('_validate() - valid / invalid events', function () {
    var $input = $('<input required>'),
        validSpy = sinon.spy(),
        invalidSpy = sinon.spy();

    $input.on('valid', validSpy);
    $input.on('invalid', invalidSpy);

    $input._validate();
    expect(validSpy).to.be.not.called;
    expect(invalidSpy).to.be.calledOnce;
    expect(invalidSpy.firstCall.args[1]).to.be.equal($input[0].validationError);

    $input.val('1');
    $input._validate();
    expect(validSpy).to.be.calledOnce;
    expect(invalidSpy).to.be.calledOnce;
  });

  it('_validate() - select-multiple', function () {
    var $select = $('<select multiple min="2" max="2"><option value=1 selected>1</option><option value=2>2</option><option value=3>3</option></select>');

    $select._validate();
    expect($select[0].validationError.min).to.be.an('object');
    expect($select[0].validationError.max).to.be.not.ok;

    $select.val(['1', '2']);
    $select._validate();
    expect($select[0].validationError.min).to.be.not.ok;
    expect($select[0].validationError.max).to.be.not.ok;

    $select.val(['1', '2', '3']);
    $select._validate();
    expect($select[0].validationError.min).to.be.not.ok;
    expect($select[0].validationError.max).to.be.an('object');
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

  it('.clear()', function () {
    var $form = $('<form></form>'),
        $input1 = $('<input required>'),
        $check = $('<input type="checkbox" required checked>');

    $form
        .append($input1).append($check)
        .appendTo($body);

    $input1.isValid();
    expect($input1[0].validationError.required).to.be.an('object');
    expect($input1.hasClass('form-invalid')).to.be.ok;
    expect($form.hasClass('has-invalid')).to.be.ok;

    $input1.clear();
    expect($input1.val()).to.be.not.ok;
    expect($input1[0].validationError).to.be.not.ok;
    expect($input1.hasClass('form-invalid')).to.be.not.ok;
    expect($form.hasClass('has-invalid')).to.be.not.ok;

    $check.isValid();
    expect($check.hasClass('form-valid')).to.be.ok;
    expect($form.hasClass('has-valid')).to.be.ok;

    $check.clear();
    expect($check.prop('checked')).to.be.equal(false);
    expect($check[0].validationError).to.be.not.ok;
    expect($check.hasClass('form-valid')).to.be.not.ok;
    expect($form.hasClass('has-valid')).to.be.not.ok;

    $form.remove();
  });

  it('.clear() - form', function () {
    var $form = $('<form></form>'),
        $input = $('<input required>'),
        $check = $('<input type="checkbox" required>');

    $form
        .append($input).append($check)
        .appendTo($body);

    $form.isValid();
    expect($form.hasClass('has-invalid')).to.be.ok;

    $form.clear();
    expect($form.hasClass('has-invalid')).to.be.not.ok;
    expect($input.val()).to.be.not.ok;
    expect($input.hasClass('form-invalid')).to.be.not.ok;
    expect($check.prop('checked')).to.be.not.ok;
    expect($check.hasClass('form-invalid')).to.be.not.ok;

    $form.remove();
  });


  it('.clear()', function () {
    var $input = $('<input value="1">'),
        $form = $('<form></form>'),
        spy = sinon.spy(),
        formSpy = sinon.spy();

    $input.on('clear', spy);
    $form.on('clear', formSpy);
    expect(spy).to.be.not.called;
    expect(formSpy).to.be.not.called;

    $input.clear();
    expect(spy).to.be.calledOnce;

    $form.clear();
    expect(formSpy).to.be.calledOnce;
  });

  it('.getFormData(form)', function () {
    var $form = $('<form></form>'),
        formData = $form.getFormData();

    expect(formData).to.be.empty;

    $form
        .append('<input type="checkbox" name="checkbox" value="1" checked>')
        .append('<input type="checkbox" name="checkbox" value="2" checked>')
        .append('<input type="checkbox" name="checkbox" value="3">')
        .append('<input type="radio" name="radio" value="1" checked>')
        .append('<input type="radio" name="radio" value="2">')
        .append('<select name="select"><option selected value="1"></option><option value="2"></option></select>')
        .append('<select name="select-multiple" multiple><option selected value="1"></option><option selected value="2"></option><option value="3"></option></select>')
        .append('<input type="text" name="text" value="1">')
        .append('<input type="text" value="not-used">')
        .append('<textarea name="textarea">1</textarea>');

    formData = $form.getFormData();
    expect(formData.checkbox).to.be.length(2);
    expect(formData.checkbox[0]).to.be.equal('1');
    expect(formData.checkbox[1]).to.be.equal('2');
    expect(formData.radio).to.be.equal('1');
    expect(formData.select).to.be.equal('1');
    expect(formData['select-multiple']).to.be.length('2');
    expect(formData['select-multiple'][0]).to.be.equal('1');
    expect(formData['select-multiple'][1]).to.be.equal('2');
    expect(formData.text).to.be.equal('1');
    expect(formData.textarea).to.be.equal('1');
    expect(_.keys(formData)).to.be.length(6);

    expect($body.getFormData($form)).to.be.deep.equal(formData);
  });

  it('.submit() - url', function () {
    var $form = $('<form></form>'),
        stub = sinon.stub($, 'ajax');

    $form.submit('/form');
    expect(stub.lastCall.args[0]).to.be.equal('/form');

    $form.submit({
      url: '/form'
    });
    expect(stub.lastCall.args[0]).to.be.equal('/form');

    $form.attr('action', '/form');
    expect(stub.lastCall.args[0]).to.be.equal('/form');

    stub.restore();
  });

  it('.submit() - method', function () {
    var $form = $('<form></form>'),
        stub = sinon.stub($, 'ajax');

    $form.submit();
    expect(stub.lastCall.args[1].method).to.be.equal('post');

    $form.submit({
      url: '/form',
      method: 'get'
    });
    expect(stub.lastCall.args[1].method).to.be.equal('get');

    $form.attr('method', 'get');
    expect(stub.lastCall.args[1].method).to.be.equal('get');

    stub.restore();
  });

  it('.submit() - data', function () {
    var $form = $('<form></form>'),
        $input = $('<input name="text" value="1">'),
        stub = sinon.stub($, 'ajax');

    $form.append($input);

    $form.submit();
    expect(stub.lastCall.args[1].data.text).to.be.equal('1');

    $form.submit({
      data: {
        custom: 'custom'
      }
    });
    expect(stub.lastCall.args[1].data.custom).to.be.equal('custom');

    $input.removeAttr('name');
    $form.submit();
    expect(stub.lastCall.args[1].data.text).to.be.an('undefined');

    stub.restore();
  });

  it('[data-action=submit], [data-submit="#submit"]', function () {
    var $form = $('<form action="/form"></form>'),
        $input = $('<input name="text" value="1">'),
        $button = $('<button type="button" data-action="submit"></button>'),
        spy = sinon.spy();

    $form
        .append($input).append($button)
        .appendTo($body);

    $button.on('click', spy);

    $input.trigger($.Event('keypress', {
      which: 13
    }));
    expect(spy).to.be.calledOnce;

    $input.trigger($.Event('keypress', {
      which: 33
    }));
    expect(spy).to.be.calledOnce;

    $form.remove();
  });

  it('$.form.addCustomValidation(options)', function () {
    var $input = $('<input name="text" value="2" data-equal="1">');

    expect($input.isValid()).to.be.ok;

    $.form.addCustomValidation({
      type: 'equal',
      predict: function (value, validation) {
        return +value === validation.data;
      }
    });

    expect($input.isValid()).to.be.not.ok;
  });
});