import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('tryUntil synchronous', async (t) => {
            let tries = 0
            await t.tryUntil(
                () => {
                    tries++
                    t.equal(tries, 3)
                },
                400,
                100
            )

            t.true(true)
        })

        test('tryUntil asynchronous', async (t) => {
            let tries = 0
            await t.tryUntil(
                async () => {
                    tries++
                    await wait(50)
                    t.equal(tries, 3)
                },
                500,
                100
            )

            t.true(true)
        })

        test('tryUntil synchronous fail', async (t) => {
            let tries = 0
            await t.tryUntil(
                () => {
                    tries++
                    t.equal(tries, 6)
                },
                400,
                100
            )

            t.true(true)
        })

        test('tryUntil asynchronous fail', async (t) => {
            let tries = 0
            await t.tryUntil(
                async () => {
                    tries++
                    await wait(50)
                    t.equal(tries, 6)
                },
                500,
                100
            )

            t.true(true)
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
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
    }
)

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
