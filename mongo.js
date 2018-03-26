const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://ionia:ionia@127.0.0.1:27017/ionia";

module.exports = function() {
  let mongo;
	return async function(ctx, next) {
		if (!mongo) {
			try {
				const temp = await MongoClient.connect(MONGO_URL);
				mongo = temp.db('ionia')
        console.log('ionia mongodb connection Success');
			} catch (err) {
				mongo = undefined;
				console.log('ionia mongodb connection fail');
			}
		}
		global.mongo = mongo;
		ctx['mongo'] = mongo;
		return next();
	};
};
