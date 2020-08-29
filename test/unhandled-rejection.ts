import 'source-map-support/register'
import { test } from '../index'

test('unhandledRejection', (t) => {
    setTimeout(
        () => new Promise((_, reject) => reject(new Error('rejection'))),
        100
    )
    t.pass('Test ended well')
})
