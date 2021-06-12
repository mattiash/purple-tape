import { Test, test } from '../index'
import { parseString } from 'xml2js'
import { file as tempFilename } from 'tempy'
import { spawnSync } from 'child_process'
import { readFileSync, unlinkSync } from 'fs'

function xmlParse(xmlstring: string) {
    return new Promise((resolve, reject) => {
        parseString(xmlstring, (err, result) => {
            err ? reject(err) : resolve(result)
        })
    })
}

async function runTest(testname: string) {
    const xmlfile = tempFilename()
    const result = spawnSync(process.argv[0], [testname], {
        env: {
            PT_XUNIT_FILE: xmlfile,
            RUN_TEST: '1',
        },
    })

    let xml: any
    try {
        const xmlstring = readFileSync(xmlfile).toString()
        xml = await xmlParse(xmlstring)
        unlinkSync(xmlfile)
    } catch (e) {}

    console.log(result.stderr.toString())
    return {
        exitCode: result.status,
        tap: result.stdout.toString(),
        xml,
    }
}

export function testSelf(
    testFn: () => void,
    check: (
        t: Test,
        result: { testsuites: any; exitCode: number | null }
    ) => void
) {
    if (process.env.RUN_TEST) {
        testFn()
    } else {
        test('testSelf', async (t: Test) => {
            const testScript = process.argv[1]
            const res = await runTest(testScript)
            const testsuites = res.xml.testsuites

            await check(t, { testsuites, exitCode: res.exitCode })
        })
    }
}
