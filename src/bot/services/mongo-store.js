var MongoClient = require('mongodb').MongoClient;

var MongoStore = function(url) {
	this.mongoUrl = url;
};

MongoStore.prototype.connect = function(callback) {
	var that = this;
	MongoClient.connect(this.mongoUrl, function(err, db) {
		that.db = db;

		if (err)
			throw err;

		if (callback)
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
			data = { id: user.id };

		callback(data);
	});
};

MongoStore.prototype.set = function(user, data, callback) {
	var collection = this.db.collection('users');
	collection.update(
		{ id: user.id },
		data,
		{ upsert: true },
		callback
	);
};

MongoStore.prototype.getAndUpdate = function(user, callback) {
	var that = this;

	this.get(user, function(data) {
		callback(data, function(newData) {
			newData = newData || data;

			that.set(user, newData);
		});
	});
};

module.exports = function(url) {
	var s = new MongoStore(url);
	s.connect();
	return s;
};
