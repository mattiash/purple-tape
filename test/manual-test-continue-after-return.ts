import { test } from '../index'

test('call t after returning', (t) => {
    t.pass('This shall run')
    setTimeout(() => t.pass('this shall lead to error'), 100)
})
