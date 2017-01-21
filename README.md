# barbarojs-http
Wrapper of github fetch lib: https://github.com/github/fetch

# Installation

npm install barbarojs-http

# Usage

```javascript
import {http} from 'barbarojs-http';
```

## In your method

```javascript
// define params to be interpolated
let conn = new http('/test/:id');

// send request
conn.get({id: 123, q: 1}).then(x => console.log(x)); // /test/123?q=1

// post
conn.get({id: 123, q: 1, name: 'me'}).then(x => console.log(x)); // /test/123 -> body {q:1, name: 'me'}
```

