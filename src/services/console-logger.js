var Logger = function() {

};

Logger.prototype.log = function(msg) {
	console.log('[' + new Date() + '] ' + msg);
};

Logger.prototype.onExec = function(trigger) {
	this.log('exec ' + trigger);
};

Logger.prototype.onRegister = function(trigger) {
	this.log('register ' + trigger);
};

module.exports = new Logger();
