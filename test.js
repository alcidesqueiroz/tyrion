const tyrion = require('./src');
tyrion.SILENT = true;

const sinon = require('sinon');
const test = require('tap').test;

test('guarantee', (t) => {
  t.ok(tyrion.guarantee(true));
  t.ok(tyrion.guarantee(11));
  t.ok(tyrion.guarantee('abc'));
  t.throws(() => tyrion.guarantee(false));
  t.throws(() => tyrion.guarantee(null));
  t.throws(() => tyrion.guarantee(undefined));
  t.throws(() => tyrion.guarantee(0));
  t.throws(() => tyrion.guarantee(''));

  t.end();
});

test('check', (t) => {
  t.test('runs the supplied callback', (t) => {
    let i = 0;
    tyrion.check('test', () => i++);
    t.equal(i, 1);
    t.end();
  });

  t.test('correctly runs beforeEach callbacks', (t) => {
    let w = 0;
    let x = 0;
    let y = 0;
    let z = 0;

    tyrion.beforeEach(() => w++);

    tyrion.group('a', () => {
      tyrion.beforeEach(() => x++);

      tyrion.group('b', () => {
        tyrion.beforeEach(() => y++);

        tyrion.check('b1', () => {});
        tyrion.check('b2', () => {});
        tyrion.check('b3', () => {});
      });

      tyrion.group('c', () => {
        tyrion.beforeEach(() => z++);

        tyrion.check('c1', () => {});
        tyrion.check('c2', () => {});
      });
    });

    tyrion.group('d', () => {
      tyrion.check('d1', () => {});
    });

    t.equal(w, 6);
    t.equal(x, 5);
    t.equal(y, 3);
    t.equal(z, 2);

    t.end();
  });

  t.end();
});

test('group', (t) => {
  t.test('runs the supplied callback', (t) => {
    let i = 0;
    tyrion.group('test', () => i++);
    t.equal(i, 1);
    t.end();
  });

  t.end();
});

test('beforeEach', (t) => {
  t.test('adds the supplied callback to the beforeEach stack', (t) => {
    const cb = () => {};
    sinon.spy(Array.prototype, 'push');

    tyrion.beforeEach(cb);
    t.ok(Array.prototype.push.calledWith(cb));

    Array.prototype.push.restore();
    t.end();
  });

  t.end();
});

test('beforeAll', (t) => {
  t.test('runs the supplied callback', (t) => {
    let i = 0;
    tyrion.beforeAll(() => i++);
    t.equal(i, 1);
    t.end();
  });

  t.end();
});

test('identical matcher', (t) => {
  t.ok(tyrion.guarantee.identical(true, 1));
  t.ok(tyrion.guarantee.identical(11, 11));
  t.ok(tyrion.guarantee.identical('abc', 'abc'));
  t.ok(tyrion.guarantee.identical(null, undefined));
  t.ok(tyrion.guarantee.identical(0, ''));
  t.throws(() => tyrion.guarantee.identical({}, {}));
  t.throws(() => tyrion.guarantee.identical(null, {}));
  t.throws(() => tyrion.guarantee.identical(11, 22));
  t.throws(() => tyrion.guarantee.identical(false, true));

  t.end();
});

test('same matcher', (t) => {
  t.ok(tyrion.guarantee.same(true, true));
  t.ok(tyrion.guarantee.same(11, 11));
  t.ok(tyrion.guarantee.same('abc', 'abc'));
  t.ok(tyrion.guarantee.same(undefined, undefined));

  const a = {};
  const b = a;
  t.ok(tyrion.guarantee.same(a, b));
  t.throws(() => tyrion.guarantee.same({}, {}));
  t.throws(() => tyrion.guarantee.same([], []));
  t.throws(() => tyrion.guarantee.same(11, 22));
  t.throws(() => tyrion.guarantee.same(false, true));
  t.throws(() => tyrion.guarantee.same(undefined, null));
  t.throws(() => tyrion.guarantee.same(0, ''));

  t.end();
});

test('truthy matcher', (t) => {
  t.ok(tyrion.guarantee.truthy(true));
  t.ok(tyrion.guarantee.truthy(11));
  t.ok(tyrion.guarantee.truthy('abc'));
  t.throws(() => tyrion.guarantee.truthy(false));
  t.throws(() => tyrion.guarantee.truthy(null));
  t.throws(() => tyrion.guarantee.truthy(undefined));
  t.throws(() => tyrion.guarantee.truthy(0));
  t.throws(() => tyrion.guarantee.truthy(''));

  t.end();
});

test('falsy matcher', (t) => {
  t.ok(tyrion.guarantee.falsy(false));
  t.ok(tyrion.guarantee.falsy(null));
  t.ok(tyrion.guarantee.falsy(undefined));
  t.ok(tyrion.guarantee.falsy(0));
  t.ok(tyrion.guarantee.falsy(''));
  t.throws(() => tyrion.guarantee.falsy(true));
  t.throws(() => tyrion.guarantee.falsy(11));
  t.throws(() => tyrion.guarantee.falsy('abc'));

  t.end();
});

test('throws matcher', (t) => {
  t.ok(tyrion.guarantee.throws(() => { throw new Error(); }));
  t.ok(tyrion.guarantee.throws(() => { throw new Error('foo'); }));
  t.ok(tyrion.guarantee.throws(() => { throw new Error('foo'); }, 'foo'));
  t.throws(() => tyrion.guarantee.throws(() => {}));
  t.throws(() => tyrion.guarantee.throws(() => {}, 'foo'));
  t.throws(() => tyrion.guarantee.throws(() => { throw new Error('bar'); }, 'foo'));

  t.end();
});

test('deeplyIdentical matcher', (t) => {
  t.ok(tyrion.guarantee.deeplyIdentical(
    { a: 123, b: 321, c: { d: [11, 22, 33] } },
    { b: 321, a: 123, c: { d: [11, 22, 33] } }
  ));
  t.ok(tyrion.guarantee.deeplyIdentical([11, 22, 33, 44], [11, 22, 33, 44]));
  t.ok(tyrion.guarantee.deeplyIdentical(123, 123));
  t.throws(() => tyrion.guarantee.deeplyIdentical([11, 22], [22, 11]));
  t.throws(() => tyrion.guarantee.deeplyIdentical({ a: 1 }, {}));

  t.end();
});
