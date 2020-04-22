import { test } from '../index'

test('call t after returning', (t) => {
    t.pass('This shall run')
    setTimeout(() => t.pass('this shall lead to error'), 1000)
})

test('ok test', (t) => {
    t.pass('ok')
})
