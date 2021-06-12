import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('passWhile synchronous', async (t) => {
            let tries = 0
            await t.passWhile(
                () => {
                    tries++
                    t.lt(tries, 6)
                },
                400,
                100
            )

            t.true(true)
        })

        test('passWhile asynchronous', async (t) => {
            let tries = 0
            await t.passWhile(
                async () => {
                    tries++
                    await wait(50)
                    t.lt(tries, 6)
                },
                500,
                100
            )

            t.true(true)
        })

        test('passWhile synchronous fail', async (t) => {
            let tries = 0
            await t.passWhile(
                () => {
                    tries++
                    t.lt(tries, 2)
                },
                400,
                100
            )

            t.true(true)
        })

        test('passWhile asynchronous fail', async (t) => {
            let tries = 0
            await t.passWhile(
                async () => {
                    tries++
                    await wait(50)
                    t.lt(tries, 2)
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
            '2',
            'shall continue if passWhile fails'
        )
        t.equal(testsuites.testsuite[0].testcase[3].$.status, 'failed')
        t.equal(
            testsuites.testsuite[0].testcase[3].$.assertions,
            '2',
            'shall continue if passWhile fails'
        )
    }
)

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
