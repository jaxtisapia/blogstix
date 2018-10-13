import { Post, PostContent } from '../models'
import { TextProcessor, Validator } from '../util';

/**
 * Produce {PostContent} for a {Post} content
 * Primary caller is {PostService} which accesses this class and produces a {PostContent}
 *
 * @see PostService
 * @see Post
 * @see PostContent
 *
 * @author Justice Appiah <jaxtis.apia@gmail.com>
 * @added 12-Oct-2018   ||  22:14 GMT
 */
class PostContentService {
	
	/**
	 * Produce multiple {PostContent} from an array/list.
	 *
	 * Primarily loops through input documents through PostContentService.#create
	 *
	 * @see PostContentService.create
	 * @param {Array.<String>} documents - List of documents to produce {PostContent} from
	 * @return {Array.<PostContent>} List of PostContent
	 */
	static createMany(documents) {
		return documents.map(document => PostContentService.create(document))
	}
	
	/**
	 * Parse a string input and decomposes according to delimiter into a { PostContent }
	 * Standard delimiter used, and hardcoded is '||'
	 *
	 * @param {String} input
	 * @return {PostContent} Return decoded PostContent extracted from input argument
	 *
	 * @example create('text || post title') => {link: null, type: text, text: 'post title'}
	 * @example create('link||title||http://www.abc.com') => {link: 'http://www.abc.com', type: link, text: 'title'}
	 */
	static create(input) {
		
		const DELIMITER = '||';
		
		const processedArray = TextProcessor.convertToArrayByDelimiter(input, DELIMITER);
		
		const type = TextProcessor.stripWhitespace(processedArray[0]);
		
		if ( type === 'image' ) return PostContentService._processImage(processedArray);
		if ( type === 'link' ) return PostContentService._processLink(processedArray);
		if ( type === 'text' ) return PostContentService._processText(processedArray);
		else return PostContentService._generateDefaultPostContent();
	};
	
	/**
	 * Process a pre-processed array into an {PostContent} with type as 'image'
	 *
	 * ONLY produces value-containing { PostContent } when the following conditions are met:
	 * - Has an array element, with this text 'image'
	 * - Has an array element, with EXACTLY one link
	 * - Optionally another element with a non-link, thats used as PostContent.text
	 *
	 * OTHERWISE returns all object keys with values null.
	 *
	 * @param {Array.<String>} processedArray - Pre-processed array to be converted into {PostContent}
	 * @return {PostContent}
	 *
	 * @example _processImage(['image', 'http://www.abc.com', 'http://www.efg.com']);
	 * => {type: null, link: null, text: null} Since there are two links in the array
	 *
	 * @example processImage(['image', 'http://www.abc.com']);
	 * => {type: 'image', link: 'http://www.abc.com', text: null}
	 *
	 * @example processImage(['image', 'Intended Text', 'http://www.efg.com']);
	 * => {type: 'image', link: 'http://www.efg.com', text: 'Intended Text'}
	 *
	 * @private
	 */
	static _processImage(processedArray) {
		
		const [, potentialLink = null, potentialText = null] = processedArray;
		
		const isPotentialLinkValid = Validator.isValidUrl(potentialLink);
		const isPotentialTextLink = Validator.isValidUrl(potentialText);
		
		const multipleLinksDetected = isPotentialLinkValid && isPotentialTextLink;
		const noLinkDetected = ! isPotentialTextLink && ! isPotentialLinkValid;
		
		const postContent = PostContentService._generateDefaultPostContent();
		
		if ( multipleLinksDetected || noLinkDetected ) return postContent;
		
		postContent['type'] = 'image';
		postContent['text'] = (isPotentialLinkValid) ? potentialText : potentialLink;
		postContent['link'] = (isPotentialLinkValid) ? potentialLink : potentialText;
		
		return postContent;
	};
	
	/**
	 * Process a pre-processed array into an {PostContent} with type as 'link'
	 *
	 * ONLY produces value-containing { PostContent } when the following conditions are met:
	 * - Has an array element, with this text 'link'
	 * - Has an array element, with EXACTLY one link
	 * - Has an array element, with EXACTLY one non-link, used as description of the link
	 *
	 * OTHERWISE returns all object keys with values null.
	 *
	 * @param {Array.<String>} processedArray - Pre-processed array to be converted into {PostContent}
	 * @return {PostContent}
	 *
	 * @example _processLink(['link', 'http://www.abc.com', 'http://www.efg.com']);
	 * => {type: null, link: null, text: null} Since there are two links in the array
	 *
	 * @example _processLink(['link', 'http://www.abc.com']);
	 * => {type: null, link: null, text: null} //Since there is no non-link in the array
	 *
	 * @example _processLink(['link', 'Intended Text', 'http://www.efg.com']);
	 * => {type: 'link', link: 'http://www.efg.com', text: 'Intended Text'}
	 *
	 * @private
	 */
	static _processLink(processedArray) {
		const [, potentialLink = null, potentialText = null] = processedArray;
		
		const isPotentialLinkValid = Validator.isValidUrl(potentialLink);
		const isPotentialTextLink = Validator.isValidUrl(potentialText);
		
		const multipleLinksDetected = isPotentialLinkValid && isPotentialTextLink;
		const noLinkDetected = ! isPotentialTextLink && ! isPotentialLinkValid;
		
		const isAnyPotentialValueNull = ! potentialLink || ! potentialText;
		const noDescriptionDetected = ! noLinkDetected && isAnyPotentialValueNull;
		
		const postContent = PostContentService._generateDefaultPostContent();
		
		if ( multipleLinksDetected || noLinkDetected || noDescriptionDetected ) return postContent;
		
		postContent['type'] = 'link';
		postContent['text'] = (isPotentialLinkValid) ? potentialText : potentialLink;
		postContent['link'] = (isPotentialLinkValid) ? potentialLink : potentialText;
		
		return postContent;
	}
	
	/**
	 * Process a pre-processed array into an {PostContent} with type as 'text'
	 *
	 * ONLY produces value-containing { PostContent } when the following conditions are met:
	 * - Has an array element, with this text 'text'
	 * - Has another non-null array element
	 *
	 * OTHERWISE returns all object keys with values null.
	 *
	 * @param {Array.<String>} processedArray - Pre-processed array to be converted into {PostContent}
	 * @return {PostContent}
	 *
	 * @example _processLink(['text']);
	 * => {type: null, link: null, text: null} Since there is no other non-null string in the array
	 *
	 * @example _processLink(['text', 'Some text here']);
	 * => {type: 'text', link: null, text: 'Some text here'}
	 *
	 * @private
	 */
	static _processText(processedArray) {
		const [, text] = processedArray;
		
		const postContent = PostContentService._generateDefaultPostContent();
		
		if ( ! text ) return postContent;
		
		postContent['type'] = 'text';
		postContent['text'] = text;
		return postContent;
	}
	
	/**
	 * Default Chassis generator for all other { PostContent }
	 *
	 * Called by other sibling methods to get base object, which is individually morphed by various methods
	 *
	 * @see PostContentService#_processText
	 * @see PostContentService#_processImage
	 * @see PostContentService#_processLink
	 *
	 * @return {{link: null, text: null, type: null}}
	 * @private
	 */
	static _generateDefaultPostContent() {
		return { link : null, text : null, type : null }
	}
}

export default PostContentService;