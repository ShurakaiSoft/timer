# timer

## Motivation

Create a pauseable timer, so that when it is resumed, it continues with the
correct timing. 

In this case `pause()` records the fraction of a 'tick' and `resume()` finishes the
remainder of a 'tick' and not the length of a full 'tick'.


### requirements

* Node.js Module
* user configurable resolution. default: 1 second
* produce 'tick' events every second
* Pauseable, and still keep accurate running time
* Simple API
* Can have many timers per application

### To Do

* refactor tests to make them run faster.


## Usage

Download the timer.js and place it in your project and `require` the file.

    var Timer = require('timer').Timer;

To create a timer

    var timerA = new Timer();
    
To start the timer

    timerA.start();
    
Timer generates 'tick' events which you can listen for.

    timerA.on('tick', function () {
        // update clock...
    });    

To stop the timer

    timerA.pause();

To continue the timer

    timerA.resume();

It will remember the partial tick and will finish that tick on `resume()`.

Note: `start()` and `resume()` are similar, but `start` produces a full tick
where as `resume` completes a partial tick.

There is no `reset()`. For that functionality, use `pause` to stop 'ticks' being
generated and then `start` to produce a full 'tick'.
    


## Tests

requires `mocha` and `should` to be installed.

Uses mocha for tests.

    npm test