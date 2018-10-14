/**
 * Querying Class for this project
 * EXCLUSIVELY the ONLY class called for querying a database.
 *
 * Adopts the strategy pattern to use an implementation of a database,
 * instead of tightly coupling a database implementation to the project.
 *
 * NOTE: This project is a hobby one, and currently uses a local json file.
 * For expansiveness, maintain a contractual interface for future expansion or
 * migration to a MongoDB or SQL database
 *
 * @author Justice Appiah <jaxtis.apia@gmail.com>
 * @added 13-Oct-2018   ||  21:14 GMT
 */
class Database {
	
	/**
	 * @param {Interface} database - Database implementation to be connected
	 * @constructor
	 */
	constructor(database) {
		this.database = database;
		
		this.defaultPage = 1;
		this.defaultLimit = 1;
	}
	
	/**
	 * Allow dynamic setting of Database Implementation to a {Database} instance
	 *
	 * @param {Interface} database - Database implementation to be connected
	 */
	setDatabase(database) {
		this.database = database;
	}
	
	findPost(id) {
		return this.database.findPost(id)
	}
	
	findRecentPosts({ page = this.defaultPage, limit = this.defaultLimit }) {
		return this.database.findRecentPosts({ page, limit })
	}
	
	findRandomPosts({ page = this.defaultPage, limit = this.defaultLimit }) {
		return this.database.findRandomPosts({ page, limit })
	}
	
	getPostsCount() {
		return this.database.getPostsCount();
	}
	
}

export default Database;