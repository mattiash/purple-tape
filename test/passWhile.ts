import 'source-map-support/register'
import { test } from '../index'

test('passWhile synchronous', async (t) => {
    let tries = 0
    await t.passWhile(
        () => {
            tries++
            t.lt(tries, 6)
        },
        400,
        100
    )

    t.true(true)
})

test('passWhile asynchronous', async (t) => {
    let tries = 0
    await t.passWhile(
        async () => {
            tries++
            await wait(50)
            t.lt(tries, 6)
        },
        500,
        100
    )

    t.true(true)
})

test('passWhile synchronous fail', async (t) => {
    let tries = 0
    await t.passWhile(
        () => {
            tries++
            t.lt(tries, 2)
        },
        400,
        100
    )

    t.true(true)
})

test('passWhile asynchronous fail', async (t) => {
    let tries = 0
    await t.passWhile(
        async () => {
            tries++
            await wait(50)
            t.lt(tries, 2)
        },
        500,
        100
    )

    t.true(true)
})

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
