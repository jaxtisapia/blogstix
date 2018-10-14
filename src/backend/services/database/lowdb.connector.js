const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

/**
 * Database Implementation or Connector
 * This Service is not directly called by any calling class (even though it might work),
 * It is an implementation, or one of the strategies used by { Database }
 *
 * This Connector uses lowDB database; a database for local json files.
 * LowDB website - > https://github.com/typicode/lowdb
 *
 * Most of its query or modification methods are from lodash. Hence all chaining and queries
 * can be successfully done with lodash methods.
 * Lodash can be found -> https://lodash.com/
 *
 * @author Justice Appiah <jaxtis.apia@gmail.com>
 * @added 13-Oct-2018   ||  21:14 GMT
 */
class LowDBConnector {
	
	
	/**
	 *  @constructor
	 * @param {String} uri - File path of the local json database. Example 'src/db.json'
	 *                       Accesses this uri from the parent directory of the calling class.
	 *                       If path does not exist, creates one by default.
	 */
	constructor({ uri }) {
		
		// Initialises the adapter with 'FileSync' adapter.
		// Adapters can be customised or changed later depending on preference
		// see https://github.com/typicode/lowdb#adapters-api
		const adapter = new FileSync(uri);
		this.db = low(adapter);
		
		// Defines a default database structure if no structure has already been defined in the json file
		this.db.defaults({ posts : [] }).write()
	}
	
	findPost(id) {
		return this.db.get('posts')
		           .find({ id })
		           .value();
	}
	
	findRecentPosts({ page, limit }) {
		return this.db.get('posts')
		           .sortBy('meta.creationDate')
		           .take(limit)
		           .uniq()
		           .value();
	}
	
	getPostsCount() {
		return this.db.get('posts')
		           .size()
		           .value();
	}
	
	findRandomPosts({ page, limit }) {
		return this.db.get('posts')
		           .take(limit)
		           .shuffle()
		           .uniq()
		           .value();
	}
	
}

export default LowDBConnector;