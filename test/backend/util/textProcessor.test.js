const { expect } = require('chai');
const { describe } = require('mocha');

const { TextProcessor } = require('../../../src/backend/util');

describe('TextProcessor', function() {
	
	describe('#convertToArrayByDelimiter(input, delimiter)', function() {
		
		it('should return an array of length 1 when no delimiter supplied', () => {
			
			const input = 'Some input here * Some input here as well';
			const slicedTexts = TextProcessor.convertToArrayByDelimiter(input);
			
			expect(slicedTexts).to.have.length(1);
			expect(slicedTexts).to.include(input);
		});
		
		it('should return an array when a valid delimiter supplied', () => {
			
			const input = 'Some first || input here * Some second input here || Some third input here ';
			const delimiter = '*';
			let slicedTexts = TextProcessor.convertToArrayByDelimiter(input, delimiter);
			
			expect(slicedTexts).to.have.length(2);
			
			const secondDelimiter = '||';
			slicedTexts = TextProcessor.convertToArrayByDelimiter(input, secondDelimiter);
			
			expect(slicedTexts).to.have.length(3);
			
		});
		
		
	})
	
});
