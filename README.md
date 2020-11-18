# purple-tape

Run tests with an api similar to [tape](https://www.npmjs.com/package/tape) but utilizing async/await.

![Build master](https://github.com/mattiash/purple-tape/workflows/Build%20master/badge.svg)
![Publish to nom](https://github.com/mattiash/purple-tape/workflows/Publish%20to%20npm/badge.svg)
![npm version](https://badge.fury.io/js/purple-tape.svg)

### Usage

Same as tape, except that the test-functions can be asynchronous.
t.plan() and t.end() are thus not needed and not supported.

Also provides

-   `test.beforeEach( async (t) => { ... })` which can be used to run some
    code before each test-case

-   `test.afterEach( async (t) => { ... })` which can be used to run some
    code after each test-case.

-   `test.beforeAll( function * (t) { ... })` which can be used to run some code
    before all test-cases.

-   `test.afterAll( function * (t) { ... })` which can be used to run some code
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
import { test } from 'purple-tape'

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

### tryUntil

The t-object contains a method called `tryUntil` that can be used to
try an operation over and over again until it succeeds or a timeout is reached.

```
await t.tryUntil(
    async () => t.equal(await dut.status(), 'ok', 'shall return status ok'),
    30_000
)
```

The above example will run `await dut.status()` over and over again
until it returns ok or until 30 seconds have passed.
The test-output will only contain the output of the last invocation
of the function, i.e. either

```
# ok 1 shall return status ok
```

or

```
# not ok 1 shall return status ok
...
```

The first parameter for the tryUntil method is the function that shall be run.
The test is regarded as a success if it runs at least one assertion method
(`ok`, `equal`, `pass` etc) and all assertion methods return an ok status.

The tryUntil method passes a single parameter to the function which is the
t-object itself.
This means that the following code has the exact same result as the previous example:

```
await t.tryUntil(
    async (t2) => t2.equal(await dut.status(), 'ok', 'shall return status ok'),
    30_000
)
```

The tryUntil method takes a third, optional argument which is the interval.
tryUntil will wait this many milliseconds between each invocation of the
test-function.
If the interval is omitted, it defaults to the interval divided by 30,
but at least 100 ms and at most 5 seconds.

If the tryUntil check fails, it will abort the current test().

### passWhile

The passWhile method works the same way as the tryUntil method,
but for passWhile, the expectation is that the tests in the function shall pass
every time the function is called.
The promise returned by passWhile resolves after the timeout has passed
or the tests in the function fails, whichever happens first.

In the following example, the return value of dut.status will be checked multiple times
during 30 seconds and it must return 'ok' every time in order for the test to pass.

```
await t.passWhile(
    async () => t.equal(await dut.status(), 'ok', 'shall return status ok'),
    30_000
)
```

## Generating junit xml output

To generate junit xml according to https://llg.cubic.org/docs/junit/,
set the environment variable `PT_XUNIT_FILE` to the output filename.

The `name` property for the testsuites and testsuite tags is the basename of the testfile.
To use another name, set `PT_XUNIT_NAME`.

Note that the junit output only lists all test()-calls and the last error from them (if any).
It does not include the result from each individual assertion or
the console output from the test.

## License

MIT License

Copyright (c) 2020, Mattias Holmlund, <mattias@holmlund.se>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```

```
