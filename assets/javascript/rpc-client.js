const util = require("util");
const request = require("request");

module.exports = class RpcClient {

  constructor({
    url,
    jsonrpc = "2.0",
    debug = false,
    logFn = console.log,
  }) {
    if (!RpcClient.isValidUrl(url))
      throw Error(`invalid parameter: url=${url}`);
    this.url = url;
    this.jsonrpc = jsonrpc;
    this.debug = debug;
    this.logFn = logFn;
  }


  call({ method, params, id }, cb) {
    const self = this;
    const p = self._createRequestParam(method, params, id);
    request(p, (err, response, body) => {
      err = (body && body.error) ? body.error : err;
      return cb && cb(err, body);
    });
  }

  /**
   * Creates request parameter
   */
  _createRequestParam(method, params, id) {
    // making form data for example like this:  '{"jsonrpc": "1.0", "id":"curltest", "method": "sendtoaddress", "params": [] }'
    const data = {
      jsonrpc: this.jsonrpc,
      id,
      method,
      params,
    };
    
    const p = {
      url: this.url,
      form: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json, text/javascript",
      },
      method: "POST", // JSONRPC server handles only POST requests
      encoding: "UTF-8",
      json: true,
    };
    return p;
  }

  static isValidUrl(v) {
    return /^https?:\/\/.+$/.test(v);
  }

};