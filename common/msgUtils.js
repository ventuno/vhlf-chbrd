module.exports = function(methodsMap) {
  return {
    parseMsg(msg, ws) {
      if (methodsMap.hasOwnProperty(msg.method)) {
        methodsMap[msg.method](msg.params, ws);
      }
    },
    createMsg(method, params) {
      return {
        method: method,
        params: params,
      };
    },
  };
}
