import 'source-map-support/register'
import { test } from '../index'

test('exit in test', () => {
    process.exit(1)
})
