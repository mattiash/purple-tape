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

test('premature-exit-early', async (t) => {
    const res = await runTest('./premature-exit-early.js')
    const testsuites = res.xml.testsuites

    t.equal(testsuites.$.tests, '1')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('unhandled rejection', async (t) => {
    const res = await runTest('./unhandled-rejection.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
})

test('uncaught exception', async (t) => {
    const res = await runTest('./uncaught-exception.js')
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

test('tryUntil-throw', async (t) => {
    const res = await runTest('./tryUntil-throw.js')
    const testsuites = res.xml.testsuites

    t.equal(res.exitCode, 1, 'test shall not pass')
    t.equal(testsuites.$.tests, '2')
    t.equal(testsuites.$.errors, '1')
    t.equal(testsuites.$.failures, '0')
    t.equal(testsuites.$.skipped, '0')
    t.equal(testsuites.testsuite[0].testcase[0].$.status, 'success')
    t.equal(testsuites.testsuite[0].testcase[0].$.assertions, '3')
    t.equal(testsuites.testsuite[0].testcase[1].$.status, 'error')
    t.equal(
        testsuites.testsuite[0].testcase[1].$.assertions,
        '2',
        'shall abort if tryUntil fails'
    )
})
