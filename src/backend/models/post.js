import Schema from 'schm';

const PostSchema = new Schema(
	{
		id : { type : String, required : true },
		title : { type : String, required : true },
		content : [{
			type : { type : String, required : true },
			text : { type : String, default : '' },
			link : { type : String, default : '' }
		}],
		description : {
			short : { type : String, required : true },
			long : { type : String, required : true }
		},
		meta : {
			creationDate : { type : Date, default : () => new Date(), required : true },
			modificationDate : { type : Date, default : () => new Date(), required : true },
			isDisabled : { type : String, default : false }
		}
	}
);

export default PostSchema;