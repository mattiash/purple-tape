import 'source-map-support/register'
import { test } from '../index'
import { testSelf } from './util'

testSelf(
    () => {
        test.beforeAll(async (t) => {
            t.ok(await Promise.resolve(true), 'shall run beforeAll')
        })

        test.afterAll(async (t) => {
            t.ok(await Promise.resolve(true), 'shall run afterAll')
        })

        test.beforeEach(async (t) => {
            t.ok(await Promise.resolve(true), 'shall run beforeEach')
        })

        test.afterEach(async (t) => {
            t.ok(await Promise.resolve(true), 'shall run afterEach')
        })

        test('run test 1', async (t) => {
            t.ok(!(await Promise.resolve(true)), 'shall await results')
            t.equal('a', 'a', 'shall be a')
            t.equal('a', 'b')
            t.equal(undefined, 'a')
            t.deepEqual({ a: 'a' }, { a: 'a' }, 'deepEqual shall succeed')
            t.deepEqual({ a: 'a' }, { a: 'b' }, 'deepEqual shall fail')
        })

        test('run test 2', async (t) => {
            await wait(1000)
            t.ok(await Promise.resolve(true), 'shall await results')
        })

        test.skip('shall be skipped', (t) => {
            t.fail('fails')
        })
    },
    (t, { testsuites, exitCode }) => {
        t.equal(exitCode, 1, 'test shall not pass')
        t.equal(testsuites.$.tests, '9')
        t.equal(testsuites.$.errors, '0')
        t.equal(testsuites.$.failures, '1')
        t.equal(testsuites.$.skipped, '1')
    }
)

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
