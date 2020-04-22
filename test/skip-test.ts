import 'source-map-support/register'
import { test } from '../index'

test.skip('skip', (t) => {
    t.fail('this test will fail')
})

test('shall run', (t) => {
    t.pass('shall pass')
})
