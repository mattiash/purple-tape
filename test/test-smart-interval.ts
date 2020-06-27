import { test } from '../index'
import { smartInterval } from '../lib/test'

test('smartInterval', (t) => {
    t.equal(smartInterval(1000), 100)
    t.equal(smartInterval(10 * 60 * 1000), 5_000)
    t.equal(smartInterval(6_000), 200)
})
