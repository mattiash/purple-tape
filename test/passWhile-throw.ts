import 'source-map-support/register'
import { test } from '../index'

test('passWhile throw error', async (t) => {
    t.pass('first assertion')
    let pass = 0
    await t.passWhile(
        () => {
            console.log('pass', pass)
            if (pass === 0) {
                pass++
                t.pass('ok')
            } else {
                throw new Error('failed')
            }
        },
        400,
        100
    )
    t.true(true)
})
