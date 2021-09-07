module.exports = function ValidationException(errors) {
    this.status = 400;
    this.error = errors;
    this.message = 'validation_failure'
}