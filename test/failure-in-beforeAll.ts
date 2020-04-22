import 'source-map-support/register'
import { test } from '../index'

test.beforeAll((t) => {
    t.fail('shall fail')
})

test('shall not run', (t) => {
    t.ok('shall not run')
})

test('shall not run', (t) => {
    t.ok('shall not run')
})
