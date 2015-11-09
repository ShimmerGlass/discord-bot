var help = function() {
	this.synopses = [];
};

help.prototype.add = function(synopsis) {
	this.synopses.push(synopsis);
};

module.exports = new help();
