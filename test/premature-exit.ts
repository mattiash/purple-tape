import 'source-map-support/register'
import { test } from '../index'

test('kill -9 in test', () => {
    process.kill(process.pid, 9)
})
