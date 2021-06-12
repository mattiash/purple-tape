import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test.beforeEach((t) => {
            t.fail('shall fail')
        })

        test('shall not run', (t) => {
            t.ok('shall not run')
        })

        test('shall not run', (t) => {
            t.ok('shall not run')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '2')
        t.equal(testsuites.$.errors, '0')
        t.equal(testsuites.$.failures, '2')
        t.equal(testsuites.$.skipped, '0')
    }
)
