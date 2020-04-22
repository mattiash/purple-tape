import { inlineYamlBlock } from './yaml'
import deepEqual from 'deep-equal'
import objectInspect from 'object-inspect'

export let passedChecks = 0
export let failedChecks = 0
export let erroredChecks = 0

export class BailError extends Error {}
export let bailOut = false

export function bail(message: string) {
    console.log(`\nBail out! ${message}`)
    bailOut = true
}

export class Test {
    protected success = true
    protected ended = false
    protected assertions = 0
    protected firstNonSuccessMessage: string | undefined
    protected firstNonSuccessStatus: 'error' | 'failed' | undefined

    constructor(readonly title: string) {}

    /**
     * Print a message that a check passed.
     */
    pass(message = 'pass') {
        if (this.ended) {
            this.bailWithStack(new Error('test has already ended'))
        }
        this.assertions++
        passedChecks++
        console.log(`ok ${passedChecks + failedChecks} ${message}`)
    }

    /**
     * Print a message that a check has failed
     */
    fail(message = 'fail', extra: any = undefined) {
        if (this.ended) {
            this.bailWithStack(new Error('test has already ended'))
        }
        this._fail(message, extra)
    }

    private _fail(message = 'fail', extra: any = undefined) {
        this.assertions++
        failedChecks++
        if (this.success) {
            this.success = false
            this.firstNonSuccessMessage =
                message + (extra ? `\n${inlineYamlBlock(extra)}` : '')
            this.firstNonSuccessStatus = 'failed'
        }
        console.log(`not ok ${passedChecks + failedChecks} ${message}`)
        if (extra) {
            console.log(inlineYamlBlock(extra))
        }
    }

    /**
     * Report that the test has thrown an error.
     */
    errorOut(message: string, extra: any = undefined) {
        if (this.ended) {
            this.bailWithStack(new Error('test has already ended'))
        }

        this.assertions++
        erroredChecks++

        if (this.success) {
            this.success = false
            this.firstNonSuccessMessage =
                message + (extra ? `\n${inlineYamlBlock(extra)}` : '')
            this.firstNonSuccessStatus = 'error'
        }
        console.log(
            `not ok ${passedChecks + failedChecks + erroredChecks} ${message}`
        )
        if (extra) {
            console.log(inlineYamlBlock(extra))
        }
    }

    /**
     * Check that **actual** is truthy.
     */
    true(actual: any, message = 'true') {
        if (actual) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'true',
                actual,
                expected: 'truthy',
                stack: new Error('not true').stack,
            })
        }
    }

    /**
     * Check that **actual** is truthy.
     */
    ok(actual: any, message = 'ok') {
        if (actual) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'ok',
                actual,
                expected: 'truthy',
                stack: new Error('not ok').stack,
            })
        }
    }

    /**
     * Check that **actual** is falsy.
     */
    false(actual: any, message = 'false') {
        if (!actual) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'false',
                actual: actual,
                expected: 'falsy',
                stack: new Error('not false').stack,
            })
        }
    }

    /**
     * Check that **actual** is falsy.
     */
    notOk(actual: any, message = 'notOk') {
        if (!actual) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'notOk',
                actual: actual,
                expected: 'falsy',
                stack: new Error('not notOk').stack,
            })
        }
    }

    /**
     * Check that **actual** === **expected**.
     */
    equal<T>(actual: T, expected: T, message = `${actual} === ${expected}`) {
        if (actual === expected) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'equal',
                actual,
                expected,
                stack: new Error('not equal').stack,
            })
        }
    }

    /**
     * Check that **actual** !== **expected**.
     */
    notEqual<T>(actual: T, expected: T, message = `${actual} !== ${expected}`) {
        if (actual !== expected) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'notEqual',
                actual,
                expected,
                stack: new Error('not notEqual').stack,
            })
        }
    }

    /**
     * Check that **actual** is strict deep-equal to **expected**.
     * "Strict" means that leaf-nodes are compared with ===.
     * Maps and Sets are compared for content only - insertion order does not matter.
     */
    deepEqual<T>(actual: T, expected: T, message = 'deepEqual') {
        if (deepEqual(actual, expected, { strict: true })) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'deepEqual',
                actual: objectInspect(actual),
                expected: objectInspect(expected),
                stack: new Error('not deepEqual').stack,
            })
        }
    }

    /**
     * Check that **actual** is not strict deep-equal to **expected**.
     * "Strict" means that leaf-nodes are compared with ===.
     * Maps and Sets are compared for content only - insertion order does not matter.
     */
    notDeepEqual<T>(actual: T, expected: T, message = 'notDeepEqual') {
        if (!deepEqual(actual, expected, { strict: true })) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'notDeepEqual',
                actual: objectInspect(actual),
                expected: objectInspect(expected),
                stack: new Error('not notDeepEqual').stack,
            })
        }
    }

    /**
     * Check that **actual** is loose deep-equal to **expected**.
     * "Loose" means that leaf-nodes are compared with ==.
     * Maps and Sets are compared for content only - insertion order does not matter.
     */
    deepLooseEqual<T>(actual: T, expected: T, message = 'deepLooseEqual') {
        if (deepEqual(actual, expected, { strict: false })) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'deepLooseEqual',
                actual: objectInspect(actual),
                expected: objectInspect(expected),
                stack: new Error('not deepLooseEqual').stack,
            })
        }
    }

    /**
     * Check that **actual** is not loose deep-equal to **expected**.
     * "Loose" means that leaf-nodes are compared with ==.
     * Maps and Sets are compared for content only - insertion order does not matter.
     */
    notDeepLooseEqual<T>(
        actual: T,
        expected: T,
        message = 'notDeepLooseEqual'
    ) {
        if (!deepEqual(actual, expected, { strict: false })) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'notDeepLooseEqual',
                actual: objectInspect(actual),
                expected: objectInspect(expected),
                stack: new Error('not notDeepLooseEqual').stack,
            })
        }
    }

    /**
     * Check that **fn** throws an error. **expected** is a regexp that should
     * match the toString() of the error if specified.
     */
    throws(fn: () => void, expected: RegExp = /.*/, message = 'throws') {
        try {
            fn()
            this.fail(message)
        } catch (err) {
            if (err.toString().match(expected)) {
                this.pass(message)
            } else {
                this.fail(message, {
                    operator: 'throws',
                    actual: err.toString(),
                    expected,
                    stack: new Error('wrong exception thrown').stack,
                })
            }
        }
    }

    /**
     * Check that **fn** either
     * - does not throw an error or
     * - throws an error whose toString() does not match the **expected** regexp
     *
     * In other words, the check is ok if **fn** does not throw an error whose toString()
     * matches **regexp**
     */
    doesNotThrow(
        fn: () => void,
        expected: RegExp = /.*/,
        message = 'doesNotThrow'
    ) {
        try {
            fn()
            this.pass(message)
        } catch (err) {
            if (err.toString().match(expected)) {
                this.fail(message, {
                    operator: 'doesNotThrow',
                    actual: err.toString(),
                    stack: new Error('unallowed exception thrown').stack,
                })
            } else {
                this.pass(message)
            }
        }
    }

    /**
     * Check that **actual** < **expected**
     */
    lt<T extends number | string>(
        actual: T,
        expected: T,
        message = `${actual} < ${expected}`
    ) {
        if (actual < expected) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'lt',
                actual,
                expected,
                stack: new Error('not less than').stack,
            })
        }
    }

    /**
     * Check that **actual** <= **expected**
     */
    lte<T extends number | string>(
        actual: T,
        expected: T,
        message = `${actual} <= ${expected}`
    ) {
        if (actual <= expected) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'lte',
                actual,
                expected,
                stack: new Error('not less than or equal').stack,
            })
        }
    }

    /**
     * Check that **actual** > **expected**
     */
    gt<T extends number | string>(
        actual: T,
        expected: T,
        message = `${actual} > ${expected}`
    ) {
        if (actual > expected) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'gt',
                actual,
                expected,
                stack: new Error('not greater than').stack,
            })
        }
    }

    /**
     * Check that **actual** >= **expected**
     */
    gte<T extends number | string>(
        actual: T,
        expected: T,
        message = `${actual} >= ${expected}`
    ) {
        if (actual >= expected) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'gte',
                actual,
                expected,
                stack: new Error('not greater than or equal').stack,
            })
        }
    }

    /**
     * Checks that **err** is falsy. If err is not falsy,
     * it reports a failure with the text from err.message
     */
    error(err: any) {
        if (err) {
            this.fail(err.message, {
                operator: 'error',
                actual: err.message,
                stack: new Error('error').stack,
            })
        } else {
            this.pass('no error')
        }
    }

    /**
     * Logs a comment
     */
    comment(message: string) {
        if (this.ended) {
            this.bailWithStack(new Error('test ended'))
        }
        console.log(`# ${message}`)
    }

    /**
     * Logs a message indicating that a check was skipped.
     */
    skip(message: string) {
        this.comment(`SKIP ${message}`)
    }

    /**
     * Print a Bail out! message, skip all further tests and process.exit(1)
     */
    bail(message = 'bail') {
        this._fail(message)
        bail(message)
        throw new BailError()
    }

    private bailWithStack(err: Error) {
        this._fail(
            `Forbidden call to test-method after test '${this.title}' ended`,
            {
                stack: err.stack,
            }
        )
    }
}
