# purple-tape

Run tests with [tape](https://github.com/substack/tape) using [co](https://github.com/tj/co).

This code was initially forked from
[blue-tape](https://github.com/spion/blue-tape) but has now been largely
rewritten.

### usage

Same as tape, except that instead of supplying a test-function, you should
supply it with a generator function that can be executed with co. The test ends
when the promise returned by co resolves.  This means there is no need to use
`t.plan()` or `t.end()`

Also provides `t.beforeEach( function * (t) { ... })` which can be used to
run some code before each test-case.

### example

    'use strict'

    const test = require('purple-tape')

    test.beforeEach( function * (t) {
        t.ok(yield Promise.resolve(true), 'shall run beforeEach')
    })

    test('run with co', function * (t) {
        t.ok(yield Promise.resolve(true), 'shall yield results')
    })


### license

MIT
