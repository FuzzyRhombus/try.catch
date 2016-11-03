'use strict';

function matchInstances (obj, type) {
    if (!Array.isArray(type)) return obj instanceof type;
    for (var i=0;i<type.length;++i) if (obj instanceof type[i]) return true;
    return false;
}

function TryCatcher (context) {
    this.error = null;
    this.value = null;
    this.context = context || null;
    this.done = false;
}

TryCatcher.prototype = {
    constructor: TryCatcher,
    catch: function (type, fn) {
        fn = fn || type;
        if (!this.done && this.error && (type === fn || matchInstances(this.error, type))) fn.call(this.context, this.error);
        return this;
    },
    finally: function (fn) {
        if (!this.done) fn.call(this.context);
        this.done = true;
        return this;
    }
};

module.exports = function Try (fn, context) {
    var catcher = new TryCatcher(context);
    try {
        catcher.value = fn && fn.apply(catcher.context, Array.prototype.slice.call(arguments, 2));
    }
    catch (error) {
        catcher.error = error;
    }
    return catcher;
};
