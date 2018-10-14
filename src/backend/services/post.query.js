/**
 * Hosts all query actions on a { Post } schema / model
 *
 * Does not maintain a strict contract with any specific Database or its implementation
 * You can therefore plug in database instance to it when initialising this class
 *
 * @author Justice Appiah <jaxtis.apia@gmail.com>
 * @added 13-Oct-2018   ||  21:14 GMT
 */
class PostQuery {
	
	/**
	 * @param database - Database instance to use for the Querying
	 */
	constructor(database) {
		this.database = database;
		
		this.defaultPage = 1;
		this.defaultLimit = 20;
	}
	
	getCount(id) {
		return this.database.getPostsCount();
	}
	
	findOne(id) {
		return this.database.findPost(id);
	}
	
	findRecent({ page = this.defaultPage, limit = this.defaultLimit } = {}) {
		return this.database.findRecentPosts({ page, limit });
	}
	
	findRandom({ page = this.defaultPage, limit = this.defaultLimit } = {}) {
		return this.database.findRandomPosts({ page, limit });
	}
	
}

export default PostQuery;