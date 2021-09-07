module.exports = function InvalidTokenException() {
  this.message = 'account_activation_failure';
  this.status = 400;
};

// const InvalidTokenException = function () {
//     this.message = 'account_activation_failure';
// }

// module.exports.InvalidTokenException = InvalidTokenException;