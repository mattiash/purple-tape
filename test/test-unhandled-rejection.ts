import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('unhandledRejection', (t) => {
            setTimeout(
                () =>
                    new Promise((_, reject) => reject(new Error('rejection'))),
                100
            )
            t.pass('Test ended well')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '2')
        t.equal(testsuites.$.errors, '1')
        t.equal(testsuites.$.failures, '0')
        t.equal(testsuites.$.skipped, '0')
    }
)
