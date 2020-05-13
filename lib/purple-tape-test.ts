import { Test } from './test'
import { TestEntryResult } from './xunit'

// Save original Date in case sinon overrides it
const originalNowFn = Date.now

/* The name of this class shows up in all stack-traces */
export class PurpleTapeTest extends Test {
    private skipped = false
    private readonly startTime = originalNowFn()
    private endTime: number | undefined

    succeeded() {
        return this.success
    }

    endTest() {
        this.ended = true
        this.endTime = originalNowFn()
    }

    skip() {
        this.skipped = true
    }

    testResult(): TestEntryResult {
        if (this.endTime) {
            if (this.firstNonSuccessStatus) {
                return {
                    name: this.title,
                    assertions: this.assertions,
                    status: this.firstNonSuccessStatus,
                    durationMs: this.endTime - this.startTime,
                    message: this.firstNonSuccessMessage,
                }
            } else if (this.skipped) {
                return {
                    name: this.title,
                    assertions: 0,
                    status: 'skipped',
                    durationMs: 0,
                    message: '',
                }
            } else {
                return {
                    name: this.title,
                    assertions: this.assertions,
                    status: 'success',
                    durationMs: this.endTime - this.startTime,
                    message: '',
                }
            }
        } else {
            throw new Error('Cannot get testResult before test has ended')
        }
    }
}
