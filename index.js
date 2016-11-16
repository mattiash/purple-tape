var Test = require('tape/lib/test')
var co = require('co')

var _beforeAll = undefined
var _beforeAllDone = false
var _beforeEach = undefined
var _afterEach = undefined

var beforeAll = function( cb ) {
    _beforeAll = cb
}

var beforeEach = function( cb ) {
    _beforeEach = cb
}

var afterEach = function( cb ) {
    _afterEach = cb
}

Test.prototype.run = function () {
    var self = this

    co( function * () {
        if (self._skip) {
            return self.end()
        }
        self.emit('prerun')
        if( _beforeAll && !_beforeAllDone ) {
            _beforeAllDone = true
            yield co(_beforeAll(self))
        }
        if( _beforeEach ) {
            yield co(_beforeEach(self))
        }
        if( self._cb ) {
            try {
                yield co(self._cb(self))
            }
            catch (err) {
                err ? self.error(err) : self.fail(err)
            }
        }
        if( _afterEach ) {
            yield co(_afterEach(self))
        }
        self.end()
        self.emit('run')
    }).catch( function(err) {
        err ? self.error(err) : self.fail(err)        
        self.end()
    })
}

module.exports = require('tape')
module.exports.beforeAll = beforeAll
module.exports.beforeEach = beforeEach
module.exports.afterEach = afterEach
