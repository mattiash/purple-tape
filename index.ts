import {
    Test,
    bailOut,
    BailError,
    bail,
    passedChecks,
    failedChecks,
    erroredChecks,
} from './lib/test'
export { Test }
import { TestReport, generateXunit } from './lib/xunit'
import { basename } from 'path'
import { writeFileSync } from 'fs'
import { PurpleTapeTest } from './lib/purple-tape-test'

const OriginalDate = Date

type TestFunction = (t: Test) => void | Promise<void>

type TestEntry = [string, TestFunction | undefined]

let tests = new Array<TestEntry>()
let currentTest = new PurpleTapeTest('dummy')

export function test(title: string, fn: TestFunction): void
export function test(
    title: string,
    opts: { skip?: boolean },
    fn: TestFunction
): void
export function test(
    title: string,
    opts: { skip?: boolean } | TestFunction,
    fn?: TestFunction
) {
    if (typeof opts === 'function') {
        fn = opts
        opts = {}
    }

    if (fn) {
        if (opts.skip) {
            tests.push([title, undefined])
        } else {
            tests.push([title, fn])
        }
    } else {
        throw new Error('Must supply test-function')
    }
}

let beforeEach: TestFunction | undefined
let afterEach: TestFunction | undefined
let beforeAll: TestFunction | undefined
let afterAll: TestFunction | undefined
let onlyTest = -1 // Index into tests

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
    if (onlyTest > -1) {
        throw new Error('Can only have one test.only')
    } else {
        test(title, fn)
        onlyTest = tests.length - 1
    }
}

test.skip = (title: string, fn: TestFunction) => {
    test(title, { skip: true }, fn)
}

async function runTest(title: string, fn: TestFunction) {
    if (bailOut) {
        return undefined
    } else {
        currentTest = new PurpleTapeTest(title)
        console.log(`\n# ${title}`)

        try {
            await fn(currentTest)
        } catch (e) {
            if (e instanceof BailError) {
            } else {
                currentTest.errorOut('shall not throw exception', {
                    stack: e?.stack || '',
                })
            }
        }
        currentTest.endTest()

        return currentTest
    }
}

async function run() {
    console.log('TAP version 13')
    let tr: TestReport = {
        name:
            process.env.PT_XUNIT_NAME || basename(require.main?.filename || ''),
        startTime: new OriginalDate(),
        entries: [],
    }

    process.on('exit', () => summarize(tr))

    if (onlyTest > -1) {
        tests.forEach((test, i) => {
            if (i !== onlyTest) {
                test[1] = undefined
            }
        })
    }

    if (beforeAll) {
        const pt = await runTest('beforeAll', beforeAll)
        tr.entries.push(pt)
        if (pt && !pt.succeeded()) {
            bail('beforeAll failed')
        }
    }

    for (let [title, fn] of tests) {
        if (fn) {
            let beforeEachSucceded = true
            if (beforeEach) {
                const pt = await runTest(`beforeEach ${title}`, beforeEach)
                tr.entries.push(pt)
                beforeEachSucceded = !!pt && pt.succeeded()
            }

            if (beforeEachSucceded) {
                const pt = await runTest(title, fn)
                tr.entries.push(pt)
            }

            if (afterEach) {
                const pt = await runTest(`afterEach ${title}`, afterEach)
                tr.entries.push(pt)
            }
        } else {
            const pt = new PurpleTapeTest(title)
            pt.skip()
            pt.endTest()
            console.log(`\n# SKIP ${title}`)

            tr.entries.push(pt)
        }
    }
    if (afterAll) {
        const testResult = await runTest('afterAll', afterAll)
        tr.entries.push(testResult)
    }

    if (bailOut) {
        // Avoid something hanging the process after a bailout
        process.exit(1)
    }
}

function summarize(tr: TestReport) {
    if (!currentTest.ended) {
        currentTest['_errorOut']('process.exit called', {})
        currentTest.endTest()
        tr.entries.push(currentTest)
    }
    if (process.env.PT_XUNIT_FILE) {
        writeFileSync(process.env.PT_XUNIT_FILE, generateXunit(tr))
    }
    console.log(`\n1..${passedChecks + failedChecks + erroredChecks}`)
    console.log(`# tests ${passedChecks + failedChecks + erroredChecks}`)
    console.log(`# pass  ${passedChecks}`)

    if (failedChecks + erroredChecks > 0) {
        console.log(`# fail  ${failedChecks + erroredChecks}`)
        process.exitCode = 1
    }
}

setImmediate(run)
