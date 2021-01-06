import 'source-map-support/register'
import { test } from '../index'

test('tryUntil throw then succeeds', async (t) => {
    t.pass('first assertion')
    let pass = 0
    await t.tryUntil(
        () => {
            pass++
            if (pass > 1) {
                t.pass('Works')
            } else {
                throw new Error('failed')
            }
        },
        400,
        100
    )
    t.true(true)
})

test('tryUntil throw every time', async (t) => {
    t.pass('first assertion')
    await t.tryUntil(
        () => {
            throw new Error('failed')
        },
        400,
        100
    )
    t.true(true)
})
