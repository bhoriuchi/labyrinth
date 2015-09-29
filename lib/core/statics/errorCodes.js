/**
 * Error Code Constants
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = {
	INVALID_STATE: {
		code: 'ER_INVALID_STATE',
		detail: 'The resource is not in the correct state for this action'
	},
	INVALID_KEY: {
		code: 'ER_INVALID_KEY',
		detail: 'The key was invalid or no key was supplied'		
	}
};