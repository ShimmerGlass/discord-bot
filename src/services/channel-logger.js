var Logger = function(bot, channel) {
	this.bot = bot;
	this.channel = channel;
};

Logger.prototype.log = function(msg) {
	this.bot.client.sendMessage(this.channel, '[' + new Date() + '] ' + msg);
};

Logger.prototype.onExec = function(trigger) {
	this.log('exec ' + trigger);
};

Logger.prototype.onRegister = function(trigger) {
	this.log('register ' + trigger);
};

module.exports = Logger;
