import 'source-map-support/register'
import { inlineYamlBlock } from '../lib/yaml'
import { test } from '../index'

test('yaml with function value produces valid output', async (t) => {
    let result: string
    t.doesNotThrow(
        () => {
            result = inlineYamlBlock({ callback: () => {} })
        },
        /./,
        'inlineYamlBlock shall not throw when given an object containing a function value'
    )
    t.true(
        result!.includes('[Function]'),
        'inlineYamlBlock shall describe function values as [Function]'
    )
})
