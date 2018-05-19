const CodeIdentifier = require('.');
const MockDate = require('mockdate');

describe('code identifier', () => {
  test('refresh key', () => {
    const identifier = new CodeIdentifier();
    const {app, interval} = identifier.options;
    const genKeys = () => {
      const start = Math.floor(Date.now() / interval);
      return [
        `${app}-${start}`,
        `${app}-${start + 1}`,
        `${app}-${start - 1}`,
        `${app}-${start + 2}`,
        `${app}-${start - 2}`,
        `${app}-${start + 3}`,
        `${app}-${start - 3}`,
        `${app}-${start + 4}`,
        `${app}-${start - 4}`,
      ];
    };
    expect(identifier.keys.join()).toBe(genKeys().join());
  });

  test('gen code', () => {
    const identifier = new CodeIdentifier();
    const {code, hash} = identifier.genCode();
    expect(code.length).toBe(6);
    expect(hash.length).toBe(27);
  });

  test('custom get code', () => {
    const identifier = new CodeIdentifier();
    const customCode = 'abcdef';
    identifier.getCode = () => customCode;
    const {code, hash} = identifier.genCode();
    expect(code).toBe(customCode);
    expect(hash.length).toBe(27);
  });

  test('set prefix to get code', () => {
    MockDate.set('1/1/2000');
    const identifier = new CodeIdentifier();
    const customCode = 'abcdef';
    identifier.getCode = () => customCode;
    const {code} = identifier.genCode();
    expect(code).toBe(customCode);
    const result = identifier.genCode();
    expect(code).toBe(result.code);

    const result1 = identifier.genCode(6, '1');
    const result2 = identifier.genCode(6, '2');
    expect(result1.code).toBe(result2.code);
    expect(result1.hash).not.toBe(result2.hash);
    MockDate.reset();
  });

  test('verify code', () => {
    const identifier = new CodeIdentifier();
    const {code, hash} = identifier.genCode();
    expect(identifier.verify(code, hash)).toBeTruthy();
    // 5分钟后，验证码失效
    MockDate.set(new Date(Date.now() + 6 * 60 * 1000));
    expect(identifier.verify(code, hash)).toBeFalsy();
    MockDate.reset();
  });

  test('verify code with prefix', () => {
    const prefix = 'abcd';
    const identifier = new CodeIdentifier();
    const {code, hash} = identifier.genCode(6, prefix);
    expect(identifier.verify(code, hash, prefix)).toBeTruthy();
  });
});
