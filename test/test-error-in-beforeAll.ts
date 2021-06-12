import 'source-map-support/register'
import { test } from '../index'

import { testSelf } from './util'

testSelf(
    () => {
        test.beforeAll(() => {
            throw new Error('an error')
        })

        test('shall not run', (t) => {
            t.ok('shall not run')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '1')
        t.equal(testsuites.$.errors, '1')
        t.equal(testsuites.$.failures, '0')
        t.equal(testsuites.$.skipped, '0')
    }
)
