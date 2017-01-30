import {http, httpProvider} from '../src/index';

/*global sinon,expect*/

describe('Http', () => {

	before(() => {});

	beforeEach(() => {});

	after(() => {});

	describe('request', () => {
		it('should interpolate', () => {
			let request = new http('/test/:id');
			let {URI, options} = request.prepare('GET', {
				id: 123,
				other: 1
			});
			expect(URI).to.equal('/test/123?other=1');
		});

		it('should use hostname', () => {
			httpProvider.setHostname('//localhost:3000');
			let request = new http('/test/:id');
			let {URI, options} = request.prepare('POST', {
				id: 123,
				other: 1
			});
			expect(URI).to.equal('//localhost:3000/test/123');
		});

	});
});
