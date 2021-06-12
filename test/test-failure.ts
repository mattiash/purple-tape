import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('failure', (t) => {
            t.fail('this test shall fail')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '1')
        t.equal(testsuites.$.errors, '0')
        t.equal(testsuites.$.failures, '1')
        t.equal(testsuites.$.skipped, '0')
    }
)
