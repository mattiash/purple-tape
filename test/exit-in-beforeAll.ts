import 'source-map-support/register'
import { test } from '../index'

test.beforeAll(() => {
    process.exit(1)
})

test('shall not run', (t) => {
    t.ok('shall not run')
})

test('shall not run', (t) => {
    t.ok('shall not run')
})
