# Changelog

## [Unreleased]

-   Add waitUntil method

## [3.5.10] 2020-06-18

-   Generate preliminary xml as fallback if test exits improperly

## [3.5.9] 2020-05-24

-   Convert undefined and null to yaml correctly

## [3.5.8] 2020-05-23

-   Report an error if tests call process.exit()

## [3.5.7] 2020-05-13

-   Build release with github action. No code changes.

## [3.5.6] 2020-05-13

-   Fix regression where time was reported wrong in junit xml

## [3.5.5] 2020-04-23

-   Report skipped tests correctly in junit xml
-   Regard other tests as skipped when using only

## [3.5.4] 2020-04-22

-   Report error if test continues after returning
-   Report skipped tests correctly

## [3.5.3] 2020-04-21

-   Escape attribute values

## [3.5.2] 2020-04-20

-   Summarize time-field correctly
-   Report errors and failures separately

## [3.5.1] 2020-04-16

-   Save Date object in case sinon overrides it later

## [3.5.0] 2020-04-15

-   Generate junit xml output

## [3.4.2] 2020-03-09

-   Make title field public

## [3.4.1] 2020-01-24

-   Don't run beforeEach/afterEach for skipped tests

## [3.4.0] 2020-01-18

-   Add a bail() method
-   bail() if beforeAll fails
-   bail() if test calls t after returning

## [3.3.0] 2020-01-15

-   Test verification functions
-   New verfication functions lt, lte, gt, and gte

## [3.2.1] 2020-01-11

-   Print summary even if beforeAll fails
-   Documentation

## [3.2.0] 2020-01-11

-   t.skip()
-   t.error()
-   Add skip-option to test()

## [3.1.0] 2020-01-11

-   t.true, t.false
-   t.deepLooseEqual, t.notDeepLooseEqual
-   Message for pass and fail shall be optional
-   Allow synchronous test-functions

## [3.0.2] 2020-01-10

-   Fix output format
-   test.skip()
-   notOk, notEqual, notDeepEqual
-   throws, doesNotThrow

## [3.0.1] 2020-01-10

-   Change module import pattern
-   Allow argument to ok() to be any
-   Exit with 1 on error

## [3.0.0] 2020-01-10

-   Rewritten from scratch without dependency on tape
-   Limited set of t.\* functions.

## [2.0.1] 2017-12-09

-   Improved typings. @markanderstam

## [2.0.0] 2017-11-22

-   Added an afterAll method. @markanderstam
-   Removed the onFinish method. @markanderstam
