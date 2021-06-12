import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test.afterAll((t) => {
            t.fail('shall fail')
        })

        test('shall run', (t) => {
            t.ok('shall run')
        })

        test('shall run 2', (t) => {
            t.ok('shall run 2')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '3')
        t.equal(testsuites.$.errors, '0')
        t.equal(testsuites.$.failures, '1')
        t.equal(testsuites.$.skipped, '0')
    }
)
