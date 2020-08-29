import 'source-map-support/register'
import { test } from '../index'

test('process.exit(1) after tests', (t) => {
    setTimeout(() => process.exit(1), 1000)
    t.pass('All good so far')
    t.pass('Test ended well')
})
