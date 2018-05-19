# code-identifier

基于`keygrip`生成无状态有、有效期的验证码校验工具。在使用的时候需要注意，此模块使用系统时间来生成hash keys，为了保证一定的时效性，设置interval与max参数时需要确保能符合预期的有效期设置。有效期为：系统当前时间前后(max - 1) * interval，对于开发者疑问为什么需要对有效期为未来时间的处理，由于在多实例中，无法保证各服务器的时间完全一致（当然现实中一般偏差很少），此模块的处理逻辑则调整为扩大符合时间范围的简单处理。


## API

### constructor

初始化实例，在实例中，会根据interval与max生成校验的key列表,数量为：`max * 2 - 1`，生成的规则如`[now - (max-4) * interval]..[now + (max-4) * interval]`

- `opts.interval` 设置生成key的时间间隔，根据系统当前时间与时间间隔生成`keygrip`中使用的`keys`，默认为：`60 * 1000`
- `opts.max` 用于指定生成key的数量，会在系统当前时间前后时间间隔生成，key的总量为`max * 2 - 1`，默认为：`5`
- `opts.app` 指定APP的，用于拼接生成key，默认为：`code-indentifier`

```js
const CodeIdentifier = require('code-identifier');
const identifier = new CodeIdentifier({
  interval: 51 * 1000,
  max: 10,
  app: 'my-test-app',
});
```

### getCode

生成验证码

- `len` 获取码长度，默认为：`6`
- `prefix` 用于生成hash的添加前缀，可以根据不同的调用指定不同（如客户账号、跟踪cookie等），保证相同时间内，相同的验证码对于不同的调用生成不同的hash（如果时效性较短，此参数可以为空）

```js
// { code: '512567', hash: 'flplYRZqe145QQJOlObmW8uNNY8' }
const result1 = identifier.genCode();

// { code: '53684948', hash: 'xixBFHNqGw6YdkPRLrTFR4NkyVI' }
const result2 = identifier.genCode(8);

// { code: '414337', hash: 'mTwUjHLhx_IGJ5FYbRT-np3b2ho' }
const result3 = identifier.genCode(6, 'track cookie');
```

### verify

校验验证码，验证码只生成时间前后时间隔内有效[createdAt - (max-4) * interval] - [createdAt + (max-4) * interval]

- `code` 验证码
- `hash` genCode中生成的hash值
- `prefix` 与genCode中使用同样的值

```js
// true
const valid1 = identifier.verify('512567', 'flplYRZqe145QQJOlObmW8uNNY8');

// true
const valid2 = identifier.verify('414337', 'mTwUjHLhx_IGJ5FYbRT-np3b2ho', 'track cookie');
```

### getCode

自定义getCode的实现，生成个性化的验证码（默认的都只是数字）

```js
identifier.getCode = (len) => crypto.randomBytes(len).toString('hex');

// { code: 'df19f3', hash: 'IfR9zTryXWkA_k93zF2hb0D0YHk' }
const result = identifier.genCode(3);
```