import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        process.kill(process.pid, 9)

        test('bad require', () => {})
    },
    (t, { testsuites }) => {
        t.equal(testsuites.$.tests, '1')
        t.equal(testsuites.$.errors, '1')
        t.equal(testsuites.$.failures, '0')
        t.equal(testsuites.$.skipped, '0')
    }
)
