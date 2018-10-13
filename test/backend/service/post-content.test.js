const { expect } = require('chai');
const { describe } = require('mocha');

const { PostContentService } = require('../../../src/backend/services');

describe('PostContentService', function() {
	
	describe('#create([....])', function() {
		
		describe('image type', function() {
			
			it('should NOT create a -image- postContent with no url', () => {
				
				const rawDescription = 'image||Some Description here';
				const postContent = PostContentService.create(rawDescription);
				
				const { link, type, text } = postContent;
				expect(link).to.be.null;
				expect(text).to.be.null;
				expect(type).to.be.null;
			});
			
			it('should create a -image- postContent with url, even without description', () => {
				
				const rawInputWithNoDescription = 'image||https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
				const postContentWithNoDescription = PostContentService.create(rawInputWithNoDescription);
				
				const { link, type, text } = postContentWithNoDescription;
				
				expect(text).to.be.null;
				expect(type).to.equal('image');
				expect(link).to.equal('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');
				
				const rawInputWithDescription = 'image||https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png||Some Description';
				const postContentWithDescription = PostContentService.create(rawInputWithDescription);
				
				const {
					link : descriptiveContentLink,
					type : descriptiveContentType,
					text : descriptiveContentText
				} = postContentWithDescription;
				
				expect(descriptiveContentText).to.equal('Some Description');
				expect(descriptiveContentType).to.equal('image');
				expect(descriptiveContentLink).to.equal('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');
			});
			
		});
		
		describe('link type', function() {
			
			it('should NOT create a -link- postContent with no url, no description', () => {
				
				const rawDescription = 'link';
				const postContent = PostContentService.create(rawDescription);
				
				const { link, type, text } = postContent;
				expect(link).to.be.null;
				expect(text).to.be.null;
				expect(type).to.be.null;
				
			});
			
			it('should NOT create a -link- postContent with description, no url', () => {
				
				const rawDescription = 'link||Some Description here';
				const postContent = PostContentService.create(rawDescription);
				
				const { link, type, text } = postContent;
				expect(link).to.be.null;
				expect(text).to.be.null;
				expect(type).to.be.null;
				
			});
			
			it('should NOT create a -link- postContent with url, no description', () => {
				
				const rawDescription = 'link||https://www.google.com.gh/search?q=linkedin';
				const postContent = PostContentService.create(rawDescription);
				
				const { link, type, text } = postContent;
				expect(link).to.be.null;
				expect(text).to.be.null;
				expect(type).to.be.null;
				
			});
			
			it('should create a -link- postContent with url and description, even with inconsistent arrangement', () => {
				
				const firstRawDescription = 'link||https://www.google.com.gh/search?q=linkedin||Some Description';
				const firstPostContent = PostContentService.create(firstRawDescription);
				
				const { link, type, text } = firstPostContent;
				
				expect(link).to.equal('https://www.google.com.gh/search?q=linkedin');
				expect(text).to.equal('Some Description');
				expect(type).to.equal('link');
				
				const secondRawDescription = 'link||Some Description||https://www.google.com.gh/search?q=linkedin';
				const secondPostContent = PostContentService.create(secondRawDescription);
				
				const { link : secondLink, type : secondType, text : secondText } = secondPostContent;
				expect(secondLink).to.equal('https://www.google.com.gh/search?q=linkedin');
				expect(secondText).to.equal('Some Description');
				expect(secondType).to.equal('link');
				
			});
			
			
		});
		
		describe('text type', function() {
			
			it('should NOT create a simple -text- postContent with no description', () => {
				
				const rawDescription = 'text';
				const postContent = PostContentService.create(rawDescription);
				
				console.log(postContent);
				
				const { link, type, text } = postContent;
				expect(link).to.be.null;
				expect(text).to.be.null;
				expect(type).to.be.null;
			});
			
			it('should create a simple -text- postContent with valid description', () => {
				
				const rawDescription = 'text||Some description here';
				const postContent = PostContentService.create(rawDescription);
				
				const { link, type, text } = postContent;
				expect(link).to.be.null;
				expect(text).to.equal('Some description here');
				expect(type).to.equal('text');
			});
			
		});
		
	});
	
});