# Purple-Tape

![Build master](https://github.com/mattiash/purple-tape/workflows/Build%20master/badge.svg)
![Publish to nom](https://github.com/mattiash/purple-tape/workflows/Publish%20to%20npm/badge.svg)
![npm version](https://badge.fury.io/js/purple-tape.svg)

Purple-tape is a test framework for nodejs.

It exports a function called `test` that takes a title for the test and an async function that the test should run as arguments.

```typescript
import { test } from 'purple-tape'

test('simple test', async (t) => {
    const a = 1
    const b = { a: 'x' }
    t.equal(a, 1, 'a shall be 1')
    t.deepEqual(b, { a: 'x' }, 'b shall have expected value')
})
```

purple-tape also exports a type called `Test`, which is the type of the `t` argument.

## Assertion Methods

The `Test` object exposes a number of assertion helpers. Each method logs TAP-style output and increments the internal pass/fail/error counters.

The following assertions are available:

- pass(message = 'pass')
    - Marks a check as passed.
    - Example: `t.pass('connected to db')`

- fail(message = 'fail', extra = undefined)
    - Marks a check as failed and may include extra diagnostic info.
    - Example: `t.fail('unexpected response', { body })`

- true(actual, message = 'true')
    - Asserts that actual is truthy.
    - Example: `t.true(isReady, 'service ready')`

- ok(actual, message = 'ok')
    - Alias for truthy check.
    - Example: `t.ok(response, 'got response')`

- false(actual, message = 'false')
    - Asserts that actual is falsy.
    - Example: `t.false(hasError, 'no error present')`

- notOk(actual, message = 'notOk')
    - Alias for falsy check.
    - Example: `t.notOk(err, 'no error returned')`

- equal<T>(actual: T, expected: T, message?: string)
    - Asserts strict equality (===). If message omitted, it auto-generates a short one.
    - Example: `t.equal(count, 3, 'count is 3')`

- notEqual<T>(actual: T, expected: T, message = `${actual} !== ${expected}`)
    - Asserts strict inequality (!==).
    - Example: `t.notEqual(status, 'failed', 'did not fail')`

- deepEqual<T>(actual: T, expected: T, message = 'deepEqual')
    - Asserts deep (strict) equality using deep-equal with strict mode. Leaf nodes compared with ===. Maps/Sets compared by content (order ignored).
    - Example: `t.deepEqual(obj, { a: 1 }, 'object matches')`

- notDeepEqual<T>(actual: T, expected: T, message = 'notDeepEqual')
    - Asserts that deep-equal (strict) is false.
    - Example: `t.notDeepEqual(actualTree, expectedTree, 'trees `differ')

- deepLooseEqual<T>(actual: T, expected: T, message = 'deepLooseEqual')
    - Asserts deep equality in loose mode (leaf nodes compared with ==).
    - Example: `t.deepLooseEqual({ n: 1 }, { n: '1' }, 'loose `equality')

- notDeepLooseEqual<T>(actual: T, expected: T, message = 'notDeepLooseEqual')
    - Asserts deep loose-inequality.
    - Example: `t.notDeepLooseEqual(a, b, 'not loosely equal')`

- throws(fn: () => void, expected: RegExp = /.\*/, message = 'throws')
    - Asserts that fn throws. If expected supplied, the thrown error's toString() must match the regexp.
    - Example: `t.throws(() => JSON.parse('x'), /Unexpected `token/, 'parse throws')

- doesNotThrow(fn: () => void, expected: RegExp = /.\*/, message = 'doesNotThrow')
    - Asserts that fn either does not throw or throws an error whose toString() does NOT match expected.
    - Example: `t.doesNotThrow(() => safeOp(), /fatal/, 'no fatal `error')

- lt(actual: T, expected: T, message = `${actual} < ${expected}`)
    - "Less than". T must be a string or a number.
    - Asserts actual < expected.
    - Example: `t.lt(duration, 1000, 'fast enough')`

- lte(actual: T, expected: T, message = `${actual} <= ${expected}`)
    - "Less than or equal"
    - Asserts actual <= expected.
    - Example: `t.lte(items.length, 10, 'limit respected')`

- gt(actual: T, expected: T, message = `${actual} > ${expected}`)
    - "Greater than"
    - Asserts actual > expected.
    - Example: `t.gt(score, 0, 'positive score')`

- gte(actual: T, expected: T, message = `${actual} >= ${expected}`)
    - "Greater than or equal"
    - Asserts actual >= expected.
    - Example: `t.gte(version, 2, 'version supported')`

- error(err)
    - Convenience: passes if err is falsy, fails with err.message if truthy.
    - Example: `t.error(errFromCallback)`

- comment(message)
    - Emit a TAP comment line (prefixed with #). Does not affect pass/fail.
    - Example: `t.comment('setup complete')`

- errorComment(message | () => string)
    - Registers a comment to be printed if the test later fails/errors. Functions are executed lazily.
    - Example: `t.errorComment(() => `db state: ${inspect(state)}`)`

- skip(message)
    - Emits a skip comment: t.comment('SKIP <message>').
    - Example: `t.skip('not implemented')`

- bail(message = 'bail')
    - Marks a failing check, prints a global "Bail out!" message and throws BailError to abort further test execution.
    - Example: `t.bail('fatal precondition failed')`

## Running a Subset of Tests

Sometimes during development, you want to focus on one specific test or skip a certain test. This can be done by marking a test as only:

```typescript
test.only('my test', async (t) => {...} )
```

or skipping one or several tests:

```typescript
test.skip('my test', async (t) => {...} )
```

## Asynchronous Code

Since the function passed to `test` is asynchronous, you can use the normal async/await pattern when running tests. The Test object also exposes two utility methods for teting asynchronous code.

### tryUntil

The `Test` object exposes a method called `tryUntil` that can be used to
try an operation over and over again until it succeeds or a timeout is reached.

```typescript
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
```

The first parameter for the tryUntil method is the function that shall be run.
The test is regarded as a success if it runs at least one assertion method and all assertion methods return an ok status.

The tryUntil method passes a single parameter to the function which is the Test object itself.
This means that the following code has the exact same result as the previous example:

```typescript
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

If the function throws an error, that invocation of the function is considered as failed.
If an error is thrown in the last invocation of the function,
the error will be reported and tryUntil will have failed.

If the tryUntil check fails, it will abort the current test().

### passWhile

The passWhile method works the same way as the tryUntil method,
but for passWhile, the expectation is that the tests in the function shall pass
every time the function is called.
The promise returned by passWhile resolves after the timeout has passed
or the tests in the function fails, whichever happens first.

In the following example, the return value of dut.status will be checked multiple times
during 30 seconds and it must return 'ok' every time in order for the test to pass.

```typescript
await t.passWhile(
    async () => t.equal(await dut.status(), 'ok', 'shall return status ok'),
    30_000
)
```

If the function throws an error, that invocation of the function is considered as failed
and passWhile will fail, but the test will not be aborted.

## Running Code Before and After Tests

The test-object contains several methods to run code before and after tests. These can be used to provide consistent behavior when running only a single test or skipping a test.

- `test.beforeEach( async (t) => { ... })` which can be used to run some
  code before each test-case

- `test.afterEach( async (t) => { ... })` which can be used to run some
  code after each test-case.

- `test.beforeAll( function * (t) { ... })` which can be used to run some code
  before all test-cases.

- `test.afterAll( function * (t) { ... })` which can be used to run some code
  after all test-cases.

The reason for having the before/afterEach and before/afterAll functions is to make
it possible to run a single test-case with test.only() and to make the intention
of the code clearer.

## Executing Tests

To execute a test-file, run it with node. To execute several test-files, use
[multi-tape](https://www.npmjs.com/package/multi-tape). This has the additional
benefit that it can run several test-files in parallel.

## Best Practices

- Each test shall be independent of all other tests.
- If something needs to be initialized once before any test is run, place the initialization code in a beforeAll function.
- If something needs to be cleaned up after the last test, place the code in an afterAll function.
- Don't repeat the same code at the start or end of each test, use beforeEach and afterEach instead.
- Each assertion shall contain a message that explains WHY this assertion is tested.
- Each assertion in a test shall have a unique message to allow the user to understand which assertion failed in case of problems.
