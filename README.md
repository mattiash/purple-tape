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

Also provides

- `t.beforeEach( function * (t) { ... })` which can be used to run some
  code before each test-case

- `t.afterEach( function * (t) { ... })` which can be used to run some
  code after each test-case.

- `t.beforeAll( function * (t) { ... })` which can be used to run some code
  before all test-cases.

- `t.afterAll( function * (t) { ... })` which can be used to run some code
  after all test-cases.

The reason for having the before/afterEach and before/afterAll functions is to make
it possible to run a single test-case with test.only() and to make the intention
of the test-code clearer.

Note that purple-tape does not contain any test-runner. To execute a test-file,
simply run it with node. To execute several test-files, the tape-documentation
recommends using `tape tests/**/*.js`, however this means that all test-files
run in the same instance of node which may provide surprising results if you for
example mock a module in one of your tests. purple-tape does not support running
several test-files with the tape runner. Instead, I recommend using
[multi-tape](https://www.npmjs.com/package/multi-tape). This has the additional
benefit that it can run several test-files in parallel.

### example

    const test = require('purple-tape')

    test.beforeAll( function * (t) {
        t.ok(yield Promise.resolve(true), 'shall run beforeAll')
    })

    test.afterAll( function * (t) {
        t.ok(yield Promise.resolve(true), 'shall run afterAll')
    })

    test.beforeEach( function * (t) {
        t.ok(yield Promise.resolve(true), 'shall run beforeEach')
    })

    test.afterEach( function * (t) {
        t.ok(yield Promise.resolve(true), 'shall run afterEach')
    })

    test('run test 1 with co', function * (t) {
        t.ok(yield Promise.resolve(true), 'shall yield results')
    })

    test('run test 2 with co', function * (t) {
        t.ok(yield Promise.resolve(true), 'shall yield results')
    })

will provide the following output:

    TAP version 13
    # run test 1 with co
    ok 1 shall run beforeAll
    ok 2 shall run beforeEach
    ok 3 shall yield results
    ok 4 shall run afterEach
    # run test 2 with co
    ok 5 shall run beforeEach
    ok 6 shall yield results
    ok 7 shall run afterEach
    ok 8 shall run afterAll

    1..8
    # tests 8
    # pass  8

    # ok


### license

MIT
