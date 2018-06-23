const Keygrip = require('keygrip');

/**
 * 默认的生成code方式
 * @param {number} len code的长度
 */
function defaultGetCode(len) {
  let v = '';
  for (let index = 0; index < len; index += 1) {
    v += `${Math.floor(Math.random() * 10)}`;
  }
  return v;
}
/**
 * 简单的验证码校验，可以生成带有效期的验证码，基于hash的生成规则，无状态处理
 */
class CodeIdentifier {
  constructor(opts) {
    this.options = Object.assign(
      {
        interval: 60 * 1000,
        max: 5,
        app: 'code-indentifier',
      },
      opts,
    );
    this.keys = [];
    this.refresh();
    this.keygrip = new Keygrip(this.keys);
  }
  /**
   * 刷新hash的key
   */
  refresh() {
    const {options, keys} = this;
    const {interval, max, app} = options;
    const start = Math.floor(Date.now() / interval);
    const gen = v => `${app}-${v}`;
    // 不需要刷新keys
    if (keys[0] === gen(start)) {
      return;
    }
    keys.length = 0;
    for (let i = 0; i < max; i += 1) {
      // 生成当前时间往后间隔的key
      // 用于避免不同实例之间的时间差
      keys.push(gen(start + i));
      // 生成当前时间往前间隔的key
      // 用于校验已生成的key的合法性
      if (i !== 0) {
        keys.push(gen(start - i));
      }
    }
  }
  /**
   * 生成验证码
   * @param {number} len 验证码长度
   * @param {string} prefix 生成hash时添加的prefix
   */
  genCode(len = 6, prefix = '') {
    const {keygrip} = this;
    let code = '';
    if (this.getCode) {
      code = this.getCode(len);
    } else {
      code = defaultGetCode(len);
    }
    this.refresh();
    const hash = keygrip.sign(`${prefix}${code}`);
    return {
      code,
      hash,
    };
  }
  /**
   * 校验验证码
   * @param {string} code 验证码
   * @param {string} hash hash串
   * @param {string} prefix 生成hash时添加的prefix
   */
  verify(code, hash, prefix = '') {
    const {keygrip} = this;
    this.refresh();
    return keygrip.verify(`${prefix}${code}`, hash);
  }
}

module.exports = CodeIdentifier;
