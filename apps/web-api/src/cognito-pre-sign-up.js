exports.main = async (event, context, callback) => {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  callback(null, event);
};
