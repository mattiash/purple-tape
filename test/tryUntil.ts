import 'source-map-support/register'
import { test } from '../index'

test('tryUntil synchronous', async (t) => {
    let tries = 0
    await t.tryUntil(
        () => {
            tries++
            t.equal(tries, 3)
        },
        400,
        100
    )

    t.true(true)
})

test('tryUntil asynchronous', async (t) => {
    let tries = 0
    await t.tryUntil(
        async () => {
            tries++
            await wait(50)
            t.equal(tries, 3)
        },
        500,
        100
    )

    t.true(true)
})

test('tryUntil synchronous fail', async (t) => {
    let tries = 0
    await t.tryUntil(
        () => {
            tries++
            t.equal(tries, 6)
        },
        400,
        100
    )

    t.true(true)
})

test('tryUntil asynchronous fail', async (t) => {
    let tries = 0
    await t.tryUntil(
        async () => {
            tries++
            await wait(50)
            t.equal(tries, 6)
        },
        500,
        100
    )

    t.true(true)
})

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
