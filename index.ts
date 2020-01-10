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

export class Test {
    protected passedChecks = 0
    protected failedChecks = 0

    pass(message: string) {
        this.passedChecks++
        console.log(`ok ${passedChecks + failedChecks + 1} - ${message}`)
    }

    fail(message: string, extra: any = undefined) {
        this.failedChecks++
        console.log(`not ok ${passedChecks + failedChecks + 1} - ${message}`)
        if (extra) {
            console.log(inlineYamlBlock(extra))
        }
    }

    ok(criteria: any, message: string = 'ok') {
        if (criteria) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'ok',
                actual: criteria,
                expected: true,
                stack: new Error('not ok').stack,
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

    deepEqual<T>(actual: T, expected: T, message: string = 'deepEqual') {
        if (deepEqual(actual, expected)) {
            this.pass(message)
        } else {
            this.fail(message, {
                operator: 'deepEqual',
                actual: objectInspect(actual),
                expected: objectInspect(expected),
                stack: new Error('not equal').stack,
            })
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
        return this.failedChecks === 0
    }

    updateGlobal() {
        passedChecks += this.passedChecks
        failedChecks += this.failedChecks
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
    t.updateGlobal()
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
    }
}

setImmediate(run)
