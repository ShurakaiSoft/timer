/**
 * Unit tests for node timer module.
 */

var should = require('should');
var Timer = require('../lib/timer').Timer;

describe("timer module", function () {
	it("should return an object with callable functions", function () {
		var timer = new Timer();
		
		timer.should.be.a('object');
		timer.should.have.ownProperty('start');
		timer.should.have.ownProperty('pause');
		timer.should.have.ownProperty('resume');
	});
	it("should create 'tick' events", function (done) {
		var timer = new Timer();
		
		timer.once('tick', function () {
			done();
		});
		timer.start();
	});
	it("should pause tick events", function (done) {
		var timer = new Timer();
		
		timer.on('tick', function () {
			should.fail("Still ticking after being stopped.");
		});
		setTimeout(function () {
			done();
		}, 1200);
		timer.start();
		timer.pause();
	});
	it("should restart", function (done) {
		var timer = new Timer();
		var start = Date.now();
		var elapsed = 0;
		
		timer.once('tick', function () {
			elapsed = Date.now() - start;
			if (elapsed < 1500) {
				should.fail("reset failed.");
			}
			done();
		});
		timer.start();
		setTimeout(function () {
			timer.start();
		}, 500);
	});
	it("should pause", function (done) {
		var timer = new Timer();
		var start = Date.now();
		var elapsed = 0;
		
		timer.once('tick', function () {
			elapsed = Date.now() - start;
			if (elapsed < 1150) {
				should.fail("did not pause");
			} else if (elapsed > 1250) {
				should.fail("paused for too long");
			}
			done();
		});
		timer.start();
		setTimeout(function () {
			timer.pause();
		}, 200);
		setTimeout(function () {
			timer.resume();
		}, 400);
	});
	it("should pause many times", function (done) {
		var timer = new Timer();
		var start = Date.now();
		timer.once('tick', function () {
			var elapsed = Date.now() - start;
			if (elapsed < 1250) {
				should.fail("pause too short: " + elapsed);
			} else if (elapsed > 1350) {
				should.fail("pause too long: " + elapsed);
			}
			done();
		});
		timer.start();
		setTimeout(function () {
			timer.pause();
		}, 100);
		setTimeout(function () {
			timer.resume();
		}, 200);
		setTimeout(function () {
			timer.pause();
		}, 300);
		setTimeout(function () {
			timer.resume();
		}, 400);
		setTimeout(function () {
			timer.pause();
		}, 500);
		setTimeout(function () {
			timer.resume();
		}, 600);
	});
	it("should pause then continue normally", function (done) {
		this.timeout(3000);
		var timer = new Timer();
		var start = Date.now();
		var tickCount = 0;
		timer.on('tick', function () {
			tickCount++;
			if (tickCount == 2) {
				var elapsed = Date.now() - start;
				if (elapsed < 2050) {
					should.fail("pause too short: " + elapsed);
				} else if (elapsed > 2150) {
					should.fail("pause too long: " + elapsed);
				}
				done();
			}
		});
		timer.start();
		setTimeout(function () {
			timer.pause();
		}, 100);
		setTimeout(function () {
			timer.resume();
		}, 200);
	});
	it("should do nothing if pause is called before start", function (done) {
		var timer = new Timer();
		var start = Date.now();
		var elapsed = 0;

		timer.pause();
		timer.start();
		timer.once('tick', function () {
			elapsed = Date.now() - start;
			elapsed.should.be.within(950, 1050);
			done();
		});
	});
	it("should allow multiple timers", function (done) {
		var timerA = new Timer();
		var timerB = new Timer();
		var aTicked = false;
		
		timerA.start();
		timerA.once('tick', function () {
			aTicked = true;
		});
		timerB.on('tick', function () {
			should.fail("Wrong timer ticked!");
		});
		setTimeout(function () {
			if (!aTicked) {
				should.fail("Running timer never ticked!");
			}
			done();
		}, 1100);
	});
});
