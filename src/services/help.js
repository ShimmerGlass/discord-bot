var help = function() {
	this.synopses = [];
};

help.prototype.add = function(trigger, synopsis) {
	this.synopses.push({
		trigger: trigger,
		synopsis: synopsis
	});
};

help.prototype.get = function() {
	return this.synopses;
}

module.exports = new help();
