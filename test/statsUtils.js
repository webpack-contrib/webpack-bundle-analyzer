const {StatsSerializeStream} = require('../lib/statsUtils');

describe('StatsSerializeStream', () => {
  it('should properly stringify primitives', function () {
    expectProperJson(0);
    expectProperJson(1);
    expectProperJson(-1);
    expectProperJson(42.42);
    expectProperJson(-42.42);
    expectProperJson(false);
    expectProperJson(true);
    expectProperJson(null);
    expectProperJson(null);
    expectProperJson('');
    expectProperJson('"');
    expectProperJson('foo bar');
    expectProperJson('"foo bar"');
    expectProperJson('Вива Лас-Вегас!');
  });

  it('should properly stringify simple arrays', function () {
    expectProperJson([]);
    expectProperJson([1, undefined, 2]);
    // eslint-disable-next-line
    expectProperJson([1, , 2]);
    expectProperJson([false, 'f\'o"o', -1, 42.42]);
  });

  it('should properly stringify objects', function () {
    expectProperJson({});
    expectProperJson({a: 1, 'foo-bar': null, undef: undefined, '"Гусь!"': true});
  });

  it('should properly stringify complex structures', function () {
    expectProperJson({
      foo: [],
      bar: {
        baz: [
          1,
          {a: 1, b: ['foo', 'bar'], c: []},
          'foo',
          {a: 1, b: undefined, c: [{d: true}]},
          null,
          undefined
        ]
      }
    });
  });
});

async function expectProperJson(json) {
  expect(await stringify(json)).to.equal(JSON.stringify(json, null, 2));
}

async function stringify(json) {
  return new Promise((resolve, reject) => {
    let result = '';

    new StatsSerializeStream(json)
      .on('data', chunk => result += chunk)
      .on('end', () => resolve(result))
      .on('error', reject);
  });
}
