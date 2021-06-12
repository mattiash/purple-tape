import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test.skip('skip', (t) => {
            t.fail('this test will fail')
        })

        test('shall run', (t) => {
            t.pass('shall pass')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 0, 'test shall pass')
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
    }
)
