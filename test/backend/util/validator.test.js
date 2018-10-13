const { expect } = require('chai');
const { describe } = require('mocha');

const { Validator } = require('../../../src/backend/util');


describe('Validator', function() {
	
	describe('#isValidUrl( url )', function() {
		
		it('should NOT validate url when no http or https is added to input', () => {
			
			expect(Validator.isValidUrl('www.google.com')).to.be.false;
			expect(Validator.isValidUrl('://www.google.com')).to.be.false;
			expect(Validator.isValidUrl('www.google.com/even-with-sublink')).to.be.false;
			
		});
		
		it('should NOT validate url when ftp or any other than (http|https) is prefixed to input', () => {
			
			expect(Validator.isValidUrl('ftp://www.google.com')).to.be.false;
			expect(Validator.isValidUrl('smtp://www.google.com')).to.be.false;
			expect(Validator.isValidUrl('httpx://www.google.com/even-with-sublink')).to.be.false;
			
		});
		
		it('should NOT validate url when spaces in the input url', () => {
			
			expect(Validator.isValidUrl('http:// www. google.com ')).to.be.false;
			expect(Validator.isValidUrl('https:// www.google.com ')).to.be.false;
			
		});
		
		it('should validate url with valid urls ', () => {
			
			expect(Validator.isValidUrl('http://www.google.com')).to.be.true;
			expect(Validator.isValidUrl('http://www.google.com')).to.be.true;
			expect(Validator.isValidUrl('https://www.chaijs.com/api/bdd/#method_false')).to.be.true;
			expect(Validator.isValidUrl('https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php')).to.be.true;
			
		});
		
	});
	
});