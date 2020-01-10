# purple-tape

Run tests with [tape](https://github.com/substack/tape) using [co](https://github.com/tj/co).

[![npm version](https://badge.fury.io/js/purple-tape.svg)](https://badge.fury.io/js/purple-tape)

### Usage

Same as tape, except that instead of supplying a test-function, you should
supply it with an asynchronous function. t.plan() and t.end() are thus
not needed and not supported.

Also provides

-   `t.beforeEach( async (t) => { ... })` which can be used to run some
    code before each test-case

-   `t.afterEach( async (t) => { ... })` which can be used to run some
    code after each test-case.

-   `t.beforeAll( function * (t) { ... })` which can be used to run some code
    before all test-cases.

-   `t.afterAll( function * (t) { ... })` which can be used to run some code
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

### Example

```typescript
import test from 'purple-tape'

test.beforeAll(async (t) => {
    t.ok(await Promise.resolve(true), 'shall run beforeAll')
})

test.afterAll(async (t) => {
    t.ok(await Promise.resolve(true), 'shall run afterAll')
})

test.beforeEach(async (t) => {
    t.ok(await Promise.resolve(true), 'shall run beforeEach')
})

test.afterEach(async (t) => {
    t.ok(await Promise.resolve(true), 'shall run afterEach')
})

test('run test 1', async (t) => {
    t.ok(await Promise.resolve(true), 'shall await results')
})

test('run test 2', async (t) => {
    t.ok(await Promise.resolve(true), 'shall await results')
})
```

will provide the following output:

```
TAP version 13

# beforeAll
ok 1 - shall run beforeAll

# beforeEach run test 1
ok 2 - shall run beforeEach

# run test 1
ok 3 - shall await results

# afterEach run test 1
ok 4 - shall run afterEach

# beforeEach run test 2
ok 5 - shall run beforeEach

# run test 2
ok 6 - shall await results

# afterEach run test 2
ok 7 - shall run afterEach

# afterAll
ok 8 - shall run afterAll

1..8
# tests 8
# pass  8
```

### License

MIT
