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
            tests.push([`SKIP ${title}`, () => {}])
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
    tests.push([`SKIP ${title}`, undefined])
}

async function runTest(title: string, fn: TestFunction) {
    if (bailOut) {
        return undefined
    } else {
        const t = new PurpleTapeTest(title)
        console.log(`\n# ${title}`)

        try {
            await fn(t)
        } catch (e) {
            if (e instanceof BailError) {
            } else {
                t.errorOut('shall not throw exception', {
                    stack: e?.stack || '',
                })
            }
        }
        t.endTest()

        return t
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

    if (onlyTest) {
        tests = [onlyTest]
    }

    if (beforeAll) {
        const testResult = await runTest('beforeAll', beforeAll)
        tr.entries.push(testResult)
        if (testResult && !testResult.succeeded()) {
            bail('beforeAll failed')
        }
    }

    for (let [title, fn] of tests) {
        if (fn) {
            let beforeEachSucceded = true
            if (beforeEach) {
                const testResult = await runTest(
                    `beforeEach ${title}`,
                    beforeEach
                )
                tr.entries.push(testResult)
                beforeEachSucceded = !!testResult && testResult.succeeded()
            }

            if (beforeEachSucceded) {
                const testResult = await runTest(title, fn)
                tr.entries.push(testResult)
            }

            if (afterEach) {
                const testResult = await runTest(
                    `afterEach ${title}`,
                    afterEach
                )
                tr.entries.push(testResult)
            }
        } else {
            const testResult = await runTest(title, () => {})
            tr.entries.push(testResult)
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
