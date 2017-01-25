import 'whatwg-fetch';
import httpProvider from './http-provider';

const VERBS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
};

export default class http {

	constructor(apiURI) {
		this.interpolationRegExp = /(\:[a-z])/i;
		this.provider = httpProvider;
		this.apiURI = apiURI;
		this.interpolations = {};

		this.createParams(apiURI);
	}

	/**
	 * Build params struct
	 */
	createParams(URI) {
		let lookup = new Map();

		// split querystring from body
		let parts = URI.split('/');
		let keys = [];
		parts.forEach((x, i) => {
			if (this.interpolationRegExp.test(x)) {
				let k = x.substr(1);
				lookup.set(k, i);
				keys.push(k);
			}
		});

		this.interpolations = {
			keys,
			parts,
			lookup
		};
	}

	/**
	 * Interpolate params
	 */
	interpolate(data) {
		let newParts = this.interpolations.parts.slice(0);

		this.interpolations.lookup.forEach((position, k) => {
			newParts[position] = data[k];
		});

		return newParts.join('/');
	}

	/**
	 * Remap data
	 */
	remap(data) {
		let dataKeys = Object.keys(data);
		let params = {};
		let payload = {};

		dataKeys.filter(x => this.interpolations.keys.includes(x)).forEach(x => params[x] = data[x]);
		dataKeys.filter(x => !this.interpolations.keys.includes(x)).forEach(x => payload[x] = data[x]);

		return { params, payload };
	}

	/**
	 * Call this only in test
	 */
	prepare(method, data) {
		// get params for interpolation and payload
		let {params, payload} = this.remap(data);

		// replace parts in the template
		let URI = this.interpolate(params);

		// get default fetch options form provider
		let options = Object.assign(this.provider.getOptions(), { method });

		// check if payload is not empty
		if (Object.keys(payload).length) {
			if (method === VERBS.GET) {
				// encode string here
				URI = `${URI}?${this.flattenPayload(payload)}`;
			} else {
				options.body = JSON.stringify(payload);
			}
		}

		return {URI, options};
	}

	/**
	 * Main method
	 */
	request(method, data) {
		// prepare request
		let {URI, options} = this.prepare(method, data);

		// use fetch lib to perform request
		return fetch(URI, options)
			.then((req) => {
					// status is an error
					if (req.status >= 400) {
						return Promise.reject(req);
					}

					return req;
				}
			);
	}

	// return flatten payload
	flattenPayload(data) {
		let dataKeys = Object.keys(data);
		let newPayload = [];

		dataKeys.forEach(key => {
			newPayload.push(`${key}=${encodeURIComponent(data[key])}`);
		});

		return newPayload.join('&');
	}

	/**
	 * turn JS objects into base64 strings
	 */
	serialiseData(data) {
		let newData = {};
		let dataKeys = Object.keys(data);

		dataKeys.forEach(key => {
			let val = data[key];
			newData[key] = typeof val === 'object'
				? btoa(JSON.stringify(val))
				: val;
		});

		return newData;
	}

	/**
	 * Aliases of request
	 */
	get(data) {
		return this.request(VERBS.GET, data);
	}

	post(data) {
		return this.request(VERBS.POST, data);
	}

	patch(data) {
		return this.request(VERBS.PATCH, data);
	}

	put(data) {
		return this.request(VERBS.PUT, data);
	}

	delete(data) {
		return this.request(VERBS.DELETE, data);
	}
}
