import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test.beforeEach((t) => {
            t.errorComment('comment1')
            t.errorComment(() => 'comment2')
        })

        test('passing', (t) => {
            t.ok('Passes')
        })

        test('failing', (t) => {
            t.fail('Fails')
        })

        test('error', () => {
            throw new Error('error')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '6')
        t.equal(testsuites.$.errors, '1')
        t.equal(testsuites.$.failures, '1')
        t.equal(testsuites.testsuite[0].testcase[1].$.status, 'success')
        t.equal(testsuites.testsuite[0].testcase[1].$.assertions, '1')
        t.equal(testsuites.testsuite[0].testcase[3].$.status, 'failed')
        t.equal(testsuites.testsuite[0].testcase[3].$.assertions, '1')
        t.equal(
            testsuites.testsuite[0].testcase[3].failure[0]['_'],
            'Fails\ncomment1\ncomment2'
        )
        t.equal(testsuites.testsuite[0].testcase[5].$.status, 'error')
        t.equal(testsuites.testsuite[0].testcase[3].$.assertions, '1')
        t.true(
            testsuites.testsuite[0].testcase[3].failure[0]['_'].match(
                '\ncomment1\ncomment2'
            )
        )
        t.equal(testsuites.$.skipped, '0')
    }
)
