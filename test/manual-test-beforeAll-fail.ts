import { test } from '../index'

test.beforeAll((t) => {
    t.fail('shall fail and then bail')
})

test('shall not run', (t) => {
    t.fail('This shall not run')
})
