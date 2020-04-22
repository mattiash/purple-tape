import 'source-map-support/register'
import { test } from '../index'

test.afterAll(() => {
    throw new Error('an error')
})

test('shall run', (t) => {
    t.ok('shall run')
})

test('shall run 2', (t) => {
    t.ok('shall run 2')
})
