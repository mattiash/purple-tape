import 'source-map-support/register'
import { test } from '../index'

test('failure', (t) => {
    t.fail('this test shall fail')
})
