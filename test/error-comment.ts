import 'source-map-support/register'
import { test } from '../index'

test.beforeEach((t) => {
    t.errorComment('comment1')
    t.errorComment(() => 'comment2')
})

test('passing', (t) => {
    t.ok('Passes')
})

test('failing', (t) => {
    t.fail('Fails')
})

test('error', () => {
    throw new Error('error')
})
