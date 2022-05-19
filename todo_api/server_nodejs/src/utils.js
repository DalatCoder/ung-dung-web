exports.responseHelper = function (responseObject, status, data, message, code) {
  const responseData = {
    status: status,
    data: data,
    msg: message
  }

  responseObject.statusCode = code
  responseObject.json(responseData)
}
