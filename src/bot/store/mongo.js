var MongoClient = require('mongodb').MongoClient;

var MongoStore = function(url) {
	this.mongoUrl = url;
};

MongoStore.prototype.connect = function(callback) {
	var that = this;
	MongoClient.connect(this.mongoUrl, function(err, db) {
		that.db = db;
		callback(err, db);
	});
};

MongoStore.prototype.isConnected = function() {
	return !!this.db;
};

MongoStore.prototype.get = function(user, callback) {
	var collection = this.db.collection('users');
	collection.findOne({
		id: user.id
	}, function(err, data) {
		if (err)
			return callback(err);

		if (!data)
			data = { id: user.id, username: user.username };

		callback(data);
	});
};

MongoStore.prototype.set = function(user, callback) {
	var collection = this.db.collection('users');
	collection.update(
		{ id: user.id },
		user,
		{ upsert: true },
		callback
	);
};

module.exports = MongoStore;