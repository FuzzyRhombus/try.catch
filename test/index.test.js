var test = require('tape'),
    sinon = require('sinon');
var Try = require('../');

var returnVal = 'test';
var error = new Error('test');
var tryOk = sinon.stub().returns(returnVal),
    tryThrow = sinon.stub().throws(error),
    catchSpy1 = sinon.spy(),
    catchSpy2 = sinon.spy(),
    catchSpy3 = sinon.spy(),
    finallySpy = sinon.spy();

function reset () {
    tryOk.reset();
    tryThrow.reset();
    catchSpy1.reset();
    catchSpy2.reset();
    catchSpy3.reset();
    finallySpy.reset();
}

test('calling a function using try', function (t) {
    reset();
    Try(tryOk, 'test', 1, 2);
    t.ok(tryOk.calledOnce, 'calls the function given');
    t.ok(tryOk.calledOn('test'), 'calls the function with the given context if any');
    t.ok(tryOk.calledWith(1, 2), 'calls the function with the given args if any');
    t.end();
});

test('catching errors', function (t) {
    reset();
    var catcher = Try(tryOk);
    var result = catcher.catch(catchSpy1);
    t.equal(result, catcher, 'returns chainable catcher');
    t.equal(catchSpy1.callCount, 0, 'does not call catch callback if no error is caught');
    t.throws(tryThrow, Error);

    Try(tryThrow)
        .catch(catchSpy1)
        .catch([TypeError, Error], catchSpy2)
        .catch(TypeError, catchSpy3)
        .catch([EvalError, RangeError], catchSpy3)
        .finally(finallySpy)
        .catch(catchSpy1)
        .finally(finallySpy);

    t.ok(catchSpy1.called && catchSpy1.calledWith(error), 'calls generic catch callback if any error is thrown');
    t.ok(catchSpy2.called && catchSpy2.calledWith(error), 'calls matching catch callback for given error type');
    t.equal(catchSpy3.callCount, 0, 'does not call catch callback if error thrown does not match the given type(s)');

    t.end();
});

test('finally blocks', function (t) {
    reset();
    Try(tryThrow)
        .catch(catchSpy1)
        .finally(finallySpy)
        .catch(catchSpy1)
        .finally(finallySpy);
    t.ok(finallySpy.called, 'always calls finally callback if given');
    t.ok(finallySpy.calledWith(null, error), 'calls finally with the return value and error if present');
    t.ok(catchSpy1.calledOnce && finallySpy.calledOnce, 'stops calling any callbacks chained after first finally');

    Try(tryOk)
        .finally(finallySpy);
    t.ok(finallySpy.secondCall.calledWith(returnVal, null), 'calls finally callback with return value if any');

    t.end();
});

test('retrieving values', function (t) {
    reset();
    t.ok(Try(tryOk).value, returnVal, 'can get function return value');
    t.ok(Try(tryThrow).error, error, 'can get thrown error if exists');
    t.end();
});
