export type TestEntryResult = {
    name: string
    durationMs: number
    assertions: number
    status: 'success' | 'failed' | 'error' | 'skipped'
    message: string | undefined // Details for failed or error status
}

export type TestReport = {
    name: string
    startTime: Date
    entries: Array<TestEntryResult>
}

export function generateXunit(tr: TestReport) {
    let r = ''
    r += '<?xml version="1.0" encoding="UTF-8"?>'
    let tests = 0
    let skipped = 0
    let errors = 0
    let failures = 0
    let durationMs = 0

    for (let test of tr.entries) {
        tests++
        durationMs += test.durationMs
        switch (test.status) {
            case 'error':
                errors++
                break
            case 'skipped':
                skipped++
                break
            case 'failed':
                failures++
                break
        }
    }

    r += `<testsuites tests="${tests}" skipped="${skipped}" errors="${errors}" failures="${failures}" name="${
        tr.name
    }" time="${(durationMs / 1000).toFixed(3)}">`
    r += `<testsuite tests="${tests}" skipped="${skipped}" errors="${errors}" failures="${failures}" name="${
        tr.name
    }" time="${(durationMs / 1000).toFixed(
        3
    )}" timestamp="${tr.startTime.toISOString()}">`
    for (let test of tr.entries) {
        r += `<testcase name="${test.name}" classname="${
            tr.name
        }" assertions="${test.assertions}" status="${test.status}" time="${(
            test.durationMs / 1000
        ).toFixed(3)}">`
        if (test.status === 'failed') {
            r += `<failure message="not used" type="notUsed"><![CDATA[${test.message}]]></failure>`
        } else if (test.status === 'error') {
            r += `<error message="not used" type="notUsed"><![CDATA[${test.message}]]></error>`
        }
        r += `</testcase>`
    }
    r += '</testsuite>'
    r += '</testsuites>'
    return r
}
