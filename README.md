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
