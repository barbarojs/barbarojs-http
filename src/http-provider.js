import 'whatwg-fetch';

class httpProvider {

	constructor() {
		this.middlewares = [];

		this.options = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: null
			}
		};
	}

	/**
	 * Fetch options
	 */
	getOptions() {
		return Object.assign({}, this.options);
	}

	setOptions(options) {
		Object.assign(this.options, options);
	}

	/**
	 * Add new middleware
	 */
	use(middleware) {
		this.middlewares.push(middleware);
	}

	/**
	 * Concat middlewares to the main promise
	 */
	concatMiddlewares(fetchPromise) {
		var promise = fetchPromise;

		this.middlewares.forEach(
			middleware => {
				promise = promise.then(
					req => middleware(req) // return Promise.resolve/reject
				);
			}
		);

		return promise;
	}

	/**
	 * JWT utils
	 */
	setJwtToken(token) {
		this.options.headers.Authorization = `Bearer ${token}`;
	}

	removeJwtToken() {
		this.options.headers.Authorization = null;
	}

}

export default new httpProvider();