const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://ionia:ionia@127.0.0.1:27017/ionia";

module.exports = function() {
  let mongo;
	return async function koaIoniaMongoDb(ctx, next) {
		if (!mongo) {
			try {
        mongo = await MongoClient.connect(MONGO_URL);
        console.log('ionia mongodb connection Success');
			} catch (err) {
				mongo = undefined;
				console.log('ionia mongodb connection fail');
			}
		}
		ctx['mongo'] = mongo;
		return next();
	};
};
