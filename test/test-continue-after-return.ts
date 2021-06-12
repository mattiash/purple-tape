import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test('call t after returning', (t) => {
            t.pass('This shall run')
            setTimeout(() => t.pass('this shall lead to error'), 1000)
        })

        test('ok test', (t) => {
            t.pass('ok')
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
