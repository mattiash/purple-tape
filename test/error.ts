import 'source-map-support/register'
import { test } from '../index'

test('error throw error', () => {
    throw new Error('test error')
})

test('error throw string', () => {
    throw 'a string'
})
