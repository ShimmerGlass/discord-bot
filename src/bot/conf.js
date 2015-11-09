var conf = function(bot) {
	this.client = bot.client;
	this.bot = bot;
	this.attrs = {};
};

conf.prototype.set = function(k, v) {
	this.attrs[k] = v;
};

conf.prototype.get = function(k) {
	return this.attrs[k];
}

conf.prototype.sink = function(sink) {
	this.set('sink', sink);
	return this;
};

conf.prototype.do = function(handler) {
	this.set('handler', handler);
	return this;
};

conf.prototype.forEachUserOf = function(server) {
	if (typeof server == 'string')
		server = this.client.getServer('id', server);

	this.set('forEachUserOf', server);
	return this;
};

conf.prototype.withStore = function() {
	this.set('withStore', true);
	return this;
};

conf.prototype.describe = function(synopsis) {
	this.bot.addCommandSynopsis(synopsis);
	return this;
};

module.exports = conf;