var help = function() {
	this.synopses = [];
};

help.prototype.add = function(synopsis) {
	this.synopses.push(synopsis);
};

help.prototype.get = function() {
	return this.synopses;
}

module.exports = new help();
