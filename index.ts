import { inlineYamlBlock } from './lib/yaml'
import deepEqual from 'deep-equal'
import objectInspect from 'object-inspect'

type TestFunction = (t: Test) => Promise<void>

type TestEntry = [string, TestFunction]

let tests = new Array<TestEntry>()

export function test(title: string, fn: TestFunction) {
    tests.push([title, fn])
}

let beforeEach: TestFunction | undefined
let afterEach: TestFunction | undefined
let beforeAll: TestFunction | undefined
let afterAll: TestFunction | undefined
let onlyTest: TestEntry | undefined

test.beforeEach = (fn: TestFunction) => {
    beforeEach = fn
}

test.afterEach = (fn: TestFunction) => {
    afterEach = fn
}

test.beforeAll = (fn: TestFunction) => {
    beforeAll = fn
}

test.afterAll = (fn: TestFunction) => {
    afterAll = fn
}

test.only = (title: string, fn: TestFunction) => {
    if (onlyTest) {
        throw new Error('Can only have one test.only')
    } else {
        onlyTest = [title, fn]
    }
}

test.skip = (title: string, _fn: TestFunction) => {
    tests.push([`SKIP ${title}`, async () => {}])
}

export class Test {
    protected success = true

    pass(message = 'pass') {
        passedChecks++
        console.log(`ok ${passedChecks + failedChecks} ${message}`)
    }

    fail(message = 'fail', extra: any = undefined) {
        failedChecks++
        this.success = false
        console.log(`not ok ${passedChecks + failedChecks} ${message}`)
        if (extra) {
            console.log(inlineYamlBlock(extra))
        }
    }

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

    equal<T>(actual: T, expected: T, message: string = 'equal') {
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

    notEqual<T>(actual: T, expected: T, message: string = 'notEqual') {
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

    deepEqual<T>(actual: T, expected: T, message: string = 'deepEqual') {
        if (deepEqual(actual, expected)) {
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

    notDeepEqual<T>(actual: T, expected: T, message: string = 'notDeepEqual') {
        if (!deepEqual(actual, expected)) {
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

    throws(
        fn: () => void,
        expected: RegExp = /.*/,
        message: string = 'throws'
    ) {
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

    doesNotThrow(
        fn: () => void,
        expected: RegExp = /.*/,
        message: string = 'doesNotThrow'
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

    comment(message: string) {
        console.log(`# ${message}`)
    }
}

let passedChecks = 0
let failedChecks = 0

/* The name of this class shows up in all stack-traces */
class PurpleTapeTest extends Test {
    succeeded() {
        return this.success
    }
}

async function runTest(
    title: string,
    fn: TestFunction,
    t = new PurpleTapeTest()
) {
    console.log(`\n# ${title}`)
    try {
        await fn(t)
    } catch (e) {
        t.fail('shall not throw exception', {
            stack: e,
        })
    }
}

async function run() {
    console.log('TAP version 13')

    if (onlyTest) {
        tests = [onlyTest]
    }

    if (beforeAll) {
        const t = new PurpleTapeTest()
        await runTest('beforeAll', beforeAll, t)
        if (!t.succeeded()) {
            process.exit(1)
        }
    }

    for (let [title, fn] of tests) {
        const t = new PurpleTapeTest()
        if (beforeEach) {
            await runTest(`beforeEach ${title}`, beforeEach, t)
        }

        if (t.succeeded()) {
            await runTest(title, fn)
        }

        if (afterEach) {
            await runTest(`afterEach ${title}`, afterEach)
        }
    }

    if (afterAll) {
        await runTest('afterAll', afterAll)
    }

    console.log(`\n1..${passedChecks + failedChecks}`)
    console.log(`# tests ${passedChecks + failedChecks}`)
    console.log(`# pass  ${passedChecks}`)

    if (failedChecks > 0) {
        console.log(`# fail  ${failedChecks}`)
        process.exitCode = 1
    }
}

setImmediate(run)
