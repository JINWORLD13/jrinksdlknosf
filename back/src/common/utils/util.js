function sanitizeObject(obj) {
  const result = Object.entries(obj).reduce((map, [key, value]) => {
    if (value !== undefined) {
      map[key] = value;
    }
    return map;
  }, {});
  return result;
}

function buildResponse(data, error, statusCode) {
  return {
    data, // data : 1번째 인자 data 내용이 들어감.
    errorName: error?.name ?? null,
    errorMessage: error?.message ?? null,
    statusCode: statusCode ?? error?.statusCode
  };
}

module.exports = {
  sanitizeObject,
  buildResponse,
};
