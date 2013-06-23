/**
 * New node file
 */

var util = require('util');
var events = require('events');

function Timer() {
	this.resolution = 1000;
	this.lastTickStart = 0;
	this.elapsedPartialTick = 0;
	this.tickerHandle = null;

	this._emitTick = function () {
		this.emit('tick');
		this.lastTickStart = Date.now();
	};

	this._startFullTick	= function () {
		var that = this;
		
		this.elapsedPartialTick = 0;
		this.lastTickStart = Date.now();
		this.tickerHandle = setInterval(function () {
			that._emitTick();
		}, this.resolution);
	};
	
	this._stopTimers = function () {
		clearTimeout(this.tickerHandle);
		clearInterval(this.tickerHandle);
	};
	
	// public API
	this.start = function () {
		this._stopTimers();
		this._startFullTick();
	};
	this.pause = function () {
		this._stopTimers();
		var elapsedTime = Date.now() - this.lastTickStart;
		this.elapsedPartialTick += elapsedTime;
	};
	this.resume = function () {
		var that = this;
		var remainingTime = this.resolution - this.elapsedPartialTick;

		function onTick() {
			that._emitTick();
			that._startFullTick();
		}
		
		this.lastTickStart = Date.now();
		if (remainingTime <= 0) {
			process.nextTick(onTick);
		} else {
			this.tickerHandle = setTimeout(onTick, remainingTime);
		}
	};
}
util.inherits(Timer, events.EventEmitter);

// Public API
exports.Timer = Timer;