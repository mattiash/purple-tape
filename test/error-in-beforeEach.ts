import 'source-map-support/register'
import { test } from '../index'

test.beforeEach(() => {
    throw new Error('an error')
})

test('shall not run', (t) => {
    t.ok('shall not run')
})
