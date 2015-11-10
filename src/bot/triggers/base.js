var Trigger = function() {
	this.attrs = {};
};

Trigger.prototype.set = function(k, v) {
	this.attrs[k] = v;
};

Trigger.prototype.get = function(k) {
	return this.attrs[k];
};

Trigger.prototype.sink = function(sink) {
	this.set('sink', sink);
	return this;
};

Trigger.prototype.do = function(handler) {
	this.set('handler', handler);
	return this;
};

Trigger.prototype.describe = function(synopsis) {
	this.set('synopsis', synopsis);
	return this;
};

Trigger.prototype.execute = function(bot, args) {
	this.get('handler').call(bot, bot, this, args);
};

Trigger.prototype.setup = function(bot) {
	if (this.get('synopsis'))
		bot.getComponent('help').add(this.get('synopsis'));
};

Trigger.prototype.run = function(bot) {
	this.execute(bot, {});
};

module.exports = Trigger;
