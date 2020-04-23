import 'source-map-support/register'
import { test } from '../index'

test('skip', (t) => {
    t.fail('this test will fail')
})

test.only('shall run', (t) => {
    t.pass('shall pass')
})
