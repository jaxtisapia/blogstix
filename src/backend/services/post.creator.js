import { Post } from '../models';
import { PostContentService } from '../services';

/**
 * Hosts all creation actions on a { Post } schema / model
 *
 * @author Justice Appiah <jaxtis.apia@gmail.com>
 * @added 13-Oct-2018   ||  21:14 GMT
 */
class PostCreator {
	
	
	static async create(postDocument) {
		
		return new Promise((resolve, reject) => {
			
			// Check if description exists for a post, if not, assign a {} to it.
			// Needful for schema parsing, otherwise will fail to inflate the schema
			// It's a bug with 'schm' package, and has to be fixed
			const descriptionDoesNotExistForPost = ! postDocument.description;
			if ( descriptionDoesNotExistForPost ) postDocument.description = {};
			
			// 'meta' is a generated data, and not passed in by the caller of this method
			// Therefore, initialise the 'meta' with {}, lest it fails to inflate.
			// As indicated in the block above in comments, It's a bug with 'schm' package
			postDocument.meta = {};
			
			// Populate and inflate the post's contents using an external service,
			// and assign it to 'post.content'
			postDocument.content = PostContentService.createMany(postDocument.content);
			
			
			Post.validate(postDocument)
			    .then((parsedDocument) => resolve(parsedDocument))
			    .catch((errors) => reject(errors)
			    )
			
		});
	};
	
}

export default PostCreator;