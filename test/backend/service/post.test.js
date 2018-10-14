const { expect } = require('chai');
const { describe } = require('mocha');

const { PostCreator, PostQuery, DatabaseService } = require('../../../src/backend/services');
const { Database, LowDBConnector } = DatabaseService;

describe('PostCreator', function() {
	
	describe('#create({...})', function() {
		
		let postDocument;
		
		beforeEach(function() {
			
			// Define universal input-documents to be used in the create() scope
			postDocument = {
				id : 'some-id', title : 'Some title',
				description : { short : 'Some Short Title', long : 'Some Long Title' },
				content : [
					'text||Some text here',
					'link||Some description of the text||https://mail.google.com/mail/u/0/#inbox',
					'image||Alternative Text to image||https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				]
			};
		});
		
		describe('a valid Post when', function() {
			
			it('has at least {id} {title} {description.short} {description.long} {content} supplied', function(done) {
				
				// Strategy
				// ******************************************************
				// 1. Supply valid input-document to function
				// 2. Compare returned 'posts' to imput document used to create the post
				// 3. Expected these auto-created values to exist:
				//			- creation date
				//			- modified date
				
				PostCreator.create(postDocument)
				           .then((post) => {
					
					           //'Post created successful. We actually want success this time around
					           const { id, title, description : { short, long }, meta : { creationDate, modificationDate } } = post;
					
					           expect(id).to.equal(postDocument.id);
					           expect(title).to.equal(postDocument.title);
					           expect(short).to.equal(postDocument.description.short);
					           expect(long).to.equal(postDocument.description.long);
					
					           expect(creationDate).to.be.a('date');
					           expect(modificationDate).to.be.a('date');
					
					           done();
				           }).catch((errors) => 'Yak. We dont need errors now');
				
			});
			
		});
		
		describe('should not create a Post when', function() {
			
			it('has NO {id} is supplied', function(done) {
				
				// Strategy
				// ******************************************************
				// 1. remove {id} of input-document
				// 2. supply input-document to function
				// 3. expect a throw in the catch block
				// 4. Check in the catch block whether error is actually related to an 'id' problem
				
				delete postDocument.id;
				
				PostCreator.create(postDocument)
				           .then(() => 'Post created successful. We do not want success')
				           .catch((errors) => {
					
					           const errorFound = errors.find(error => error.param === 'id');
					
					           (errorFound) ? done() : null;
				           });
			});
			
			it('has NO {title} is supplied', function(done) {
				
				// Strategy
				// ******************************************************
				// 1. remove {title} of input-document
				// 2. supply input-document to function
				// 3. expect a throw in the catch block
				// 4. Check in the catch block whether error is actually related to a 'title' problem
				
				delete postDocument.title;
				
				PostCreator.create(postDocument)
				           .then(() => 'Post created successful. We do not want success')
				           .catch((errors) => {
					
					           const errorFound = errors.find(error => error.param === 'title');
					
					           (errorFound) ? done() : null;
				           });
			});
			
			it('has NO {description.short} or NO {description.long} is supplied', function(done) {
				
				// Strategy
				// ******************************************************
				// 1. remove {description} of input-document
				// 2. supply input-document to function
				// 3. expect a throw in the catch block
				// 4.a. Check in the catch block whether error is actually related to a 'description' problem
				//  .b. In the catch block, filter off errors with params 'description.short' or 'description.long'
				//  .c. Check EXCLUSIVELY for scenarios when filtered-result === 2,
				//      that is 'description.short' and 'description.long'
				
				delete postDocument.description;
				
				PostCreator.create(postDocument)
				           .then(() => 'Post created successful. We do not want success')
				           .catch((errors) => {
					
					           const errorsFound = errors.filter(error => error.param === 'description.short' || error.param === 'description.long');
					
					           (errorsFound.length === 2) ? done() : null;
				           });
			});
			
			it('has NO {content} of type array[PostContent] is supplied', function(done) {
				
				// Strategy: remove {content} of input-document, and supply to function
				
				delete postDocument.content;
				
				PostCreator.create(postDocument)
				           .then(() => 'Post created successful. We do not want success')
				           .catch(() => done());
			});
			
		});
		
	});
	
});

describe('PostQuery', function() {
	
	const lowDBConnector = new LowDBConnector({ uri : 'src/backend/database/db.test.json' });
	const database = new Database(lowDBConnector);
	
	const postQuery = new PostQuery(database);
	
	describe('#findOne(id)', function() {
		
		const invalidPostId = 'some-invalid-post-id';
		const validPostId = 'open-letter-to-microsoft';
		
		it('should return null when no/invalid post.id supplied', function() {
			
			// Strategy: Get post by an invalid ID, expect the result to be null
			const invalidPost = postQuery.findOne(invalidPostId);
			expect(invalidPost).to.not.exist;
			
			// Strategy: Get post by no argument supplied, expect the result to be null
			const nullPost = postQuery.findOne();
			expect(nullPost).to.not.exist;
		});
		
		it('should return a {Post} object when valid post.id supplied', function() {
			
			// Strategy
			// **************************************************
			// 1. Find a post by a valid post ID
			// 2. Compare the properties of the result 'post'
			
			const post = postQuery.findOne(validPostId);
			const { id, title, description : { short, long }, meta : { creationDate, modificationDate } } = post;
			
			expect(id).to.be.a('string');
			expect(title).to.be.a('string');
			expect(short).to.be.a('string');
			expect(long).to.be.a('string');
			expect(creationDate).to.be.a('string');
			expect(modificationDate).to.be.a('string');
		});
		
	});
	
	describe('#findRecent({ page, limit })', function() {
		
		const pageNumber = 1;
		const pageLimit = 4;
		
		it('should return a {List} of {Post} with ascending date', function() {
			
			// Strategy: call method with no arguments supplied, and expect it to return valid result
			// In such a case, it works with even wrong arguments supplied
			const postsWithNoParameters = postQuery.findRecent();
			expect(postsWithNoParameters).to.be.an('array');
			
			// Strategy: call method with valid arguments supplied, and expect it to return valid result
			const postsWithParameters = postQuery.findRecent({ page : pageNumber, limit : pageLimit });
			expect(postsWithParameters).to.be.an('array');
			expect(postsWithParameters).to.have.lengthOf(pageLimit);
			
			const sortedPostsWithParameters = postsWithParameters
				.sort((postA, postB) => new Date(postA.meta.creationDate) - new Date(postB.meta.creationDate));
			
			expect(postsWithParameters).to.include.ordered.members(sortedPostsWithParameters);
		});
		
	});
	
	describe('#findRandom({ page, limit })', function() {
		
		const pageNumber = 1;
		const pageLimit = 3;
		
		it('should return a {List} of {Post} with non-constant arrangement', function() {
			
			// Strategy Overall: Get different calls to the methods and compare the arrangements
			// WARNING: Might fail on some conditions, because of its randomness.
			// WARNING: The lesser the returned list gets, the more likely the test will fail!
			
			const firstPosts = postQuery.findRandom();
			expect(firstPosts).to.be.an('array');
			
			const secondPosts = postQuery.findRandom();
			expect(secondPosts).to.be.an('array');
			
			// Compare results of first and second experiments
			// Expected to produce results such as:
			// first-post -> [ postA, postC, postD ]
			// second-post -> [ postC, postA, postD ]
			//
			// This test should test first-post != second-post even though the elements are the same
			expect(firstPosts).to.not.deep.equal(secondPosts);
			
			const thirdPosts = postQuery.findRandom({ page : pageNumber, limit : pageLimit });
			expect(thirdPosts).to.be.an('array');
			expect(thirdPosts).to.have.lengthOf(pageLimit);
			
			const fourthPosts = postQuery.findRandom({ page : pageNumber, limit : pageLimit });
			expect(fourthPosts).to.be.an('array');
			expect(fourthPosts).to.have.lengthOf(pageLimit);
			
			// Same as first tests, comparing first-post and second-post
			// Difference is, method is called with valid arguments supplied
			//
			// This test should test third-post != fourth-post even though the elements are the same
			expect(thirdPosts).to.not.deep.equal(fourthPosts);
		});
		
	})
	
});