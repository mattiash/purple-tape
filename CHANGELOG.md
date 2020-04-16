# Changelog

## [Unreleased]

-   Save Date object in case sinon overrides it later

## 3.5.0 2020-04-15

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
