import 'source-map-support/register'
import { test } from '../index'

test.beforeAll(() => {
    throw new Error('an error')
})

test('shall not run', (t) => {
    t.ok('shall not run')
})
