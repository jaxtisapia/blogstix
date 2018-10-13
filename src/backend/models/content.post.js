import SimpleSchema from 'schm';

const PostContent = SimpleSchema(
	{
		type : { type : String, default : 'text' },
		text : { type : String, default : '' },
		link : { type : String, default : '' }
	},
);

export default PostContent;