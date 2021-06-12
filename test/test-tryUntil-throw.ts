import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('tryUntil throw then succeeds', async (t) => {
            t.pass('first assertion')
            let pass = 0
            await t.tryUntil(
                () => {
                    pass++
                    if (pass > 1) {
                        t.pass('Works')
                    } else {
                        throw new Error('failed')
                    }
                },
                400,
                100
            )
            t.true(true)
        })

        test('tryUntil throw every time', async (t) => {
            t.pass('first assertion')
            await t.tryUntil(
                () => {
                    throw new Error('failed')
                },
                400,
                100
            )
            t.true(true)
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
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
    }
)
