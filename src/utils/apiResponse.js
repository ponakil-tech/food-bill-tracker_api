function success(res, { data = null, message = 'Success', code = 200 } = {}) {
  return res.status(code).json({
    status: 'SUCCESS',
    successMessage: message,
    errorMessage: null,
    response: data,
  });
}

function error(res, { message = 'Something went wrong', code = 500 } = {}) {
  return res.status(code).json({
    status: 'ERROR',
    successMessage: null,
    errorMessage: message,
    response: null,
  });
}

module.exports = { success, error };
