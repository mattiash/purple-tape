var Test = require('tape/lib/test')
var co = require('co')

var _beforeEach = undefined

var beforeEach = function( cb ) {
  console.log('beforeEach')
  _beforeEach = cb
}

Test.prototype.run = function () {
    var self = this
    co( function * () {
        if (self._skip) {
            return self.end()
        }
        self.emit('prerun')
        if( _beforeEach ) {
            yield co(_beforeEach(self))
        }
        if( self._cb ) {
            yield co(self._cb(self))
        }
        self.end()
        self.emit('run')
  }).catch( function(err) {
      err ? self.error(err) : self.fail(err)
      self.end()
  })
}

module.exports = require('tape')
module.exports.beforeEach = beforeEach
