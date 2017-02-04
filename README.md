# barbarojs-http
Wrapper of github fetch lib: https://github.com/github/fetch
It uses native Promise to chain Middlewares

# Installation

npm install barbarojs-http

# Usage

```javascript
import {http} from 'barbarojs-http';
```

## How To

Lib interpolates variables as described here below
Supported verbs are: GET, POST, PUT, PATCH, DELETE


```javascript
// define params to be interpolated
let conn = new http('/test/:id');

// send request
conn.get({id: 123, q: 1}).then(x => console.log(x)); // /test/123?q=1

// post
conn.post({id: 123, q: 1, name: 'me'}).then(x => console.log(x)); // /test/123 -> body {q:1, name: 'me'}
```

## Special Features

Set developemnt server

```javascript
import {httpProvider} from 'barbarojs-http';
httpProvider.setHostname('http://localhost:3000');
```

### Set JWT Token

```javascript
import {httpProvider} from 'barbarojs-http';
...
...
// set
httpProvider.setJwtToken(tokenHere);
// remove 
httpProvider.removeJwtToken();
```

### Middlewares

```javascript
import {httpProvider} from 'barbarojs-http';
...
...
// set middleware, always return a promise in order to chain other middlewares 
// or your promise
httpProvider.use((req) => {
	if (req.status === 403) {
		// redirect to home
		return Promise.reject(req);
	} else if (req.status >= 400) {
		return Promise.reject(req);
	} else {
		return Promise.resolve(req);
	}
});

// myClass.js
...
...
let conn = new http('/test/:id');
conn.get({id: 345})
.then( // this will happen after middlewares
    x => console.log(x), // all good here
    err => console.log(err) // rejection can come from middleware
);
...
...
```

### Options

```javascript
import {httpProvider} from 'barbarojs-http';
...
...
// set custom options
httpProvider.setOptions({
    headers:{
        'x-Auth....': 'mytoken'
        }
    }
);

```