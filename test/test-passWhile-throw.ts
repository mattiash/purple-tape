import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('passWhile throw error', async (t) => {
            t.pass('first assertion')
            let pass = 0
            await t.passWhile(
                () => {
                    console.log('pass', pass)
                    if (pass === 0) {
                        pass++
                        t.pass('ok')
                    } else {
                        throw new Error('failed')
                    }
                },
                400,
                100
            )
            t.true(true)
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '1')
        t.equal(testsuites.$.errors, '1')
        t.equal(testsuites.$.failures, '0')
        t.equal(testsuites.$.skipped, '0')
        t.equal(testsuites.testsuite[0].testcase[0].$.status, 'error')
        t.equal(
            testsuites.testsuite[0].testcase[0].$.assertions,
            '3',
            'shall continue if passWhile fails'
        )
    }
)
