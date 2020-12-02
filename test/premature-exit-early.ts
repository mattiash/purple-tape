import 'source-map-support/register'
import { test } from '../index'
process.kill(process.pid, 9)

test('bad require', () => {})
