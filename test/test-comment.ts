import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('test with comments', (t) => {
            t.ok(true, 'first assertion')
            t.comment('a mid-test comment')
            t.ok(true, 'second assertion')
            t.comment('another comment')
            t.ok(true, 'third assertion')
        })

        test('test after comments', (t) => {
            t.ok(true, 'passes')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 0, 'test shall pass')
        t.equal(testsuites.$.tests, '2', 'two test cases in xml')
        t.equal(testsuites.$.failures, '0', 'no failures')
        t.equal(testsuites.$.errors, '0', 'no errors')
        t.equal(
            testsuites.testsuite[0].testcase[0].$.name,
            'test with comments',
            'first testcase name correct'
        )
        t.equal(
            testsuites.testsuite[0].testcase[0].$.assertions,
            '3',
            'all three assertions in first testcase'
        )
        t.equal(
            testsuites.testsuite[0].testcase[1].$.name,
            'test after comments',
            'second testcase name correct'
        )
    }
)
