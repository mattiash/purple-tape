import 'source-map-support/register'
import { test } from '../index'
import { inlineYamlBlock } from '../lib/yaml'

test('yaml does not throw', async (t) => {
    t.doesNotThrow(
        () => {
            inlineYamlBlock({
                expected: 'a',
                actual: 'b',
            })
        },
        /./,
        'inlineYamlBlock shall not throw when given an object with string values'
    )
    t.doesNotThrow(
        () => {
            inlineYamlBlock({
                expected: undefined,
                actual: 'b',
            })
        },
        /./,
        'inlineYamlBlock shall not throw when given an object with undefined values'
    )
})

test('yaml correct output', async (t) => {
    t.equal(
        inlineYamlBlock(undefined),
        '',
        'inlineYamlBlock shall return empty string for undefined input'
    )
    t.equal(
        inlineYamlBlock(''),
        '',
        'inlineYamlBlock shall return empty string for empty string input'
    )
    t.equal(
        inlineYamlBlock({ a: 'b' }),
        `  ---
  a: b
  ...
`,
        'inlineYamlBlock shall format simple object with proper indentation'
    )
    t.equal(
        inlineYamlBlock({
            message: 'First line invalid',
            severity: 'fail',
            data: {
                got: 'Flirble',
                expect: 'Fnible',
            },
        }),
        `  ---
  message: First line invalid
  severity: fail
  data:
    got: Flirble
    expect: Fnible
  ...
`,
        'inlineYamlBlock shall format nested object with proper indentation'
    )
})

test('yaml with Error object', async (t) => {
    const error = new Error('Test error message')
    const result = inlineYamlBlock(error)

    t.true(
        result.includes('message: Test error message'),
        'inlineYamlBlock shall include error message when given an Error object'
    )
    t.true(
        result.includes('stack:'),
        'inlineYamlBlock shall include stack trace when given an Error object'
    )
    t.true(
        result.includes('name: Error'),
        'inlineYamlBlock shall include error name when given an Error object'
    )
})
