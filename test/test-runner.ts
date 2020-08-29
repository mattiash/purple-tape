import 'source-map-support/register'
import { test } from '../index'
import { parseString } from 'xml2js'
import { file as tempFilename } from 'tempy'
import { spawnSync } from 'child_process'
import { readFileSync, unlinkSync } from 'fs'

function xmlParse(xmlstring: string) {
    return new Promise((resolve, reject) => {
        parseString(xmlstring, (err, result) => {
            err ? reject(err) : resolve(result)
        })
    })
}

async function runTest(testname: string) {
    const xmlfile = tempFilename()
    const result = spawnSync(process.argv[0], [`${__dirname}/${testname}`], {
        env: {
            PT_XUNIT_FILE: xmlfile,
        },
    })

    let xml: any
    try {
        const xmlstring = readFileSync(xmlfile).toString()
        xml = await xmlParse(xmlstring)
        unlinkSync(xmlfile)
    } catch (e) {}

    console.log(result.stderr.toString())
    return {
        exitCode: result.status,
        tap: result.stdout.toString(),
        xml,
    }
}

test('failure', async (t) => {
    const res = await runTest('./failure.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '1')
    t.equal(testsuites.$.skipped, '0')
})

test('error', async (t) => {
    const res = await runTest('./error.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '2')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('skip-test', async (t) => {
    const res = await runTest('./skip-test.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 0, 'test shall pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '1')
    t.true(
        testsuites.testsuite[0].testcase[0].skipped,
        'first test marked as skipped'
    )
    t.false(
        testsuites.testsuite[0].testcase[1].skipped,
        'second test not marked as skipped'
    )
})

test('only-test', async (t) => {
    const res = await runTest('./only-test.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 0, 'test shall pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '1')
    t.true(
        testsuites.testsuite[0].testcase[0].skipped,
        'first test marked as skipped'
    )
    t.false(
        testsuites.testsuite[0].testcase[1].skipped,
        'second test not marked as skipped'
    )
})

test('failure-in-beforeAll', async (t) => {
    const res = await runTest('./failure-in-beforeAll.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '1')
    t.equal(testsuites.$.skipped, '0')
})

test('failure-in-afterAll', async (t) => {
    const res = await runTest('./failure-in-afterAll.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '3')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '1')
    t.equal(testsuites.$.skipped, '0')
})

test('error-in-beforeAll', async (t) => {
    const res = await runTest('./error-in-beforeAll.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('error-in-afterAll', async (t) => {
    const res = await runTest('./error-in-afterAll.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '3')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('error-in-beforeEach', async (t) => {
    const res = await runTest('./error-in-beforeEach.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('error-in-afterEach', async (t) => {
    const res = await runTest('./error-in-afterEach.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '4')
    t.equal(testsuites.$.errors, '2')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('failure-in-beforeEach', async (t) => {
    const res = await runTest('./failure-in-beforeEach.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '2')
    t.equal(testsuites.$.skipped, '0')
})

test('failure-in-afterEach', async (t) => {
    const res = await runTest('./failure-in-afterEach.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '4')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '2')
    t.equal(testsuites.$.skipped, '0')
})

test('test-complete', async (t) => {
    const res = await runTest('./manual-test-complete.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '9')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '1')
    t.equal(testsuites.$.skipped, '1')
})

test('continue-after-return', async (t) => {
    const res = await runTest('./continue-after-return.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('exit', async (t) => {
    const res = await runTest('./exit.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('exit-in-beforeEach', async (t) => {
    const res = await runTest('./exit-in-beforeEach.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('exit-in-afterEach', async (t) => {
    const res = await runTest('./exit-in-afterEach.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('exit-in-beforeAll', async (t) => {
    const res = await runTest('./exit-in-beforeAll.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('exit-in-afterAll', async (t) => {
    const res = await runTest('./exit-in-afterAll.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '3')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('premature-exit', async (t) => {
    const res = await runTest('./premature-exit.js')
    const testsuites = res.xml.testsuites

    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('exit-after-last-test', async (t) => {
    const res = await runTest('./exit-after-last-test.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('tryUntil', async (t) => {
    const res = await runTest('./tryUntil.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '4')
    t.equal(testsuites.$.errors, '0')
    t.equal(testsuites.$.failures, '2')
    t.equal(testsuites.$.skipped, '0')
    t.equal(testsuites.testsuite[0].testcase[0].$.status, 'success')
    t.equal(testsuites.testsuite[0].testcase[0].$.assertions, '2')
    t.equal(testsuites.testsuite[0].testcase[1].$.status, 'success')
    t.equal(testsuites.testsuite[0].testcase[1].$.assertions, '2')
    t.equal(testsuites.testsuite[0].testcase[2].$.status, 'failed')
    t.equal(
        testsuites.testsuite[0].testcase[2].$.assertions,
        '1',
        'shall abort if tryUntil fails'
    )
    t.equal(testsuites.testsuite[0].testcase[3].$.status, 'failed')
    t.equal(
        testsuites.testsuite[0].testcase[3].$.assertions,
        '1',
        'shall abort if tryUntil fails'
    )
})
