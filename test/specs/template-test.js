/**
 * Created by AshZhang on 15/8/19.
 */


describe.only('Template', function () {

  it('render properties', function () {
    var tpl = '<p>{{=propA}} {{=propB}}</p>',
        obj = {
          propA: 'a',
          propB: 'b'
        };

    expect(Template(tpl, obj)).to.be.equal('<p>a b</p>');
  });

  it('render `if`', function () {
    var tpl = '{{#if propA}}<p>{{=propB}}</p>{{/if}}',
        objTrue = {
          propA: true,
          propB: 'b'
        },
        objFalse = {
          propA: false,
          propB: 'b'
        };

    expect(Template(tpl, objTrue)).to.be.equal('<p>b</p>');
    expect(Template(tpl, objFalse)).to.be.equal('');
  });

  it('render `if`: middle', function () {
    var tpl = 'Start {{#if propA}}<p>{{=propB}}</p>{{/if}} End',
        objTrue = {
          propA: true,
          propB: 'b'
        },
        objFalse = {
          propA: false,
          propB: 'b'
        };

    expect(Template(tpl, objTrue)).to.be.equal('Start <p>b</p> End');
    expect(Template(tpl, objFalse)).to.be.equal('Start  End');
  });

  it('render `if`: double', function () {
    var tpl = '{{#if propA}}<p>{{=propC}}</p>{{/if}}{{#if propB}}<p>{{=propC}}</p>{{/if}}',
        obj = {
          propA: true,
          propB: false,
          propC: 'c'
        };

    expect(Template(tpl, obj)).to.be.equal('<p>c</p>');
  });

  it('render `each`: array', function () {
    var tpl = '{{#each}}<p>{{=propA}} {{=propB}}</p>{{/each}}',
        obj = [
          {
            propA: 'a',
            propB: 'b'
          },
          {
            propA: 'A',
            propB: 'B'
          }
        ];

    expect(Template(tpl, obj)).to.be.equal('<p>a b</p><p>A B</p>');
  });

  it('render `each`: obj', function () {
    var tpl = '{{#each list}}<p>{{=propA}} {{=propB}}</p>{{/each}}',
        obj = {
          list: [
            {
              propA: 'a',
              propB: 'b'
            },
            {
              propA: 'A',
              propB: 'B'
            }
          ]
        };

    expect(Template(tpl, obj)).to.be.equal('<p>a b</p><p>A B</p>');
  });

  it('render `each`: index', function () {
    var tpl = '{{#each list}}<p>{{=index}} {{=propA}}</p>{{/each}}',
        obj = {
          list: [
            {
              propA: 'a'
            },
            {
              propA: 'A'
            }
          ]
        };

    expect(Template(tpl, obj)).to.be.equal('<p>0 a</p><p>1 A</p>');
  });

  it.only('render `each`', function () {
    var tpl = '{{#each list}}<p>{{=propA}}</p>{{/each}}{{#each list}}<p>{{=propB}}</p>{{/each}}',
        obj = {
          list: [
            {
              propA: 'a',
              propB: 'b'
            },
            {
              propA: 'A',
              propB: 'B'
            }
          ]
        };

    expect(Template(tpl, obj)).to.be.equal('<p>a</p><p>A</p><p>b</p><p>B</p>');
  });

  it('`each` with `if', function () {
    var tpl = '{{#each}}{{#if propA}}<p>{{=propB}}</p>{{/if}}{{/each}}',
        obj = [
          {
            propA: true,
            propB: 'b'
          },
          {
            propA: false,
            propB: 'B'
          }
        ];

    expect(Template(tpl, obj)).to.be.equal('<p>b</p>');
  });

  it('`if` with `each', function () {
    var tpl = '{{#if propA}}{{#each list}}<p>{{=propB}}</p>{{/each}}{{/if}}',
        obj = {
          propA: true,
          list: [
            {
              propB: 'b'
            },
            {
              propB: 'B'
            }
          ]
        };

    expect(Template(tpl, obj)).to.be.equal('<p>b</p><p>B</p>');
  });

  it('`if` with object', function () {
    var tpl = '<li class="{{#if active}}active{{/if}}">{{=name}}</li>',
        obj = {
          active: true,
          name: 'Name'
        };

    expect(Template(tpl, obj)).to.be.equal('<li class="active">Name</li>');
  });

  it('`each` with object', function () {
    var tpl = '<div>{{=active}}</div>' +
        '<ul>' +
          '{{#each list}}' +
            '<li{{#if active}} class="active"{{/if}}>{{=name}}</li>' +
          '{{/each}}' +
        '</ul>',
        obj = {
          active: 'A',
          list: [
            {
              active: true,
              name: 'A'
            },
            {
              active: false,
              name: 'B'
            }
          ]
        };

    expect(Template(tpl, obj)).to.be.equal('<div>A</div><ul><li class="active">A</li><li>B</li></ul>');
  });
});