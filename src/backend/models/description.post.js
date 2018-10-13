import Schema from 'schm';

const PostDescription = new Schema({
	                                   short : { type : String, default : 'No Short Description supplied' },
	                                   long : { type : String, default : 'No long description supplied' }
                                   });

export default PostDescription;