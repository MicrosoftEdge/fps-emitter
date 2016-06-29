'use strict'

var assert = require('assert')
var Promise = require('lie')
var FpsEmitter = require('..')

/* global describe it */

describe('fps.js', function () {
  it('main test', function () {
    var fps = new FpsEmitter()
    assert.equal(fps.get(), 0)
    return new Promise(function (resolve) {
      fps.once('update', function (newFps) {
        resolve(newFps)
      })
    }).then(function (newFps) {
      assert(newFps > 0, 'fps > 0')
      assert(newFps <= 60, 'fps <= 60')
      assert.equal(fps.get(), newFps)
    })
  })
})
