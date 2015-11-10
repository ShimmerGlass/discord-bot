var Discord = require("discord.js");

var BotMaker = function(conf) {
	this.email     = conf.email;
	this.password  = conf.password;

	this.client = new Discord.Client();

	this.registeredTriggers = [];
	this.registeredComponents =

	this.components = require('./components');
	this.tasks      = require('./tasks');
	this.triggers   = require('./triggers');
	this.packages   = require('./packages');
};


BotMaker.prototype.connect = function(cb) {
	this.client.login(this.email, this.password, function(err) {
		if (err)
			throw new Error(err.message + ' : ' + err.response.text);
	});

	this.client.on('ready', cb);
};

BotMaker.prototype.hasComponent = function(name) {
	return !!this.registeredComponents[name];
};

BotMaker.prototype.addComponent = function(name, component) {
	if (this.hasComponent(name))
		throw new Error('A component already exists under this name.');

	this.registeredComponents[name] = component;
};

BotMaker.prototype.getComponent = function(name) {
	return this.registeredComponents[name];
};

BotMaker.prototype.use = function(h) {
	return h(this);
};

BotMaker.prototype.on = function(trigger) {
	var that = this;

	if (!(trigger instanceof this.triggers.base))
		trigger = new (Function.prototype.bind.apply(trigger, arguments));

	this.registeredTriggers.push(trigger);

	setTimeout(function() {
		trigger.setup(that);
		trigger.run(that);
	});

	return trigger;
};

module.exports = BotMaker;
