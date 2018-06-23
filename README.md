# code-identifier

A stateless, valid verification code verification tool based on `keygrip`.

## API

### consturctor

- `opts.interval` time interval
- `opts.max` the max key count
- `opts.app` the name of application, for different app to generate code

```js
const CodeIdentifier = require('code-identifier');
const identifier = new CodeIdentifier({
  interval: 51 * 1000,
  max: 10,
  app: 'my-test-app',
});
```

### genCode

generate the code

- `len` the length of code
- `prefix` the prefix to generate code, such as `track cookie`, `user account` and so on. [optional]

```js
// { code: '512567', hash: 'flplYRZqe145QQJOlObmW8uNNY8' }
const result1 = identifier.genCode();

// { code: '53684948', hash: 'xixBFHNqGw6YdkPRLrTFR4NkyVI' }
const result2 = identifier.genCode(8);

// { code: '414337', hash: 'mTwUjHLhx_IGJ5FYbRT-np3b2ho' }
const result3 = identifier.genCode(6, 'track cookie');
```

### verify

verify the code

- `code` 
- `hash` the hash of genCode
- `prefix` the same as genCode use

```js
// true
const valid1 = identifier.verify('512567', 'flplYRZqe145QQJOlObmW8uNNY8');

// true
const valid2 = identifier.verify('414337', 'mTwUjHLhx_IGJ5FYbRT-np3b2ho', 'track cookie');
```

### getCode

Use custom function for get code

```js
identifier.getCode = (len) => crypto.randomBytes(len).toString('hex');

// { code: 'df19f3', hash: 'IfR9zTryXWkA_k93zF2hb0D0YHk' }
const result = identifier.genCode(3);
```
