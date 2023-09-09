'use strict';

QUnit.module('Тестируем функцию get', function () {
	QUnit.test('get работает правильно c объектами с существующими свойствами', function (assert) {
		const object = {
			foo: 'bar',
			deep: {
				hested: {
					field: 'baz'
				}
			}
		};

		assert.strictEqual(get(object, '.foo'), object.foo);
		assert.strictEqual(get(object, '.deep.hested.field'), object.deep.hested.field);

		assert.deepEqual(get(object, '.deep.hested'), object.deep.hested);
		assert.deepEqual(get(object, '.deep'), object.deep);
		assert.deepEqual(get(object, '.'), object);
	});

	QUnit.test('get работает правильно c массивами', function (assert) {
		const object = {
			foo: 'bar',
			baz: [ 1, 2, 3 ],
			deep: [
				{foobar: '42'}
			]
		};

		assert.strictEqual(get(object, '.foo.0'), object.foo[ 0 ]);
		assert.strictEqual(get(object, '.foo.length'), object.foo.length);
		assert.strictEqual(get(object, '.baz.0'), object.baz[ 0 ]);
		assert.strictEqual(get(object, '.baz.length'), object.baz.length);
		assert.strictEqual(get(object, '.deep.0.foobar'), object.deep[ 0 ].foobar);
	});

	QUnit.test('get работает правильно c объектами без свойств', function (assert) {
		const object = {
			foo: {
				bar: 42
			}
		};

		assert.strictEqual(get(object, '.foobar'), undefined);
		assert.strictEqual(get(object, '.foo.baz'), undefined);
		assert.strictEqual(get(object, '.baz.0'), undefined);
		assert.strictEqual(get(object, '.baz.length'), undefined);
		assert.strictEqual(get(object, '.0.1.2'), undefined);
	});

	QUnit.test('get работает правильно без передачи аргументов', function (assert) {
		assert.strictEqual(get(), undefined);
	});

	QUnit.test('get работает правильно с false-type аргументами', function (assert) {
		assert.strictEqual(get(undefined, undefined), undefined);
		assert.strictEqual(get(null, false), undefined);
		assert.strictEqual(get(false, null), undefined);
		assert.strictEqual(get(false, false), undefined);
	});

	QUnit.test('get работает правильно с методоами прототипов', function (assert) {
		const metaObj = { name: 'Прародитель всех объектов', print: () => {console.log('Печать')} };

		function Object() {
			this.name = "Объект";
			this.price = 9999;
		}

		Object.prototype = metaObj;

		const obj = new Object();

		assert.strictEqual(get(obj, '.print'), undefined);
	});

	QUnit.test('get работает правильно с перечисляемыми свойствами прототипов при передачи соответствующей опции', function (assert) {
		const object = {
			foo: {
				bar: 42
			}
		};

		const b = {b: 'b'}
		Object.setPrototypeOf(object, b)

		assert.strictEqual(get(object, '.b'), undefined);
		assert.strictEqual(get(object, '.b', undefined), undefined);
		assert.strictEqual(get(object, '.b', null), undefined);
		assert.strictEqual(get(object, '.b', true), object.b);
	});
});
