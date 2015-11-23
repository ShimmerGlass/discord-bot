var Logger = function(loggers) {
	this.loggers = loggers;
};

Logger.prototype._exec = function(fn) {
	var args = Array.prototype.slice.call(arguments, 1);
	this.loggers.forEach(function(l) {
		l[fn].apply(l, args);
	});
};

Logger.prototype.log = function(msg) {
	this._exec('log', msg);
};

Logger.prototype.onExec = function(trigger) {
	this._exec('onExec', trigger);
};

Logger.prototype.onRegister = function(trigger) {
	this._exec('onRegister', trigger);
};

module.exports = Logger;
