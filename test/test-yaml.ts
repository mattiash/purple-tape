import 'source-map-support/register'
import { test } from '../index'
import { inlineYamlBlock } from '../lib/yaml'

test('yaml', (t) => {
    t.doesNotThrow(() => {
        inlineYamlBlock({
            expected: 'a',
            actual: 'b',
        })
    })
    t.doesNotThrow(() => {
        inlineYamlBlock({
            expected: undefined,
            actual: 'b',
        })
    })
})
