var Test = require('tape/lib/test')
var co = require('co')

Test.prototype.run = function () {
  if (this._skip) {
    return this.end()
  }
  this.emit('prerun')
  var p = this._cb && co(this._cb(this))
  var self = this
  p.then(function () {
    self.end()
  }, function (err) {
    err ? self.error(err) : self.fail(err)
    self.end()
  })
  this.emit('run')
}

module.exports = require('tape')
