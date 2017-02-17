/*
 * Decorators are currently not supported by Babel
 * since the standard might change drastically.
 * There are ways to get around it, but I'd rather not do that for now
 */

//Require auth be set when a function is called
function authlock (target, key, descriptor) {
  let fn = descriptor.value
  let newFn = function () {
    if (!this.auth) {
      throw new Error('Authentication not set')
    }

    fn.apply(target, arguments)
  }
  descriptor.value = newFn
  return descriptor
}

module.exports = {authlock}
