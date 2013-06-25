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
		var timer = new Timer(100);
		
		timer.once('tick', function () {
			done();
		});
		timer.start();
	});
	it("should pause tick events", function (done) {
		var timer = new Timer(100);
		
		timer.on('tick', function () {
			should.fail("Still ticking after being stopped.");
		});
		setTimeout(function () {
			done();
		}, 250);
		timer.start();
		timer.pause();
	});
	it("should restart", function (done) {
		var timer = new Timer(100);
		var start = Date.now();
		var elapsed = 0;

		timer.start();
		timer.once('tick', function () {
			elapsed = Date.now() - start;
			elapsed.should.be.within(100, 200);
			done();
		});
		setTimeout(function () {
			timer.start();
		}, 50);
	});
	it("should pause", function (done) {
		var timer = new Timer(100);
		var start = Date.now();
		var tickCount = 0;
		
		timer.start();
		timer.on('tick', function () {
			tickCount++;
		});
		setTimeout(function () {
			timer.pause();
		}, 150);
		setTimeout(function () {
			timer.resume();
		}, 350);
		setTimeout(function () {
			tickCount.should.equal(2);
			done();
		},420);
	});
	it("should pause many times", function (done) {
		var timer = new Timer(100);
		var start = Date.now();
		var tickCount = 0;
		
		timer.start();
		timer.on('tick', function () {
			tickCount++;
		});
		
		setTimeout(function () {
			timer.pause();
		}, 120);
		setTimeout(function () {
			timer.resume();
		}, 220);
		setTimeout(function () {
			timer.pause();
		}, 280);
		setTimeout(function () {
			timer.resume();
		}, 380);
		setTimeout(function () {
			timer.pause();
		}, 450);
		setTimeout(function () {
			timer.resume();
		}, 550);
		setTimeout(function () {
			tickCount.should.equal(3);
			done();
		}, 650);
	});
	it("should pause then continue normally", function (done) {
		var timer = new Timer(100);
		var start = Date.now();
		var tickCount = 0;
		timer.on('tick', function () {
			tickCount++;
		});
		timer.start();
		setTimeout(function () {
			timer.pause();
		}, 150);
		setTimeout(function () {
			timer.resume();
		}, 250);
		setTimeout(function () {
			tickCount.should.equal(2);
			done();
		},350);
	});
	it("should do nothing if pause is called before start", function (done) {
		var timer = new Timer(100);
		var start = Date.now();
		var elapsed = 0;

		timer.pause();
		timer.start();
		timer.once('tick', function () {
			elapsed = Date.now() - start;
			elapsed.should.be.within(50, 150);
			done();
		});
	});
	it("should allow multiple timers", function (done) {
		var timerA = new Timer(100);
		var timerB = new Timer(100);
		var aTickCount = 0;
		
		timerA.start();
		timerA.on('tick', function () {
			aTickCount++;
		});
		timerB.once('tick', function () {
			should.fail("Wrong timer ticked!");
		});
		setTimeout(function () {
			aTickCount.should.equal(2);
			done();
		}, 250);
	});
	it("should call resume from initial state.", function (done) {
		var timer = new Timer(100);
		var elapsedTime = 0;
		var tickCount = 0;
		var startTime = Date.now();
		
		timer.resume();
		timer.on('tick', function () {
			tickCount++;
		});
		setTimeout(function () {
			tickCount.should.equal(1);
			elapsedTime = Date.now() - startTime;
			elapsedTime.should.be.within(80, 135);
			done();
		}, 115);
	});
	it("should 'tick' after 200 milliseconds", function (done) {
		var timer = new Timer(200);
		var tickCount = 0;
		
		timer.start();
		timer.on('tick', function () {
			tickCount++;
		});
		setTimeout(function () {
			tickCount.should.equal(1);
			done();
		}, 250);
	});
	
});
