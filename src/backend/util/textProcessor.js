/**
 * String manipulator / converter.
 *
 * Container for all reusable methods that convert input String into other forms,
 * other than the original input.
 *
 * @author Justice Appiah <jaxtis.apia@gmail.com>
 * @added 12-Oct-2018   ||  22:14 GMT
 */
class TextProcessor {
	
	/**
	 * Convert a String into an array depending on a delimiter supplied
	 * Length of array produced = count of delimiter in input + 1
	 *
	 * @param {String} input - String to be converted into an array
	 * @param {String} delimiter - String used to determine input breakpoints
	 * @return {Array.<String>} Array of Strings resulting from spliced input parameter
	 *
	 * @example convertToArrayByDelimiter('Some Test Input') => ['Some Test Input']
	 * @example convertToArrayByDelimiter('Some | Test | Input', '|' ) => [Some, Test, Input]
	 */
	static convertToArrayByDelimiter(input, delimiter) {
		return input.split(delimiter);
	}
	
}

export default TextProcessor;