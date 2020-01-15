import { test, Test } from '../index'
import * as assert from 'assert'

class TestableTest extends Test {
    private passCalls = 0
    private failCalls = 0

    pass(_message: string) {
        this.passCalls++
    }

    fail(_message: string) {
        this.failCalls++
    }

    verify(passCalls: number, failCalls: number) {
        assert.strictEqual(this.passCalls, passCalls)
        assert.strictEqual(this.failCalls, failCalls)
        this.passCalls = 0
        this.failCalls = 0
    }
}

test('true', (t) => {
    const tt = new TestableTest()
    tt.true(true)
    tt.verify(1, 0)

    tt.true(false)
    tt.verify(0, 1)

    tt.true(1)
    tt.verify(1, 0)

    tt.true(0)
    tt.verify(0, 1)

    t.pass('true passed')
})

test('ok', (t) => {
    const tt = new TestableTest()
    tt.ok(true)
    tt.verify(1, 0)

    tt.ok(false)
    tt.verify(0, 1)

    tt.ok(1)
    tt.verify(1, 0)

    tt.ok(0)
    tt.verify(0, 1)

    t.pass('ok passed')
})

test('false', (t) => {
    const tt = new TestableTest()
    tt.false(true)
    tt.verify(0, 1)

    tt.false(false)
    tt.verify(1, 0)

    tt.false(1)
    tt.verify(0, 1)

    tt.false(0)
    tt.verify(1, 0)

    t.pass('false passed')
})

test('notOk', (t) => {
    const tt = new TestableTest()
    tt.notOk(true)
    tt.verify(0, 1)

    tt.notOk(false)
    tt.verify(1, 0)

    tt.notOk(1)
    tt.verify(0, 1)

    tt.notOk(0)
    tt.verify(1, 0)

    t.pass('notOk passed')
})

test('equal', (t) => {
    const tt = new TestableTest()
    tt.equal(1, 1)
    tt.verify(1, 0)

    tt.equal(1, 2)
    tt.verify(0, 1)

    tt.equal(undefined, undefined)
    tt.verify(1, 0)

    tt.equal(undefined, null)
    tt.verify(0, 1)

    t.pass('equal passed')
})

test('notEqual', (t) => {
    const tt = new TestableTest()
    tt.notEqual(1, 1)
    tt.verify(0, 1)

    tt.notEqual(1, 2)
    tt.verify(1, 0)

    tt.notEqual(undefined, undefined)
    tt.verify(0, 1)

    tt.notEqual(undefined, null)
    tt.verify(1, 0)

    t.pass('notEqual passed')
})

test('deepEqual', (t) => {
    const tt = new TestableTest()
    tt.deepEqual({}, {})
    tt.verify(1, 0)

    tt.deepEqual({ a: 'b' }, {})
    tt.verify(0, 1)

    tt.deepEqual({ a: 'b' }, { a: 'b' })
    tt.verify(1, 0)

    tt.deepEqual({ a: 'b' }, { a: 'c' })
    tt.verify(0, 1)

    tt.deepEqual(new Map([['a', 'a']]), new Map([['a', 'a']]))
    tt.verify(1, 0)

    tt.deepEqual(new Map([['a', 'a']]), new Map([['a', 'b']]))
    tt.verify(0, 1)

    tt.deepEqual(new Set(['a', 'b']), new Set(['a', 'b']))
    tt.verify(1, 0)

    tt.deepEqual(new Set(['a', 'b']), new Set(['a']))
    tt.verify(0, 1)

    tt.deepEqual({ a: undefined }, { a: null })
    tt.verify(0, 1)

    t.pass('deepEqual passed')
})

test('notDeepEqual', (t) => {
    const tt = new TestableTest()
    tt.notDeepEqual({}, {})
    tt.verify(0, 1)

    tt.notDeepEqual({ a: 'b' }, {})
    tt.verify(1, 0)

    tt.notDeepEqual({ a: 'b' }, { a: 'b' })
    tt.verify(0, 1)

    tt.notDeepEqual({ a: 'b' }, { a: 'c' })
    tt.verify(1, 0)

    tt.notDeepEqual(new Map([['a', 'a']]), new Map([['a', 'a']]))
    tt.verify(0, 1)

    tt.notDeepEqual(new Map([['a', 'a']]), new Map([['a', 'b']]))
    tt.verify(1, 0)

    tt.notDeepEqual(new Set(['a', 'b']), new Set(['a', 'b']))
    tt.verify(0, 1)

    tt.notDeepEqual(new Set(['a', 'b']), new Set(['a']))
    tt.verify(1, 0)

    t.pass('notDeepEqual passed')
})

test('deepLooseEqual', (t) => {
    const tt = new TestableTest()
    tt.deepLooseEqual({}, {})
    tt.verify(1, 0)

    tt.deepLooseEqual({ a: 'b' }, {})
    tt.verify(0, 1)

    tt.deepLooseEqual({ a: 'b' }, { a: 'b' })
    tt.verify(1, 0)

    tt.deepLooseEqual({ a: 'b' }, { a: 'c' })
    tt.verify(0, 1)

    tt.deepLooseEqual(new Map([['a', 'a']]), new Map([['a', 'a']]))
    tt.verify(1, 0)

    tt.deepLooseEqual(new Map([['a', 'a']]), new Map([['a', 'b']]))
    tt.verify(0, 1)

    tt.deepLooseEqual(new Set(['a', 'b']), new Set(['a', 'b']))
    tt.verify(1, 0)

    tt.deepLooseEqual(new Set(['a', 'b']), new Set(['a']))
    tt.verify(0, 1)

    tt.deepLooseEqual({ a: undefined }, { a: null })
    tt.verify(1, 0)

    t.pass('deepLooseEqual passed')
})

test('notDeepLooseEqual', (t) => {
    const tt = new TestableTest()
    tt.notDeepLooseEqual({}, {})
    tt.verify(0, 1)

    tt.notDeepLooseEqual({ a: 'b' }, {})
    tt.verify(1, 0)

    tt.notDeepLooseEqual({ a: 'b' }, { a: 'b' })
    tt.verify(0, 1)

    tt.notDeepLooseEqual({ a: 'b' }, { a: 'c' })
    tt.verify(1, 0)

    tt.notDeepLooseEqual(new Map([['a', 'a']]), new Map([['a', 'a']]))
    tt.verify(0, 1)

    tt.notDeepLooseEqual(new Map([['a', 'a']]), new Map([['a', 'b']]))
    tt.verify(1, 0)

    tt.notDeepLooseEqual(new Set(['a', 'b']), new Set(['a', 'b']))
    tt.verify(0, 1)

    tt.notDeepLooseEqual(new Set(['a', 'b']), new Set(['a']))
    tt.verify(1, 0)

    tt.notDeepLooseEqual({ a: undefined }, { a: null })
    tt.verify(0, 1)

    t.pass('notDeepLooseEqual passed')
})

test('throws', (t) => {
    const tt = new TestableTest()
    tt.throws(() => {
        throw new Error()
    })
    tt.verify(1, 0)

    tt.throws(() => true)
    tt.verify(0, 1)

    tt.throws(() => {
        throw new Error('CorrectErr')
    }, /CorrectErr/)
    tt.verify(1, 0)

    tt.throws(() => {
        throw new Error('WrongErr')
    }, /CorrectErr/)
    tt.verify(0, 1)

    t.pass('throws passed')
})

test('doesNotThrow', (t) => {
    const tt = new TestableTest()
    tt.doesNotThrow(() => {
        throw new Error()
    })
    tt.verify(0, 1)

    tt.doesNotThrow(() => true)
    tt.verify(1, 0)

    tt.doesNotThrow(() => {
        throw new Error('CorrectErr')
    }, /CorrectErr/)
    tt.verify(0, 1)

    tt.doesNotThrow(() => {
        throw new Error('WrongErr')
    }, /CorrectErr/)
    tt.verify(1, 0)

    t.pass('doesNotThrow passed')
})

test('error', (t) => {
    const tt = new TestableTest()
    tt.error(false)
    tt.verify(1, 0)
    console.log(1)

    tt.error(new Error('MyError'))
    tt.verify(0, 1)

    t.pass('error passed')
})
