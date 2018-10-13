/**
 * Validate inputs.
 *
 * Hosts all methods that return Booleans,
 * and checks inputs against a standard to determine such Boolean condition
 *
 * @author Justice Appiah <jaxtis.apia@gmail.com>
 * @added 13-Oct-2018   ||  12:10 GMT
 */
class Validator {
	
	/**
	 * Determine an input String is a url or not
	 *
	 * DOES NOT consider:
	 * - Spaces in the input. For atomicity of this function, just check the validity.
	 * If possible, strip spaces in separate function before passing the processed value to this method
	 *
	 * @param {String} url - String to be tested for url-ness
	 * @return {Boolean} true when url argument is a url, false when not a url
	 *
	 * @example isValidUrl('https://www.quora.com/Have-you-ever-seen-a-10x-software-developer-get-fired') => true
	 * @example isValidUrl('https:// www. quora. com/') => false // because of the spaces in the input url
	 * @example isValidUrl('https my link') => false // because you know this is not a link
	 */
	static isValidUrl(url) {
		const urlRegexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return urlRegexp.test(url)
	}
	
}

export default Validator;