/**
 * Logger methods for controlling console logs in build version.
 */

export function error(...args) {
  console.error.apply(console, arguments)
}

export function warn(...args) {
  console.warn.apply(console, arguments)
}
