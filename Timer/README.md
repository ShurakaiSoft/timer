# Timer Module

## Motivation

Create a pauseable timer, so that when it is resumed, it continues with the
correct timing. 

In this case pausing records the fraction of a 'tick' and resuming finishes the
remainder of a 'tick' and not the length of a full 'tick'.


### requirements

* Node.js Module
* 1 second resolution
* produce 'tick' events every second
* Pauseable, and still keep accurate running time
* Simple API
* Can have many timers per application.

### Future extensions

* Sub second resolution. (configurable)


## Tests

Uses mocha for tests.

`npm test`