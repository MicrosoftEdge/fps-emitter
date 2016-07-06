//--------------------------------------------------------------
//
// Microsoft Edge fps-emitter
// Copyright(c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files(the ""Software""),
// to deal in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions :
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS
// OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
// OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//--------------------------------------------------------------
'use strict'

/* global performance */

var DEFAULT_UPDATE_INTERVAL = 1000

var raf = require('raf')
var EE = require('events').EventEmitter
var inherits = require('inherits')

inherits(FpsEmitter, EE)

function FpsEmitter (interval) {
  if (!(this instanceof FpsEmitter)) {
    return new FpsEmitter(interval)
  }
  EE.call(this)

  this.setUpdateInterval(interval)

  // avoid functions-within-functions, use bound functions for perf
  this.__onTimer = this.__onTimer.bind(this)
  this.__onRaf = this.__onRaf.bind(this)

  this.__fps = 0
  this.__total = 0
  this.__samples = 0
  this.__lastSample = this.__lastSampleBatch = performance.now()

  // it's possible for raf to be called twice in a frame, hence setInterval(..., 16)
  setInterval(this.__onTimer, 16)
}

FpsEmitter.prototype.__onTimer = function () {
  raf(this.__onRaf)
}

FpsEmitter.prototype.__onRaf = function () {
  // update the new timestamp and total intervals recorded
  var newTS = performance.now()
  this.__samples++
  this.__total += newTS - this.__lastSample
  if (newTS - this.__lastSampleBatch >= this.__interval) {
    // calculate the rolling average
    var fps = 1000 / (this.__total / this.__samples)
    // clamp to 60, use ~~ as a fast Math.floor()
    fps = fps > 60 ? 60 : ~~fps
    if (this.__fps !== fps) {
      // emit when changed
      this.__fps = fps
      this.emit('update', fps)
    }
    // reset
    this.__total = 0
    this.__samples = 0
    this.__lastSampleBatch = newTS
  }
  this.__lastSample = newTS
}

FpsEmitter.prototype.setUpdateInterval = function (interval) {
  this.__interval = typeof interval === 'number' && interval > 0
      ? interval : DEFAULT_UPDATE_INTERVAL
}

FpsEmitter.prototype.get = function () {
  return this.__fps
}

module.exports = FpsEmitter
