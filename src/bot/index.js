var Discord = require("discord.js");

var BotMaker = function(conf) {
	this.email     = conf.email;
	this.password  = conf.password;

	this.client = new Discord.Client();

	this.registeredTriggers = [];
	this.registeredServices =

	this.services = require('./services');
	this.tasks    = require('./tasks');
	this.triggers = require('./triggers');
	this.packages = require('./packages');
};


BotMaker.prototype.connect = function(cb) {
	this.client.login(this.email, this.password, function(err) {
		if (err)
			throw new Error(err.message + ' : ' + err.response.text);
	});

	this.client.on('ready', cb);
};

BotMaker.prototype.hasService = function(name) {
	return !!this.registeredServices[name];
};

BotMaker.prototype.addService = function(name, component) {
	if (this.hasService(name))
		throw new Error('A component already exists under this name.');

	this.registeredServices[name] = component;
};

BotMaker.prototype.getService = function(name) {
	return this.registeredServices[name];
};

BotMaker.prototype.use = function(h) {
	return h(this);
};

BotMaker.prototype.on = function(trigger) {
	var that = this;

	if (!(trigger instanceof this.triggers.now))
		trigger = new (Function.prototype.bind.apply(trigger, arguments));

	this.registeredTriggers.push(trigger);

	setTimeout(function() {
		trigger.setup(that);
		trigger.run(that);
	});

	return trigger;
};

module.exports = BotMaker;
