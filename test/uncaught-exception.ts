import 'source-map-support/register'
import { test } from '../index'

test('uncaughtException', (t) => {
    setTimeout(() => {
        throw new Error('exception')
    }, 100)
    t.pass('Test ended well')
})
