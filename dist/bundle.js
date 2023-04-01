/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./src/AssetDirectoryParser.ts":
/*!*************************************!*\
  !*** ./src/AssetDirectoryParser.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetDirectoryParser = void 0;
const Console_1 = __webpack_require__(/*! ./Console */ "./src/Console.ts");
var AssetDirectoryParser;
(function (AssetDirectoryParser) {
    async function loadDirectories(xmlPath) {
        return new Promise((res, rej) => {
            const request = new XMLHttpRequest();
            let url;
            let assets = [];
            let attempts = 1;
            request.addEventListener("readystatechange", async () => {
                if (request.readyState == 4) {
                    if (request.status < 200 && request.status > 299) {
                        if (attempts == 5) {
                            Console_1.Console.error(`AssetDirectoryParser: Failed to load directory at '${xmlPath}'`);
                            return rej(request);
                        }
                        attempts++;
                        setTimeout(() => {
                            request.open("GET", url.href);
                            request.send();
                        }, 500);
                        return;
                    }
                    const xmlDoc = request.responseXML;
                    if (!xmlDoc) {
                        Console_1.Console.error(`AssetDirectoryParser: Could not parse XML at '${xmlPath}'`);
                        return rej("Invalid XML found at " + xmlPath);
                    }
                    for (const asset of xmlDoc.querySelectorAll("assets > asset")) {
                        const type = asset.getElementsByTagName("type")[0].textContent;
                        const name = asset.getElementsByTagName("name")[0].textContent;
                        try {
                            const assetPath = new URL(asset.getElementsByTagName("path")[0].textContent, url).href;
                            let dimEl = null;
                            switch (type) {
                                case "directory":
                                    assets.push(...await loadDirectories(assetPath));
                                    break;
                                case "image":
                                case "video":
                                    dimEl = asset.getElementsByTagName("dims")[0];
                                case "audio":
                                    const ulasset = {
                                        "name": name,
                                        "type": type == "image" ? "img" : type,
                                        "path": assetPath,
                                    };
                                    if (dimEl) {
                                        ulasset.dims = {
                                            "width": Number.parseInt(dimEl.getAttribute("width") || "500"),
                                            "height": Number.parseInt(dimEl.getAttribute("height") || "500")
                                        };
                                    }
                                    assets.push(ulasset);
                                    break;
                                default:
                                    Console_1.Console.error(`AssetDirectoryParser: ${xmlPath}: Unrecognized asset type "${type}"`);
                                    continue;
                            }
                        }
                        catch (e) {
                            rej(e);
                            continue;
                        }
                    }
                    res(assets);
                }
            });
            try {
                url = new URL(xmlPath);
            }
            catch {
                url = new URL(xmlPath, document.baseURI);
            }
            Console_1.Console.log(`AssetDirectoryParser: Loading directory '${url.href}'`);
            request.open("GET", url.href);
            request.send();
        });
    }
    AssetDirectoryParser.loadDirectories = loadDirectories;
})(AssetDirectoryParser = exports.AssetDirectoryParser || (exports.AssetDirectoryParser = {}));


/***/ }),

/***/ "./src/AssetManager.ts":
/*!*****************************!*\
  !*** ./src/AssetManager.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetManager = void 0;
const Console_1 = __webpack_require__(/*! ./Console */ "./src/Console.ts");
var AssetManager;
(function (AssetManager) {
    let assets = new Map();
    let fonts = new Map();
    async function loadFont(name, url, descriptors) {
        return new Promise(async (res, rej) => {
            if (!fonts.has(name)) {
                const font = new FontFace(name, `url(${url})`, descriptors);
                try {
                    await font.load();
                    Console_1.Console.log(`AssetManager: Loaded new font "${name}" from ${url}`);
                }
                catch (e) {
                    Console_1.Console.error(`AssetManager: Failed to load font "${name}"`);
                    return rej();
                }
                fonts.set(name, font);
            }
            else {
                Console_1.Console.log(`AssetManager: ${name}: Font already loaded, skipping`);
            }
            res();
        });
    }
    AssetManager.loadFont = loadFont;
    function getFont(key) {
        return fonts.get(key) || null;
    }
    AssetManager.getFont = getFont;
    async function save(type, key, url, dims = null, force = false) {
        return new Promise(async (res, rej) => {
            if (force || !(assets.has(key) && assets.get(key).nodeName.toLowerCase() == type)) {
                const el = document.createElement(type);
                let loaded = false;
                let attempts = 1;
                while (attempts != 5) {
                    try {
                        el.src = url;
                        if (dims) {
                            el.width = dims.width;
                            el.height = dims.height;
                        }
                        await new Promise((resolve, reject) => {
                            el.onload = el.onloadeddata = () => {
                                assets.set(key, el);
                                resolve();
                                loaded = true;
                                Console_1.Console.log(`AssetManager: Loaded ${type} "${key}" from ${url}`);
                            };
                            el.onerror = reject;
                        });
                        break;
                    }
                    catch {
                        Console_1.Console.warn(`AssetManager: ${key}: Attempting to load asset (Attempt ${attempts})...`);
                        attempts++;
                        await new Promise(res => setTimeout(res, 500));
                    }
                }
                if (!loaded) {
                    Console_1.Console.error(`AssetManager: ${key}: Could not load asset, asset timed out`);
                    rej();
                }
                else {
                    res();
                }
            }
            else {
                Console_1.Console.warn(`AssetManager: ${key}: Asset already saved, skipping`);
                res();
            }
        });
    }
    AssetManager.save = save;
    function load(key) {
        if (has(key)) {
            return assets.get(key) || null;
        }
        throw Console_1.Console.throwError(Error, `AssetManager: ${key}: Asset could not be found`);
    }
    AssetManager.load = load;
    function has(key) {
        return assets.has(key);
    }
    AssetManager.has = has;
})(AssetManager = exports.AssetManager || (exports.AssetManager = {}));


/***/ }),

/***/ "./src/AudioSystem.ts":
/*!****************************!*\
  !*** ./src/AudioSystem.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AudioSystem = void 0;
var AudioSystem;
(function (AudioSystem) {
    function play(audio, settings) {
        return new Promise(res => {
            const loop = settings.loop || false;
            const maxVolume = settings.volume || 1;
            const start = settings.start || 0;
            const duration = settings.end || (audio.duration * 1000);
            const fadeInDuration = (settings.fadeIn || 0);
            const fadeOutDuration = (settings.fadeOut || 0);
            // BUG playback rate does not go intoo calculations
            audio.playbackRate = settings.speed || 1;
            audio.preservesPitch = !!settings.preservePitch;
            let fadeInEndTime = 0, fadeOutStartTime = 0, audioEndTime = 0;
            const setupAudioSettings = () => {
                audio.currentTime = start;
                audio.volume = (fadeInDuration == 0) ? maxVolume : 0;
                fadeInEndTime = Date.now() + (settings.fadeIn || 0);
                fadeOutStartTime = Date.now() + duration - (settings.fadeOut || 0);
                audioEndTime = Date.now() + duration;
            };
            setupAudioSettings();
            audio.play();
            const tickingInterval = setInterval(() => {
                if (Date.now() <= audioEndTime) {
                    if (fadeInDuration != 0) {
                        if (Date.now() <= fadeInEndTime) {
                            const fadeInTimeRemaining = fadeInEndTime - Date.now();
                            const progress = 1 - (fadeInTimeRemaining / fadeInDuration);
                            audio.volume = maxVolume * progress;
                        }
                    }
                    if (fadeOutDuration != 0) {
                        if (Date.now() >= fadeOutStartTime) {
                            const fadeOutTimeRemaining = audioEndTime - Date.now();
                            const progress = fadeOutTimeRemaining / fadeOutDuration;
                            audio.volume = maxVolume * progress;
                        }
                    }
                }
                else {
                    if (!loop) {
                        clearInterval(tickingInterval);
                        audio.pause();
                        audio.currentTime = 0;
                        audio.volume = 1;
                        audio.playbackRate = 1;
                        audio.preservesPitch = false;
                        res();
                    }
                    else {
                        setupAudioSettings();
                        audio.play();
                    }
                }
            });
        });
    }
    AudioSystem.play = play;
})(AudioSystem = exports.AudioSystem || (exports.AudioSystem = {}));


/***/ }),

/***/ "./src/Console.ts":
/*!************************!*\
  !*** ./src/Console.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Console = void 0;
const ElementDefinitions_1 = __webpack_require__(/*! ./ElementDefinitions */ "./src/ElementDefinitions.ts");
const GameLoader_1 = __webpack_require__(/*! ./GameLoader */ "./src/GameLoader.ts");
const Util_1 = __webpack_require__(/*! ./lib/Util */ "./src/lib/Util.ts");
var Console;
(function (Console) {
    const element = ElementDefinitions_1.LOG_ENTRIES;
    const _template = `<div class="log-entry"><span class="log-time">{time}</span><span class="log-{type}">{msg}</span></div>`;
    Console.log = createLogGenerator("log");
    Console.warn = createLogGenerator("warn");
    Console.error = createLogGenerator("error");
    Console.throwError = (err, msg = "") => {
        if (err instanceof Error) {
            Console.error(err.message);
            return err;
        }
        else {
            try {
                const e = new err(msg);
                if (e.message) {
                    Console.error(e.message);
                }
                else {
                    Console.error(e.name);
                }
                return e;
            }
            catch {
                return new Error(String(err));
            }
        }
    };
    Console.clear = () => element.innerHTML = "";
    function _scrollToBottom() {
        element.scrollTop = element.scrollHeight;
    }
    Console._scrollToBottom = _scrollToBottom;
    function createLogGenerator(type) {
        return function (msg) {
            const safeMsg = String(msg).replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
            const timestamp = new Date().toLocaleTimeString("en-us", { "hour12": false });
            const html = _template.replace("{type}", type).replace("{msg}", safeMsg).replace("{time}", timestamp);
            element.innerHTML += html;
            if (element.children.length > 0) {
                const s = element.scrollHeight - element.scrollTop - element.clientHeight;
                if (s <= 40)
                    _scrollToBottom();
            }
        };
    }
    window._GameConsole = {
        "log": Console.log,
        "warn": Console.warn,
        "error": Console.error,
        "clear": Console.clear
    };
    function initialize() {
        const $DRAGGABLE = $("#log-draggable");
        const $LOG = $("#log");
        let location = new Util_1.Vector2(window.innerWidth / 2, window.innerHeight / 2);
        let offset = new Util_1.Force(0, 0);
        let dragging = false;
        $DRAGGABLE.on("mousedown", ev => {
            offset = location.toForce(new Util_1.Vector2(ev.clientX, ev.clientY));
            dragging = true;
        });
        $(window).on("keypress", ev => {
            (ev.key == "`" ? GameLoader_1.GameLoader.toggleDebugLog() : null);
            dragging = false;
            moveLogTo(location);
        });
        $(window).on("mouseup", () => dragging = false);
        $(window).on("mousemove", ev => {
            if (dragging) {
                const newloc = new Util_1.Vector2(ev.clientX, ev.clientY);
                newloc.addForce(offset);
                location = newloc;
                moveLogTo(location);
            }
        });
        function moveLogTo(location) {
            const w = $LOG[0].clientWidth;
            const h = $LOG[0].clientHeight;
            $LOG[0].style.left = `${location.x - w / 2}px`;
            $LOG[0].style.top = `${location.y - h / 2}px`;
        }
    }
    Console.initialize = initialize;
})(Console = exports.Console || (exports.Console = {}));


/***/ }),

/***/ "./src/ElementDefinitions.ts":
/*!***********************************!*\
  !*** ./src/ElementDefinitions.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LOG_ENTRIES = exports.LOG = exports.VIDEOS = exports.LOADER = exports.INPUTS = exports.HEADER = exports.MAIN = exports.$LOG_ENTRIES = exports.$LOG = exports.$VIDEOS = exports.$LOADER = exports.$INPUTS = exports.$HEADER = exports.$MAIN = void 0;
exports.$MAIN = $("main");
exports.$HEADER = $("header");
// export const $MENU = $("#menu");
exports.$INPUTS = $("#inputs");
exports.$LOADER = $("#loader");
exports.$VIDEOS = $("#videos");
exports.$LOG = $("#log");
exports.$LOG_ENTRIES = $("#log-entries");
exports.MAIN = exports.$MAIN[0];
exports.HEADER = exports.$HEADER[0];
// export const MENU = MENU[0];
exports.INPUTS = exports.$INPUTS[0];
exports.LOADER = exports.$LOADER[0];
exports.VIDEOS = exports.$VIDEOS[0];
exports.LOG = exports.$LOG[0];
exports.LOG_ENTRIES = exports.$LOG_ENTRIES[0];


/***/ }),

/***/ "./src/Game/Games/LoginMenu.ts":
/*!*************************************!*\
  !*** ./src/Game/Games/LoginMenu.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Console_1 = __webpack_require__(/*! ../../Console */ "./src/Console.ts");
const GameLoader_1 = __webpack_require__(/*! ../../GameLoader */ "./src/GameLoader.ts");
const BaseGame_1 = __importDefault(__webpack_require__(/*! ../../lib/BaseGame */ "./src/lib/BaseGame.ts"));
const Scheduler_1 = __webpack_require__(/*! ../../lib/Scheduler */ "./src/lib/Scheduler.ts");
const Util_1 = __webpack_require__(/*! ../../lib/Util */ "./src/lib/Util.ts");
const SaveManager_1 = __webpack_require__(/*! ../../SaveManager */ "./src/SaveManager.ts");
const TextInputManager_1 = __webpack_require__(/*! ../../TextInputManager */ "./src/TextInputManager.ts");
const ClickableRegion_1 = __importDefault(__webpack_require__(/*! ../Objects/ClickableRegion */ "./src/Game/Objects/ClickableRegion.ts"));
class LoginMenu extends BaseGame_1.default {
    constructor() {
        super(...arguments);
        this.hasUser = false;
        this.dimensions = { width: 500, height: 300 };
        this.text = "";
        this.midButton = "";
        this.usernameInput = new TextInputManager_1.TextInputManager("username", true);
        this.setupButtonClickableRegion = new ClickableRegion_1.default();
        this.signinButtonClickableRegion = new ClickableRegion_1.default();
        this.scale = 0;
        this.bufferedScale = 0;
        this.alpha = 0;
        this.bufferedAlpha = 0;
        this.subText = "";
        this.subTextAlpha = 0;
        this.bufferedSubTextAlpha = 0;
        this.buttonAlpha = 0;
        this.bufferedButtonAlpha = 0;
        this.signinButtonAlpha = 0;
        this.bufferedSigninButtonAlpha = 0;
        this.y = 0;
        this.bufferedY = 0;
        this.textY = 0;
        this.bufferedTextY = 0;
        this.floaters = [];
        this.rate = 0.02;
    }
    setup() {
        this.scale = 0.75;
        this.bufferedScale = 1;
        this.alpha = 0;
        this.bufferedAlpha = 1;
        this.buttonAlpha = 0;
        this.bufferedButtonAlpha = 0;
        this.signinButtonAlpha = 0;
        this.bufferedSigninButtonAlpha = 0;
        this.y = this.canvas.height;
        this.bufferedY = 0;
        this.textY = 0;
        this.bufferedTextY = 0;
        this.usernameInput.maxlen = 20;
        this.usernameInput.styles.color = "white";
        this.usernameInput.styles.display = "none";
        this.usernameInput.styles.fontSize = "40px";
        this.usernameInput.styles.textAlign = "center";
        this.usernameInput.styles.fontWeight = "lighter";
        this.usernameInput.styles.fontFamily = "Metropolis";
        this.usernameInput._element.placeholder = "Username...";
        this.setupButtonClickableRegion.enabled = false;
        this.signinButtonClickableRegion.enabled = false;
        SaveManager_1.Saves.load();
        const user = SaveManager_1.Saves.getUser();
        if (user) {
            const greetings = [
                "Welcome back",
                "Hello again",
                "Hi again",
                "Hows it going",
                "Great to see you",
                "Greetings"
            ];
            this.midButton = "Log In";
            this.text = Util_1.Random.sample(greetings)[0];
            this.hasUser = true;
            this.subText = user.name;
            Console_1.Console.log(`LoginMenu: User data found: ${user.name}, skipping user setup`);
        }
        else {
            const greetings = [
                "Welcome!",
                "Hello there!",
                "Let's get started!",
                "Nice to meet you!",
                "Hi there!"
            ];
            this.midButton = "Setup";
            this.text = Util_1.Random.sample(greetings)[0];
            Console_1.Console.log("LoginMenu: No user data found, starting user setup");
        }
        const instance = this;
        Scheduler_1.Routine.startTask(function* () {
            yield new Scheduler_1.WaitForSeconds(0.5);
            if (instance.hasUser) {
                instance.bufferedTextY = -80;
                instance.bufferedSubTextAlpha = 1;
            }
            else {
                instance.bufferedTextY = -60;
            }
            yield new Scheduler_1.WaitForSeconds(1);
            instance.bufferedButtonAlpha = 1;
            instance.setupButtonClickableRegion.enabled = true;
        });
        this.setupButtonClickableRegion.onclick = () => {
            this.setupButtonClickableRegion.enabled = false;
            if (this.hasUser) {
                this._endgameSequence();
            }
            else {
                this.bufferedButtonAlpha = 0;
                setTimeout(() => {
                    this.signinButtonClickableRegion.enabled = true;
                    this.usernameInput.styles.display = "block";
                    this.usernameInput._element.focus();
                }, 1500);
            }
        };
        this.signinButtonClickableRegion.onclick = () => {
            this.signinButtonClickableRegion.enabled = false;
            this.bufferedSigninButtonAlpha = 0;
            this.usernameInput.disabled = true;
            Console_1.Console.log(`LoginMenu: Saving new user data`);
            SaveManager_1.Saves.setUser(this.usernameInput.value.trim()); // FIXME
            SaveManager_1.Saves.save();
            this._endgameSequence();
        };
        for (let i = 0; i < this.canvas.width / 100 * 2; i++) {
            const rx = Math.random() * this.canvas.width;
            const ry = Math.random() * this.canvas.height;
            const s = Util_1.Random.random(40, 20);
            this.floaters.push({
                "type": Util_1.Random.sample(["square", "circle", "triangle"])[0],
                "pos": new Util_1.Vector2(rx, ry),
                "size": s,
                "vel": new Util_1.Force(Math.random() * Math.PI * 2, 1),
                "angm": Util_1.Random.random(Util_1.Angle.toRadians(1), Util_1.Angle.toRadians(0.1), false) * (Util_1.Random.random() ? -1 : 1),
                "ang": Math.PI * 4 * Math.random()
            });
        }
        this.renderObjects.push(this.setupButtonClickableRegion);
        this.renderObjects.push(this.signinButtonClickableRegion);
    }
    loop() {
        this._backgroundGrad();
        this._floaters();
        this._modalRect();
        this._modalButtons();
        this._modalText();
        this._modalInputs();
        this.y = Util_1.LerpUtils.lerp(this.y, this.bufferedY, this.rate * 4);
        this.textY = Util_1.LerpUtils.lerp(this.textY, this.bufferedTextY, this.rate * 2);
        this.scale = Util_1.LerpUtils.lerp(this.scale, this.bufferedScale, this.rate * 2);
        this.alpha = Util_1.LerpUtils.lerp(this.alpha, this.bufferedAlpha, this.rate);
        this.subTextAlpha = Util_1.LerpUtils.lerp(this.subTextAlpha, this.bufferedSubTextAlpha, this.rate);
        this.buttonAlpha = Util_1.LerpUtils.lerp(this.buttonAlpha, this.bufferedButtonAlpha, this.rate * (this.setupButtonClickableRegion.enabled ? 1 : 4));
        this.signinButtonAlpha = Util_1.LerpUtils.lerp(this.signinButtonAlpha, this.bufferedSigninButtonAlpha, this.rate * 4);
    }
    _floaters() {
        this.floaters.forEach(floater => {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#7f7f7f40";
            this.ctx.lineWidth = 5;
            this.ctx.globalAlpha = this.alpha;
            this.ctx.translate(floater.pos.x, floater.pos.y);
            this.ctx.rotate(floater.ang);
            switch (floater.type) {
                case "circle":
                    this.ctx.arc(0, 0, floater.size / 2, 0, Math.PI * 2);
                    break;
                case "square":
                    this.ctx.roundRect(-floater.size / 2, -floater.size / 2, floater.size, floater.size, 5);
                    break;
                case "triangle":
                    const m = floater.size / 2;
                    this.ctx.moveTo(0, -m);
                    this.ctx.lineTo(m * Math.sin(Util_1.Angle.toRadians(120)), -m * Math.cos(Util_1.Angle.toRadians(120)));
                    this.ctx.lineTo(m * Math.sin(Util_1.Angle.toRadians(240)), -m * Math.cos(Util_1.Angle.toRadians(240)));
                    break;
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
            floater.ang += floater.angm;
            const nextLoc = Util_1.Vector2.addForce(floater.pos, floater.vel);
            const offPageCorner = new Util_1.Vector2(this.canvas.width * -0.25, this.canvas.height * -0.25);
            if (Util_1.MathUtils.isPointInRectangle(nextLoc, offPageCorner, this.canvas.width * 1.5, this.canvas.height * 1.5)) {
                floater.pos = nextLoc;
            }
            else {
                const newAngle = new Util_1.Vector2(this.canvas.width / 2, this.canvas.height / 2).toForce(floater.pos).degrees;
                floater.vel.degrees = newAngle + Util_1.Random.random(40, -40);
                floater.pos.addForce(floater.vel);
            }
            window.Random = Util_1.Random;
        });
    }
    _backgroundGrad() {
        this.ctx.save();
        this.ctx.beginPath();
        const grad = this.ctx.createLinearGradient(0, this.canvas.height * -0.4, this.canvas.width, this.canvas.height * 1.4);
        grad.addColorStop(0, "#0b70dc");
        grad.addColorStop(0.45, "#2d1164");
        grad.addColorStop(0.55, "#2d1164");
        grad.addColorStop(1, "#d82747");
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = grad;
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
    _modalText() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "Bold " + (50 * this.scale) + "px Metropolis";
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + this.y + this.textY);
        this.ctx.fillText(this.text, 0, 0);
        this.ctx.closePath();
        this.ctx.restore();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "Bold " + (30 * this.scale) + "px Metropolis";
        this.ctx.globalAlpha = Math.min(this.alpha, this.subTextAlpha);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + this.y - 10);
        this.ctx.fillText(this.subText, 0, 0, this.dimensions.width * this.scale * 0.9);
        this.ctx.closePath();
        this.ctx.restore();
    }
    _modalButtons() {
        const Y_OFFSET = 70;
        // TODO
        // this.ctx.save();
        // this.ctx.beginPath();
        // this.ctx.globalAlpha = Math.min(this.alpha, this.buttonAlpha);
        // this.ctx.strokeStyle = "#4e4e50";
        // this.ctx.fillStyle = "#00000000";
        // this.ctx.lineWidth = 3;
        // const boxPad = 10;
        // this.ctx.roundRect(textPosTL.x - boxPad, textPosTL.y - boxPad, tdims.width + 2 * boxPad, tdims.height + 2 * boxPad, 10);
        // this.ctx.fill();
        // this.ctx.stroke();
        // this.ctx.closePath();
        // this.ctx.restore();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.globalAlpha = Math.min(this.alpha, this.buttonAlpha);
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "40px Metropolis";
        this.ctx.fillStyle = "#ffffff";
        if (this.setupButtonClickableRegion.hovering) {
            this.ctx.fillStyle = "#cfcfcf";
            this.cursor = "pointer";
        }
        const tmetrics = Util_1.TextUtils.measureTextMetrics(this.midButton, "40px Metropolis");
        const tdims = Util_1.TextUtils.metricsToDim2(tmetrics);
        const textPosTL = new Util_1.Vector2(this.canvas.width / 2 - tdims.width / 2, this.canvas.height / 2 - tdims.height / 2 + Y_OFFSET);
        this.setupButtonClickableRegion.location = textPosTL;
        this.setupButtonClickableRegion.dimensions = tdims;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + Y_OFFSET);
        this.ctx.fillText(this.midButton, 0, 0);
        this.ctx.closePath();
        this.ctx.restore();
        const SIGNIN_Y_OFFSET = 80;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "30px Metropolis";
        this.ctx.globalAlpha = Math.min(this.alpha, this.signinButtonAlpha);
        this.ctx.fillStyle = "#ffffff";
        const signinTMetrics = Util_1.TextUtils.measureTextMetrics("Sign In", "30px Metropolis");
        const signinDims = Util_1.TextUtils.metricsToDim2(signinTMetrics);
        const signinTextPosTL = new Util_1.Vector2(this.canvas.width / 2 - signinDims.width / 2, this.canvas.height / 2 - signinDims.height / 2 + SIGNIN_Y_OFFSET);
        const validUsername = this.usernameInput.value.trim().length > 0;
        this.signinButtonClickableRegion.location = signinTextPosTL;
        this.signinButtonClickableRegion.dimensions = signinDims;
        if (!this.usernameInput.disabled)
            this.bufferedSigninButtonAlpha = validUsername ? 1 : 0;
        if (this.signinButtonClickableRegion.hovering) {
            this.ctx.fillStyle = "#c0c0c0";
            this.cursor = validUsername ? "pointer" : "default";
        }
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + SIGNIN_Y_OFFSET);
        this.ctx.strokeText("Sign In", 0, 0);
        this.ctx.fillText("Sign In", 0, 0);
        this.ctx.closePath();
        this.ctx.restore();
    }
    _modalRect() {
        const cornerY = -this.dimensions.height / 2 * this.scale;
        const cornerX = -this.dimensions.width / 2 * this.scale;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#363740";
        this.ctx.lineWidth = 5;
        this.ctx.fillStyle = "#2d2e35";
        this.ctx.globalAlpha = this.alpha;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + this.y);
        this.ctx.roundRect(cornerX, cornerY, this.dimensions.width * this.scale, this.dimensions.height * this.scale, 10);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
    _modalInputs() {
        this.usernameInput.styles.opacity = `${this.alpha}`;
        this.usernameInput.location = new Util_1.Vector2(this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    _endgameSequence() {
        this.bufferedAlpha = 0;
        this.rate *= 1.5;
        const slowdownTimer = setInterval(() => {
            this.floaters.forEach(floater => {
                floater.vel.magnitude *= 0.9;
                floater.angm *= 0.9;
            });
        }, 50);
        setTimeout(() => {
            clearInterval(slowdownTimer);
            TextInputManager_1.TextInputManager.discard(this.usernameInput.id);
            GameLoader_1.GameLoader.endGame();
        }, 2500);
    }
}
exports["default"] = LoginMenu;


/***/ }),

/***/ "./src/Game/Games/MenuScreen.ts":
/*!**************************************!*\
  !*** ./src/Game/Games/MenuScreen.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AssetManager_1 = __webpack_require__(/*! ../../AssetManager */ "./src/AssetManager.ts");
const AudioSystem_1 = __webpack_require__(/*! ../../AudioSystem */ "./src/AudioSystem.ts");
const Console_1 = __webpack_require__(/*! ../../Console */ "./src/Console.ts");
const ElementDefinitions_1 = __webpack_require__(/*! ../../ElementDefinitions */ "./src/ElementDefinitions.ts");
const BaseGame_1 = __importDefault(__webpack_require__(/*! ../../lib/BaseGame */ "./src/lib/BaseGame.ts"));
const Scheduler_1 = __webpack_require__(/*! ../../lib/Scheduler */ "./src/lib/Scheduler.ts");
const Util_1 = __webpack_require__(/*! ../../lib/Util */ "./src/lib/Util.ts");
const SaveManager_1 = __webpack_require__(/*! ../../SaveManager */ "./src/SaveManager.ts");
const UIParticleButton_1 = __importDefault(__webpack_require__(/*! ../Objects/UIParticleButton */ "./src/Game/Objects/UIParticleButton.ts"));
class MenuScreen extends BaseGame_1.default {
    constructor() {
        super(...arguments);
        this.skipOpening = true;
        this.openingDone = false;
        this.menuScreenEnable = false;
        this.openingVideo = AssetManager_1.AssetManager.load("Opening");
        this.rate = 0.01;
        this.alpha = 0;
        this.bufferedAlpha = 0;
        this.beatOffsetAmount = 0;
        this.beatstart = 0;
        this.startButton = new UIParticleButton_1.default("Start", "40px Metropolis", new Util_1.Vector2(this.canvas.width / 2, this.canvas.height / 2));
        this.startButtonBGRectW = 0;
        this.bufferedStartButtonBGRectW = 0;
        this.settingsButton = new UIParticleButton_1.default("Settings", "40px Metropolis", new Util_1.Vector2(this.canvas.width / 2, this.canvas.height * 0.6));
        this.settingsButtonBGRectW = 0;
        this.bufferedSettingsButtonBGRectW = 0;
    }
    setup() {
        if (this.skipOpening) {
            this._menuScreenSequence();
        }
        else {
            this.openingVideo.muted = false;
            this.openingVideo.volume = 0.1;
            this.openingVideo.style.transition = "opacity 3s";
            ElementDefinitions_1.VIDEOS.appendChild(this.openingVideo);
            const instance = this;
            Scheduler_1.Routine.startTask(function* () {
                instance.openingVideo.play();
                yield new Scheduler_1.WaitForSeconds(8.5);
                instance._menuScreenSequence();
            });
            window.AssetManager = AssetManager_1.AssetManager;
            this.openingVideo.onended = () => {
                Console_1.Console.log("MenuScreen: Destroying video instance");
                this.openingDone = true;
                this.openingVideo.remove();
            };
        }
        this.startButton.onhover = this.settingsButton.onhover = function () {
            this.releaseParticles();
        };
        this.startButton.onmouseover = this.settingsButton.onmouseover = () => {
            const fx = AssetManager_1.AssetManager.load("UI Hover");
            AudioSystem_1.AudioSystem.play(fx, { "volume": .2 });
        };
    }
    loop() {
        if (!this.openingDone) {
            this._openingVideo();
        }
        if (this.menuScreenEnable) {
            this._beatOffset();
            this._backgroundComponents();
            this._gameTitle();
            this._gameButtons();
        }
        this.alpha = Util_1.LerpUtils.lerp(this.alpha, this.bufferedAlpha, this.rate);
        this.startButtonBGRectW = Util_1.LerpUtils.lerp(this.startButtonBGRectW, this.bufferedStartButtonBGRectW, this.rate * 4);
        this.settingsButtonBGRectW = Util_1.LerpUtils.lerp(this.settingsButtonBGRectW, this.bufferedSettingsButtonBGRectW, this.rate * 4);
    }
    _menuScreenSequence() {
        const instance = this;
        SaveManager_1.Saves.save();
        Scheduler_1.Routine.startTask(function* () {
            Console_1.Console.log("MenuScreen: Starting menu screen");
            instance.openingVideo.style.opacity = "0";
            instance.menuScreenEnable = true;
            if (instance.skipOpening) {
                instance.bufferedAlpha = 1;
            }
            else {
                instance.alpha = instance.bufferedAlpha = 1;
            }
            let volFrom = instance.openingVideo.volume.valueOf();
            if (!instance.skipOpening) {
                for (let vol = instance.openingVideo.volume; vol > volFrom * 0.3; vol -= volFrom / 100) {
                    instance.openingVideo.volume = vol;
                    yield new Scheduler_1.WaitForSeconds(0.05);
                }
            }
            const bgm = AssetManager_1.AssetManager.load("Menu Screen");
            bgm.onplay = () => {
                instance.beatstart = Date.now();
                Console_1.Console.log("MenuScreen: Restarting bgm playback");
            };
            AudioSystem_1.AudioSystem.play(bgm, {
                "fadeIn": instance.skipOpening ? 1000 : 5000,
                "volume": 0.15,
                "loop": true
            });
            for (let vol = instance.openingVideo.volume; vol > volFrom * 0; vol -= volFrom / 100) {
                instance.openingVideo.volume = vol;
                yield new Scheduler_1.WaitForSeconds(0.05);
            }
        });
    }
    _beatOffset() {
        const jitteredDelay = 390;
        const bpmDelay = 60 * 1000 / 90;
        const beatProgression = ((Date.now() + jitteredDelay) - this.beatstart) % bpmDelay;
        const earliness = 4;
        this.beatOffsetAmount = Math.min(1, (beatProgression * earliness) / bpmDelay);
    }
    _getBeatScale() {
        return Util_1.LerpUtils.lerp(1, 1.02, this.beatOffsetAmount, Util_1.LerpUtils.Functions.SmoothSpike);
    }
    _gameTitle() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "70px Metropolis";
        this.ctx.globalAlpha = this.alpha;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height * 0.30);
        this.ctx.scale(this._getBeatScale(), this._getBeatScale());
        this.ctx.fillText("MenuScreen#_gameTitle()", 0, 0, this.canvas.width * 0.9);
        this.ctx.closePath();
        this.ctx.restore();
    }
    _gameButtons() {
        this.startButton.alpha = this.settingsButton.alpha = this.alpha;
        const pad = 40;
        this.bufferedStartButtonBGRectW = -this.canvas.width * .25;
        this.bufferedSettingsButtonBGRectW = -this.canvas.width * .25;
        if (this.startButton.clickableRegion.hovering) {
            this.bufferedStartButtonBGRectW = this.canvas.width * 1.25;
        }
        if (this.settingsButton.clickableRegion.hovering) {
            this.bufferedSettingsButtonBGRectW = this.canvas.width * 1.25;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = "#00ffff";
        const startCorner = new Util_1.Vector2(0, this.startButton.location.y - pad);
        this.ctx.rect(startCorner.x, startCorner.y, this.startButtonBGRectW, pad * 2);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.fillStyle = "#ff7f00";
        const settingsCorner = new Util_1.Vector2(0, this.settingsButton.location.y - pad);
        this.ctx.rect(settingsCorner.x, settingsCorner.y, this.settingsButtonBGRectW, pad * 2);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
        this.startButton.loop(this.ctx, this);
        this.settingsButton.loop(this.ctx, this);
    }
    _backgroundComponents() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.globalAlpha = this.alpha;
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
    _openingVideo() {
        this.openingVideo.style.left = `${this.canvas.width / 2 - this.openingVideo.width / 2}px`;
        this.openingVideo.style.top = `${this.canvas.height / 2 - this.openingVideo.height / 2}px`;
        this.openingVideo.controls = false;
        const videoAspRatio = this.openingVideo.width / this.openingVideo.height;
        this.openingVideo.height = this.canvas.height;
        this.openingVideo.width = this.canvas.height * videoAspRatio;
        if (this.openingVideo.width < this.canvas.width) {
            this.openingVideo.width = this.canvas.width;
            this.openingVideo.height = this.canvas.width / videoAspRatio;
        }
    }
}
exports["default"] = MenuScreen;


/***/ }),

/***/ "./src/Game/Objects/ClickableRegion.ts":
/*!*********************************************!*\
  !*** ./src/Game/Objects/ClickableRegion.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Loopable_1 = __importDefault(__webpack_require__(/*! ../../lib/Loopable */ "./src/lib/Loopable.ts"));
const Util_1 = __webpack_require__(/*! ../../lib/Util */ "./src/lib/Util.ts");
class ClickableRegion extends Loopable_1.default {
    constructor(location = new Util_1.Vector2(0, 0), dimensions = { width: 0, height: 0 }) {
        super();
        this.onhover = () => { };
        this.onclick = () => { };
        this.hovering = false;
        this.clicking = false;
        this.location = location;
        this.dimensions = dimensions;
        this.enabled = true;
    }
    loop(_ctx, game) {
        this.hovering = false;
        this.clicking = false;
        if (!this.enabled)
            return;
        if (Util_1.MathUtils.isPointInRectangle(game.input.mousePos, this.location, this.dimensions.width, this.dimensions.height)) {
            this.hovering = true;
            this.onhover.apply(this);
            if (game.input.mouseClick) {
                this.onclick.apply(this);
                this.clicking = true;
            }
        }
    }
}
exports["default"] = ClickableRegion;


/***/ }),

/***/ "./src/Game/Objects/UIParticle.ts":
/*!****************************************!*\
  !*** ./src/Game/Objects/UIParticle.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicUIParticle = void 0;
const Loopable_1 = __importDefault(__webpack_require__(/*! ../../lib/Loopable */ "./src/lib/Loopable.ts"));
const Util_1 = __webpack_require__(/*! ../../lib/Util */ "./src/lib/Util.ts");
class UIParticle extends Loopable_1.default {
    loop(ctx, game) {
        void ctx, game;
    }
}
exports["default"] = UIParticle;
class BasicUIParticle extends Loopable_1.default {
    constructor(location, size, gravity = new Util_1.Force(0, 0)) {
        super();
        this.enabled = false;
        this.velocity = new Util_1.Force(0, 0);
        this.ang = 0;
        this.angm = Util_1.Angle.toRadians(Util_1.Random.random(10, 5, false));
        const pastelColorValues = [0xff, 0xff, 0xff, 0x7f, 0x7f, 0x7f, 0, 0, 0];
        const v = Util_1.Random.sample(pastelColorValues, 3);
        this.color = new Util_1.Color.RGB(v[0], v[1], v[2]);
        this.location = location;
        this.originGravity = gravity;
        this.gravity = gravity.clone();
        this.size = size;
    }
    loop(ctx, _game) {
        if (!this.enabled)
            return;
        this.location.addForce(this.velocity);
        this.location.addForce(this.gravity);
        this.gravity.magnitude *= 1.05;
        this.ang += this.angm;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color.toString();
        ctx.globalAlpha = 0.5;
        ctx.translate(this.location.x, this.location.y);
        ctx.rotate(this.ang);
        const m = this.size / 2;
        ctx.moveTo(0, -m);
        ctx.lineTo(m * Math.sin(Util_1.Angle.toRadians(120)), -m * Math.cos(Util_1.Angle.toRadians(120)));
        ctx.lineTo(m * Math.sin(Util_1.Angle.toRadians(240)), -m * Math.cos(Util_1.Angle.toRadians(240)));
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    reset() {
        this.gravity = this.originGravity.clone();
        this.velocity = new Util_1.Force(0, 0);
    }
}
exports.BasicUIParticle = BasicUIParticle;


/***/ }),

/***/ "./src/Game/Objects/UIParticleButton.ts":
/*!**********************************************!*\
  !*** ./src/Game/Objects/UIParticleButton.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Loopable_1 = __importDefault(__webpack_require__(/*! ../../lib/Loopable */ "./src/lib/Loopable.ts"));
const Util_1 = __webpack_require__(/*! ../../lib/Util */ "./src/lib/Util.ts");
const ClickableRegion_1 = __importDefault(__webpack_require__(/*! ./ClickableRegion */ "./src/Game/Objects/ClickableRegion.ts"));
const UIParticle_1 = __webpack_require__(/*! ./UIParticle */ "./src/Game/Objects/UIParticle.ts");
class UIParticleButton extends Loopable_1.default {
    constructor(text, font, location) {
        super();
        this.particles = [];
        this.particlesOngoing = false;
        this.hover = false;
        this.disabled = false;
        this.alpha = 0;
        this.onclick = () => { };
        this.onhover = () => { };
        this.onmouseover = () => { };
        this.text = text;
        this.font = font;
        this.location = location.clone();
        this.clickableRegion = new ClickableRegion_1.default();
        this.clickableRegion.onclick = this.onclick;
        this.clickableRegion.onhover = this.onhover;
        for (let i = 0; i < 30; i++) {
            this.particles.push(new UIParticle_1.BasicUIParticle(new Util_1.Vector2(0, 0), Util_1.Random.random(20, 10), new Util_1.Force(Math.PI * 0.5, 1)));
        }
    }
    loop(ctx, game) {
        ctx.save();
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = this.alpha;
        ctx.font = this.font;
        const tm = Util_1.TextUtils.measureTextMetrics(this.text, this.font);
        const tdims = Util_1.TextUtils.metricsToDim2(tm);
        this.clickableRegion.location.x = this.location.x - tdims.width / 2;
        this.clickableRegion.location.y = this.location.y - tdims.height / 2;
        this.clickableRegion.dimensions.width = tdims.width;
        this.clickableRegion.dimensions.height = tdims.height;
        if (this.clickableRegion.hovering && !this.disabled) {
            if (!this.hover)
                this.onmouseover.apply(this);
            this.hover = true;
            ctx.fillStyle = "#474747";
            game.cursor = "pointer";
            this.onhover.apply(this);
        }
        else {
            this.hover = false;
        }
        ctx.translate(this.location.x, this.location.y);
        ctx.fillText(this.text, 0, 0);
        ctx.closePath();
        ctx.restore();
        this.particles.forEach(p => p.loop(ctx, game));
        this.clickableRegion.loop(ctx, game);
    }
    releaseParticles() {
        if (!this.particlesOngoing) {
            this.particlesOngoing = true;
            this.particles.forEach(p => {
                const f = new Util_1.Force(Math.random() * Math.PI * 2, Util_1.Random.random(10, 5));
                p.velocity = f;
                p.location = this.location.clone();
                p.enabled = true;
            });
            setTimeout(() => this.resetParticles(), 60 * 1000 / 90 * 4);
        }
    }
    resetParticles() {
        this.particlesOngoing = false;
        this.particles.forEach(p => {
            p.enabled = false;
            p.reset();
        });
    }
}
exports["default"] = UIParticleButton;


/***/ }),

/***/ "./src/GameLoader.ts":
/*!***************************!*\
  !*** ./src/GameLoader.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameLoader = void 0;
const AssetDirectoryParser_1 = __webpack_require__(/*! ./AssetDirectoryParser */ "./src/AssetDirectoryParser.ts");
const AssetManager_1 = __webpack_require__(/*! ./AssetManager */ "./src/AssetManager.ts");
const Console_1 = __webpack_require__(/*! ./Console */ "./src/Console.ts");
const ElementDefinitions_1 = __webpack_require__(/*! ./ElementDefinitions */ "./src/ElementDefinitions.ts");
const Util_1 = __webpack_require__(/*! ./lib/Util */ "./src/lib/Util.ts");
var GameLoader;
(function (GameLoader) {
    // TODO create a json file or some sort of config to store this
    GameLoader.BASE_DIRECTORY = "/assets/game/directory.xml";
    let GameClass;
    let timestamp;
    const $loadTitle = $("#title");
    const $loadPercent = $("#percent");
    async function load(gameClass, assetDirectory) {
        return new Promise((res, rej) => {
            GameClass = gameClass;
            Console_1.Console.log("GameLoader: Preparing to load new game");
            timestamp = Date.now();
            $("#menu").removeClass("d-flex");
            $("#menu").hide();
            ElementDefinitions_1.$MAIN.show();
            Console_1.Console.log(`GameLoader: Asset base directory is '${GameLoader.BASE_DIRECTORY}'`);
            loadAssets(assetDirectory || GameLoader.BASE_DIRECTORY).catch(e => {
                Console_1.Console.error("GameLoader: Failed to load some assets");
                if (e.length) {
                    e.forEach(err => Console_1.Console.error("GameLoader: " + err));
                }
                // $("#menu").addClass("d-flex");
                // $loadTitle.text("Error");
                // $loadPercent.text("Loading aborted");
            }).finally(async () => {
                Console_1.Console.log(`GameLoader: Finished loading! (took ${(Date.now() - timestamp) / 1000}s)`);
                try {
                    const g = await startGame();
                    if (GameLoader.game) {
                        res(g);
                    }
                }
                catch (err) {
                    rej(err);
                }
            });
        });
    }
    GameLoader.load = load;
    async function loadAssets(baseDirectory) {
        let error = [];
        $loadTitle.text("Calculating size...");
        Console_1.Console.log("GameLoader: Calculating size...");
        try {
            const assets = await AssetDirectoryParser_1.AssetDirectoryParser.loadDirectories(baseDirectory);
            let assetsLoaded = 0;
            Console_1.Console.log(`GameLoader: Found ${assets.length} assets to load`);
            $loadTitle.text("Loading assets...");
            for (const asset of assets) {
                $loadPercent.text(`${Math.floor(((assetsLoaded + 1) / assets.length) * 100)}%`);
                try {
                    if (asset.dims)
                        await AssetManager_1.AssetManager.save(asset.type, asset.name, asset.path, asset.dims);
                    else
                        await AssetManager_1.AssetManager.save(asset.type, asset.name, asset.path);
                }
                catch (e) {
                    Console_1.Console.error(`GameLoader: ${asset.name}: Failed to save new '${asset.type}' asset`);
                }
                assetsLoaded++;
            }
        }
        catch (e) {
            error.push(e);
        }
        if (error.length !== 0)
            throw error;
    }
    GameLoader.loadAssets = loadAssets;
    async function startGame() {
        return new Promise((res, rej) => {
            ElementDefinitions_1.$LOADER.hide(); // TODO do not make loading screen dependent of GameLoader in the future
            Console_1.Console.log(`GameLoader: Launching new '${GameClass.name}' game`);
            try {
                GameLoader.game = new GameClass($("#game")[0]);
                res(GameLoader.game);
                Util_1.TextUtils.ctx = GameLoader.game.ctx;
            }
            catch (err) {
                rej(err);
            }
        });
    }
    function endGame() {
        if (GameLoader.game) {
            Console_1.Console.log(`GameLoader: Stopping and destroying '${GameClass.name}' game`);
            GameLoader.game.__stop();
            GameLoader.game = null;
        }
    }
    GameLoader.endGame = endGame;
    function toggleDebugLog() {
        Console_1.Console._scrollToBottom();
        ElementDefinitions_1.LOG.style.display = (!ElementDefinitions_1.LOG.style.display || ElementDefinitions_1.LOG.style.display == "none") ? "flex" : "none";
    }
    GameLoader.toggleDebugLog = toggleDebugLog;
})(GameLoader = exports.GameLoader || (exports.GameLoader = {}));


/***/ }),

/***/ "./src/SaveManager.ts":
/*!****************************!*\
  !*** ./src/SaveManager.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Saves = void 0;
const Console_1 = __webpack_require__(/*! ./Console */ "./src/Console.ts");
// import brotli from "brotli-wasm"; // TODO
const Buffer = (__webpack_require__(/*! buffer */ "./node_modules/buffer/index.js").Buffer);
var brotli;
(function (brotli) {
    function compress(data, _settings) {
        return data;
    }
    brotli.compress = compress;
    function decompress(data) {
        return data;
    }
    brotli.decompress = decompress;
})(brotli || (brotli = {}));
// Local saves ONLY
var Saves;
(function (Saves) {
    Saves.STORE_ENCODING = "binary";
    Saves.COMPRESSION_LEVEL = 6;
    Saves.SAVE_KEY = "td_saves";
    let session = {
        save: [],
        user: null,
        lastLogin: -1
    };
    let lastLogin = 0;
    function getLastLogin() {
        return lastLogin;
    }
    Saves.getLastLogin = getLastLogin;
    function getUser() {
        return session.user;
    }
    Saves.getUser = getUser;
    function setUser(name) {
        session.user = {
            "name": name,
            "timestamp": Date.now()
        };
    }
    Saves.setUser = setUser;
    function listSaveIDs() {
        return session.save.map(save => save.id);
    }
    Saves.listSaveIDs = listSaveIDs;
    function getSave() {
        if (session.save.length > 0) {
            const save = session.save.find(save => save.id == Saves.currentSaveID);
            if (save) {
                Saves.currentSaveData = save;
                return true;
            }
            Saves.currentSaveID = Saves.currentSaveData.id;
        }
        return false;
    }
    Saves.getSave = getSave;
    function setSave() {
        const saveIndex = session.save.findIndex(save => save.id == Saves.currentSaveID);
        if (saveIndex) {
            session.save[saveIndex] = Saves.currentSaveData;
        }
        else {
            session.save.push(Saves.currentSaveData);
        }
    }
    Saves.setSave = setSave;
    function createSave(saveName) {
        const id = Math.floor(Math.random() * 10 ** 20).toString(26);
        session.save.push({
            "id": id,
            "name": saveName,
            "round": 1,
            "cash": 10,
            "timestamp": Date.now()
        });
        save();
        return id;
    }
    Saves.createSave = createSave;
    function deleteSave(id) {
        const saveIndex = session.save.findIndex(save => save.id == id);
        if (saveIndex != -1) {
            session.save.splice(saveIndex, 1);
            save();
            return true;
        }
        return false;
    }
    Saves.deleteSave = deleteSave;
    function load() {
        const rawSaves = window.localStorage.getItem(Saves.SAVE_KEY);
        if (rawSaves) {
            try {
                const decompressedData = brotli.decompress(Buffer.from(rawSaves, Saves.STORE_ENCODING));
                session = JSON.parse(Buffer.from(decompressedData).toString());
                lastLogin = session.lastLogin.valueOf();
                session.lastLogin = Date.now();
            }
            catch (e) {
                Console_1.Console.error("SaveManager: Failed to load saves from localStorage");
            }
        }
    }
    Saves.load = load;
    function save() {
        try {
            const compressedData = brotli.compress(Buffer.from(JSON.stringify(session)), {
                "mode": 1,
                "quality": 11,
                "lgwin": 22
            });
            window.localStorage.setItem(Saves.SAVE_KEY, Buffer.from(compressedData).toString("binary"));
        }
        catch (e) {
            Console_1.Console.error("SaveManager: Failed to create save to localStorage");
            return false;
        }
        return true;
    }
    Saves.save = save;
})(Saves = exports.Saves || (exports.Saves = {}));


/***/ }),

/***/ "./src/TextInputManager.ts":
/*!*********************************!*\
  !*** ./src/TextInputManager.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextInputManager = void 0;
const Console_1 = __webpack_require__(/*! ./Console */ "./src/Console.ts");
const ElementDefinitions_1 = __webpack_require__(/*! ./ElementDefinitions */ "./src/ElementDefinitions.ts");
const Util_1 = __webpack_require__(/*! ./lib/Util */ "./src/lib/Util.ts");
class TextInputManager {
    constructor(id, centered) {
        this.location = new Util_1.Vector2(0, 0);
        this.id = id;
        TextInputManager.inputs.set(id, this);
        this.centered = centered;
        this._element = document.createElement("input");
        this._element.style.background = "transparent";
        this._element.style.border = "none";
        this._element.style.padding = "0px";
        this._element.style.outline = "none";
        this._element.style.margin = "0px";
        this._element.autocomplete = "off";
        this._element.spellcheck = false;
        TextInputManager.inputContainer.appendChild(this._element);
        if (this.centered) {
            this._element.style.textAlign = "center";
            this.location = new Util_1.Vector2(0, 0);
        }
        setInterval(() => {
            const c = this.centered ? " - 50%" : "";
            this.styles.transform = `translate(calc(${this.location.x}px${c}), calc(${this.location.y}px${c}))`;
        });
    }
    get value() {
        return this._element.value;
    }
    set value(value) {
        this._element.value = value;
    }
    get styles() {
        return this._element.style;
    }
    set disabled(disabled) {
        this._element.disabled = disabled;
    }
    get disabled() {
        return !this._element || this._element.disabled;
    }
    set maxlen(len) {
        this._element.maxLength = len;
    }
    set type(type) {
        this._element.type = type;
    }
    static discard(id) {
        if (this.has(id)) {
            this.inputs.get(id)._element.remove();
            this.inputs.delete(id);
        }
    }
    static has(id) {
        if (this.inputs.has(id)) {
            return true;
        }
        Console_1.Console.warn(`TextInputManager: No input found with id of '${id}'`);
        return false;
    }
}
exports.TextInputManager = TextInputManager;
TextInputManager.inputs = new Map();
TextInputManager.inputContainer = ElementDefinitions_1.INPUTS;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Console_1 = __webpack_require__(/*! ./Console */ "./src/Console.ts");
const LoginMenu_1 = __importDefault(__webpack_require__(/*! ./Game/Games/LoginMenu */ "./src/Game/Games/LoginMenu.ts"));
const MenuScreen_1 = __importDefault(__webpack_require__(/*! ./Game/Games/MenuScreen */ "./src/Game/Games/MenuScreen.ts"));
const GameLoader_1 = __webpack_require__(/*! ./GameLoader */ "./src/GameLoader.ts");
const SaveManager_1 = __webpack_require__(/*! ./SaveManager */ "./src/SaveManager.ts");
$(async () => {
    Console_1.Console.initialize();
    await GameLoader_1.GameLoader.load(LoginMenu_1.default).then(game => game.start());
    await GameLoader_1.GameLoader.load(MenuScreen_1.default).then(game => {
        const timeSinceLastLogin = Date.now() - SaveManager_1.Saves.getLastLogin();
        game.skipOpening = timeSinceLastLogin <= 1000 * 60 * 60 * 3;
        return game.start();
    });
    Console_1.Console.log(`Sequence End`);
});


/***/ }),

/***/ "./src/lib/BaseGame.ts":
/*!*****************************!*\
  !*** ./src/lib/BaseGame.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Console_1 = __webpack_require__(/*! ../Console */ "./src/Console.ts");
const UserInput_1 = __webpack_require__(/*! ./UserInput */ "./src/lib/UserInput.ts");
class Game {
    get deltaTime() { return (Date.now() - this.lastFrameTimestamp) / 1000; }
    set cursor(cursor) { document.body.style.cursor = cursor; }
    get cursor() { return document.body.style.cursor; }
    /**
     * Do not instantiate game class without using a GameLoader
     */
    constructor(canvas) {
        this.input = new UserInput_1.Input();
        this.clear = true;
        this.lastFrameTimestamp = Date.now();
        this.renderObjects = [];
        this.started = false;
        this.stopped = false;
        this.gameEndRes = () => { };
        this.frame = () => {
            if (!this.stopped) {
                requestAnimationFrame(this.frame.bind(this));
                this.input.step();
                if (this.clear) {
                    this.cursor = "default";
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.closePath();
                    this.ctx.restore();
                }
                this.renderObjects.forEach(object => object.loop(this.ctx, this));
                this.loop();
                this.lastFrameTimestamp = Date.now();
            }
        };
        this.onresize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        this.__stop = () => {
            this.renderObjects = [];
            this.stopped = true;
            this.gameEndRes.apply(this);
        };
        /**
         * Used in promise chaining in GameLoader
         * @returns A promise that resolves when the game ends, for use in Promise chaining
         */
        this.start = () => {
            if (!this.started) {
                this.started = true;
                this.setup();
                this.frame();
                return new Promise(res => {
                    this.gameEndRes = res;
                });
            }
            else {
                Console_1.Console.warn("BaseGame: Attempted to start an already initialized game");
                return new Promise(res => res());
            }
        };
        this.isStopped = () => {
            return this.stopped;
        };
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.onresize();
        window.onresize = this.onresize.bind(this);
    }
    setup() { }
    loop() { }
}
exports["default"] = Game;


/***/ }),

/***/ "./src/lib/Loopable.ts":
/*!*****************************!*\
  !*** ./src/lib/Loopable.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Loopable {
    constructor(name = `loopable${Loopable._i++}`) {
        this.name = name;
    }
    loop(ctx, game) {
        void ctx, game;
    }
}
exports["default"] = Loopable;
Loopable._i = 0;


/***/ }),

/***/ "./src/lib/Scheduler.ts":
/*!******************************!*\
  !*** ./src/lib/Scheduler.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Routine = exports.WaitForSeconds = exports.WaitForMillis = exports.WaitForPromise = exports.WaitFor = void 0;
class WaitFor {
    constructor(test, process) {
        this.test = test;
        this.process = process || (function () { });
        this.tick();
    }
    tick() {
        if (this.test())
            return this.process();
        setTimeout(this.tick.bind(this));
    }
}
exports.WaitFor = WaitFor;
class WaitForPromise extends WaitFor {
    constructor(promise) {
        super(() => this.done);
        this.done = false;
        const self = this;
        promise.then(function () {
            self.done = true;
        }).catch(function () {
            self.done = true;
        });
    }
}
exports.WaitForPromise = WaitForPromise;
class WaitForMillis extends WaitFor {
    constructor(millis = 1, process) {
        const now = Date.now() + millis;
        super(() => (Date.now() >= now), process);
        this.millis = millis;
    }
}
exports.WaitForMillis = WaitForMillis;
class WaitForSeconds extends WaitForMillis {
    constructor(seconds = 1, process) {
        super(seconds * 1000, process);
    }
}
exports.WaitForSeconds = WaitForSeconds;
var Routine;
(function (Routine) {
    function continueGeneratorTask(task) {
        const result = task.next();
        const continueTask = () => continueGeneratorTask(task);
        if (result.done)
            return;
        if (result.value instanceof WaitFor)
            result.value.process = continueTask;
        else
            new WaitForMillis(1, continueTask);
    }
    async function startTask(process) {
        const task = process();
        continueGeneratorTask(task);
    }
    Routine.startTask = startTask;
})(Routine = exports.Routine || (exports.Routine = {}));


/***/ }),

/***/ "./src/lib/UserInput.ts":
/*!******************************!*\
  !*** ./src/lib/UserInput.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = exports.MouseClickType = void 0;
const Util_1 = __webpack_require__(/*! ./Util */ "./src/lib/Util.ts");
var MouseClickType;
(function (MouseClickType) {
    MouseClickType[MouseClickType["LEFT"] = 0] = "LEFT";
    MouseClickType[MouseClickType["SCROLL"] = 1] = "SCROLL";
    MouseClickType[MouseClickType["RIGHT"] = 2] = "RIGHT";
    MouseClickType[MouseClickType["BACK"] = 3] = "BACK";
    MouseClickType[MouseClickType["FORWARD"] = 4] = "FORWARD";
})(MouseClickType = exports.MouseClickType || (exports.MouseClickType = {}));
class Input {
    constructor() {
        this.mousePos = new Util_1.Vector2(0, 0);
        this.mouseDown = false;
        this.mouseClick = false;
        this.keysDown = [];
        this.keyPress = "";
        this._mouseClickFrames = 0;
        this._keyPressFrames = 0;
        this._keyPressEnable = true;
        this._lastKeyPress = "";
        const driver = this;
        $(window).on("mousemove", function (e) {
            driver.mousePos.x = e.clientX;
            driver.mousePos.y = e.clientY;
        });
        $(window).on("mousedown", function (e) {
            switch (e.button) {
            }
            driver.mouseDown = e.button;
            driver._mouseClickFrames = 1;
        });
        $(window).on("mouseup", function () {
            driver.mouseDown = false;
        });
        $(window).on("keydown", function (e) {
            if (!driver.keysDown.includes(e.key))
                driver.keysDown.push(e.key);
            driver.keyPress = (driver._keyPressEnable || (e.key != driver._lastKeyPress)) ? e.key : "";
            driver._lastKeyPress = e.key;
            driver._keyPressFrames = 1;
            driver._keyPressEnable = false;
        });
        $(window).on("keyup", function (e) {
            if (driver.keysDown.includes(e.key))
                driver.keysDown.splice(driver.keysDown.indexOf(e.key), 1);
            driver._keyPressEnable = true;
        });
    }
    step() {
        this.mouseClick = !!this._mouseClickFrames;
        this.keyPress = !!this._keyPressFrames ? this.keyPress : "";
        this._mouseClickFrames = Math.max(0, this._mouseClickFrames - 1);
        this._keyPressFrames = Math.max(0, this._keyPressFrames - 1);
    }
}
exports.Input = Input;


/***/ }),

/***/ "./src/lib/Util.ts":
/*!*************************!*\
  !*** ./src/lib/Util.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Color = exports.LerpUtils = exports.BezierUtils = exports.CubicBezier = exports.QuadraticBezier = exports.MathUtils = exports.Utils = exports.TextUtils = exports.Random = exports.Raycast = exports.Angle = exports.Force = exports.Vector2 = void 0;
/**
 * Class representing an x and y value in euclidean geometry
 *
 * Converting to a force will use it's x and y vectors as the force's x and y vectors
 */
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distanceTo(vector) {
        return Math.sqrt(((this.x - vector.x) ** 2) + ((this.y - vector.y) ** 2));
    }
    toForce(fromVector = Vector2.ORIGIN) {
        return new Force(Math.atan2(this.y - fromVector.y, this.x - fromVector.x), this.distanceTo(fromVector));
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    addForce(force) {
        this.add(force.toVector());
    }
    static difference(from, to) {
        return new Vector2(to.x - from.x, to.y - from.y);
    }
    static dot(vector1, vector2) {
        return new Vector2(vector1.x * vector2.x, vector1.y * vector2.y);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    simplify() {
        return {
            x: this.x,
            y: this.y
        };
    }
    static get ORIGIN() {
        return new Vector2(0, 0);
    }
    static add(vector1, vector2) {
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    static addForce(vector, force) {
        return Vector2.add(vector, force.toVector());
    }
    static between(vector, topLeft, bottomRight) {
        return MathUtils.between(vector.x, topLeft.x, bottomRight.x) && MathUtils.between(vector.y, topLeft.y, bottomRight.y);
    }
    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
}
exports.Vector2 = Vector2;
/**
 * Class representing a force with magnitude and radians.
 *
 * Manipulate individual x and y vectors with Force#setVectors()
 */
class Force {
    constructor(radians, magnitude) {
        this.radians = radians;
        this.magnitude = magnitude;
    }
    toVector() {
        return new Vector2(Math.cos(this.radians) * this.magnitude, Math.sin(this.radians) * this.magnitude);
    }
    setVectors(vectors) {
        const force = new Vector2(vectors.x, vectors.y).toForce(Vector2.ORIGIN);
        this.magnitude = force.magnitude;
        this.radians = force.radians;
    }
    clone() {
        return new Force(this.radians, this.magnitude);
    }
    add(force) {
        const resultant = Vector2.add(this.toVector(), force.toVector()).toForce(Vector2.ORIGIN);
        this.radians = resultant.radians;
        this.magnitude = resultant.magnitude;
    }
    simplify() {
        return {
            magnitude: this.magnitude,
            radians: this.radians
        };
    }
    get degrees() {
        return Angle.toDegrees(this.radians);
    }
    set degrees(degrees) {
        this.radians = Angle.toRadians(degrees);
    }
    equals(other) {
        return this.radians == other.radians && this.magnitude == other.magnitude;
    }
    setRadians(radians) {
        this.radians = radians;
        return this;
    }
    setDegrees(degrees) {
        this.degrees = degrees;
        return this;
    }
    setMagnitude(magnitude) {
        this.magnitude = magnitude;
        return this;
    }
    static add(force1, force2) {
        return Vector2.add(force1.toVector(), force2.toVector()).toForce(Vector2.ORIGIN);
    }
}
exports.Force = Force;
/**
 * Utility class for converting between radians (0 - 2π) and degrees (0 - 360).
 *
 * Values are unclamped
 */
var Angle;
(function (Angle) {
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    Angle.toRadians = toRadians;
    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }
    Angle.toDegrees = toDegrees;
})(Angle = exports.Angle || (exports.Angle = {}));
class Raycast {
    constructor(position, rotation) {
        this.position = position;
        this.rotation = rotation;
    }
    /**
     * @deprecated
     * Use `MathUtils.isLineIntersectingLine()` instead.
     */
    cast() { }
}
exports.Raycast = Raycast;
var Random;
(function (Random) {
    /**
     * Exclusive
     * ```js
     * Random.random(19, 2) // Random number from 18-2
     * ```
     */
    function random(max = 2, min = 0, rounded = true) {
        return (rounded ? Math.floor : (n) => n)((Math.random() * (max - min)) + min);
    }
    Random.random = random;
    function weightedRandom(weightMap) {
        let dcWeightMap = {};
        Object.assign(dcWeightMap, weightMap);
        let sum = 0;
        let random = Math.random();
        for (let i in dcWeightMap) {
            sum += dcWeightMap[i];
            if (random <= sum)
                return i;
        }
        return Object.keys(dcWeightMap).filter(item => dcWeightMap[item] == (Math.max(...Object.values(dcWeightMap))))[0];
    }
    Random.weightedRandom = weightedRandom;
    function sample(array, amount = 1) {
        return array.sort(() => 0.5 - Math.random()).slice(0, amount);
    }
    Random.sample = sample;
})(Random = exports.Random || (exports.Random = {}));
var TextUtils;
(function (TextUtils) {
    function measureTextMetrics(text, font) {
        const oldFont = TextUtils.ctx.font;
        TextUtils.ctx.font = font;
        // todo make no util function use App namespace
        const textm = TextUtils.ctx.measureText(text);
        TextUtils.ctx.font = oldFont;
        return textm;
    }
    TextUtils.measureTextMetrics = measureTextMetrics;
    function metricsToDim2(metrics) {
        return {
            "width": Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight),
            "height": Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent)
        };
    }
    TextUtils.metricsToDim2 = metricsToDim2;
    function measureTextHeight(text, font) {
        const metrics = measureTextMetrics(text, font);
        return Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
    }
    TextUtils.measureTextHeight = measureTextHeight;
    function measureTextWidth(text, font) {
        const metrics = measureTextMetrics(text, font);
        return Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
    }
    TextUtils.measureTextWidth = measureTextWidth;
    function prefixSpacing(text, prefix, length) {
        if (text.length >= length)
            return text;
        return prefix.repeat(length - text.length) + text;
    }
    TextUtils.prefixSpacing = prefixSpacing;
    function suffixSpacing(text, suffix, length) {
        if (text.length >= length)
            return text;
        return text + suffix.repeat(length - text.length);
    }
    TextUtils.suffixSpacing = suffixSpacing;
    function wrapText(text, maxWidth, font) {
        const words = text.split(" ");
        let lines = [];
        let line = words[0];
        for (var i = 1; i < words.length; i++) {
            const word = words[i];
            const width = measureTextWidth(text, font);
            if (width < maxWidth) {
                line += " " + word;
            }
            else {
                lines.push(line);
                line = word;
            }
        }
        lines.push(line);
        return lines;
    }
    TextUtils.wrapText = wrapText;
})(TextUtils = exports.TextUtils || (exports.TextUtils = {}));
var Utils;
(function (Utils) {
    /**
     * @deprecated
     */
    function setMouseCursor(cursorSource = "default") {
        document.body.style.cursor = cursorSource || "default";
    }
    Utils.setMouseCursor = setMouseCursor;
})(Utils = exports.Utils || (exports.Utils = {}));
var MathUtils;
(function (MathUtils) {
    function clamp(n, min = 0, max = 1) {
        return Math.max(min, Math.min(n, max));
    }
    MathUtils.clamp = clamp;
    function wrapClamp(n, min = 0, max = 1) {
        return (n % ((max + 1) + min)) - min;
    }
    MathUtils.wrapClamp = wrapClamp;
    function between(n, min, max) {
        return n >= min && n <= max;
    }
    MathUtils.between = between;
    function normalize(n, max = 1, min = 0) {
        return (n - min) / (max - min);
    }
    MathUtils.normalize = normalize;
    function remapRange(n, from1, to1, from2, to2) {
        return (n - from1) / (to1 - from1) * (to2 - from2) + from2;
    }
    MathUtils.remapRange = remapRange;
    function isPositionOnLine(pos, linePos1, linePos2, fault = 1) {
        const posFromLinePoints = pos.distanceTo(linePos1) + pos.distanceTo(linePos2);
        const lineLength = linePos1.distanceTo(linePos2);
        return between(posFromLinePoints, lineLength - fault, lineLength + fault);
    }
    MathUtils.isPositionOnLine = isPositionOnLine;
    function isLineIntersectingLine(lp1, lp2, lp3, lp4) {
        let a = lp1.x, b = lp1.y, c = lp2.x, d = lp2.y;
        let p = lp3.x, q = lp3.y, r = lp4.x, s = lp4.y;
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        }
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
    MathUtils.isLineIntersectingLine = isLineIntersectingLine;
    function isPointInRectangle(point, rectPos, width, height) {
        return Vector2.between(point, rectPos, Vector2.add(rectPos, new Vector2(width, height)));
    }
    MathUtils.isPointInRectangle = isPointInRectangle;
    function isPointInPolygon(point, polygon, globalWidth, globalHeight) {
        let xIntersections = 0;
        let yIntersections = 0;
        let testLineX = [point, new Vector2(globalWidth, point.y)];
        let testLineY = [point, new Vector2(point.x, globalHeight)];
        polygon.forEach((position, posi) => {
            if (posi == (polygon.length - 1))
                return;
            if (isLineIntersectingLine(testLineX[0], testLineX[1], position, polygon[posi + 1]))
                xIntersections++;
            if (isLineIntersectingLine(testLineY[0], testLineY[1], position, polygon[posi + 1]))
                yIntersections++;
        });
        return (xIntersections % 2 === 1) && (yIntersections % 2 === 1);
    }
    MathUtils.isPointInPolygon = isPointInPolygon;
    function isPointInCircle(point, circle, radius) {
        if (radius === 0)
            return false;
        var dx = circle.x - point.x;
        var dy = circle.y - point.y;
        return dx * dx + dy * dy <= radius;
    }
    MathUtils.isPointInCircle = isPointInCircle;
    function isLineInCircle(lineSegment, circle, radius) {
        let t = new Vector2(0, 0);
        let nearest = new Vector2(0, 0);
        if (isPointInCircle(lineSegment[0], circle, radius) || isPointInCircle(lineSegment[1], circle, radius)) {
            return true;
        }
        let x1 = lineSegment[0].x, y1 = lineSegment[0].y, x2 = lineSegment[1].x, y2 = lineSegment[1].y, cx = circle.x, cy = circle.y;
        let dx = x2 - x1;
        let dy = y2 - y1;
        let lcx = cx - x1;
        let lcy = cy - y1;
        let dLen2 = dx * dx + dy * dy;
        let px = dx;
        let py = dy;
        if (dLen2 > 0) {
            let dp = (lcx * dx + lcy * dy) / dLen2;
            px *= dp;
            py *= dp;
        }
        if (!nearest)
            nearest = t;
        nearest.x = x1 + px;
        nearest.y = y1 + py;
        let pLen2 = px * px + py * py;
        return isPointInCircle(nearest, circle, radius) && pLen2 <= dLen2 && (px * dx + py * dy) >= 0;
    }
    MathUtils.isLineInCircle = isLineInCircle;
    function safeDivide(a, b) {
        return isFinite(a / b) ? a / b : 0;
    }
    MathUtils.safeDivide = safeDivide;
})(MathUtils = exports.MathUtils || (exports.MathUtils = {}));
class QuadraticBezier {
}
exports.QuadraticBezier = QuadraticBezier;
class CubicBezier {
    constructor(start, controlPoint1, controlPoint2, end) {
        this._arclength = 0;
        this._lut = new Map();
        this._segmentation = 30;
        this._start = start;
        this._controlPoint1 = controlPoint1;
        this._controlPoint2 = controlPoint2;
        this._end = end;
        this.refactor();
    }
    set start(vector) {
        this._start = vector;
        this.refactor();
    }
    set controlPoint1(vector) {
        this._controlPoint1 = vector;
        this.refactor();
    }
    set controlPoint2(vector) {
        this._controlPoint2 = vector;
        this.refactor();
    }
    set end(vector) {
        this._end = vector;
        this.refactor();
    }
    set segmentation(segments) {
        this._segmentation = segments;
        this.refactor();
    }
    get start() { return this._start; }
    get controlPoint1() { return this._controlPoint1; }
    get controlPoint2() { return this._controlPoint2; }
    get end() { return this._end; }
    get arclength() { return this._arclength; }
    get segmentation() { return this._segmentation; }
    refactor() {
        this._arclength = BezierUtils.ArcLength.cubic(this._start, this._controlPoint1, this._controlPoint2, this._end, this._segmentation);
        void this._lut;
        // this._lut = BezierUtils.Parameterize.cubic(this._start, this._controlPoint1, this._controlPoint2, this._end, 1 / this._segmentation);
    }
}
exports.CubicBezier = CubicBezier;
var BezierUtils;
(function (BezierUtils) {
    let Parameterize;
    (function (Parameterize) {
        function quadratic(start, control, end, steps = 0.05) {
            let arclength = 0;
            let lut = new Map();
            for (let t = 0; t < 1; t += steps) {
                const px1 = BezierUtils.quadratic(start.x, control.x, end.x, t);
                const py1 = BezierUtils.quadratic(start.y, control.y, end.y, t);
                const px2 = BezierUtils.quadratic(start.x, control.x, end.x, t + steps);
                const py2 = BezierUtils.quadratic(start.y, control.y, end.y, t + steps);
                arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
                t += steps;
                lut.set(t, arclength);
            }
            const px1 = BezierUtils.quadratic(start.x, control.x, end.x, 1 - steps);
            const py1 = BezierUtils.quadratic(start.y, control.y, end.y, 1 - steps);
            const px2 = BezierUtils.quadratic(start.x, control.x, end.x, 1);
            const py2 = BezierUtils.quadratic(start.y, control.y, end.y, 1);
            arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
            lut.set(1, arclength);
            return lut;
        }
        Parameterize.quadratic = quadratic;
        function cubic(start, control1, control2, end, steps = 0.05) {
            let arclength = 0;
            let lut = new Map();
            for (let t = 0; t < 1; t += steps) {
                const px1 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t);
                const py1 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t);
                const px2 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t + steps);
                const py2 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t + steps);
                arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
                t += steps;
                lut.set(t, arclength);
            }
            const px1 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, 1 - steps);
            const py1 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, 1 - steps);
            const px2 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, 1);
            const py2 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, 1);
            arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
            lut.set(1, arclength);
            return lut;
        }
        Parameterize.cubic = cubic;
    })(Parameterize = BezierUtils.Parameterize || (BezierUtils.Parameterize = {}));
    let ArcLength;
    (function (ArcLength) {
        function quadratic(start, control, end, segments = 30) {
            let arclength = 0;
            for (let i = 0; i < segments - 1; i++) {
                const t1 = i / segments;
                const t2 = (i + 1) / segments;
                const px1 = BezierUtils.quadratic(start.x, control.x, end.x, t1);
                const py1 = BezierUtils.quadratic(start.y, control.y, end.y, t1);
                const px2 = BezierUtils.quadratic(start.x, control.x, end.x, t2);
                const py2 = BezierUtils.quadratic(start.y, control.y, end.y, t2);
                arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
            }
            return arclength;
        }
        ArcLength.quadratic = quadratic;
        function cubic(start, control1, control2, end, segments = 30) {
            let arclength = 0;
            for (let i = 0; i < segments - 1; i++) {
                const t1 = i / segments;
                const t2 = (i + 1) / segments;
                const px1 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t1);
                const py1 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t1);
                const px2 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t2);
                const py2 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t2);
                arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
            }
            return arclength;
        }
        ArcLength.cubic = cubic;
    })(ArcLength = BezierUtils.ArcLength || (BezierUtils.ArcLength = {}));
    function linear(start, end, t) {
        return start + (end - start) * t;
    }
    BezierUtils.linear = linear;
    function quadratic(start, control, end, t) {
        return Math.pow(1 - t, 2) * start + 2 * t * (1 - t) * control + Math.pow(t, 2) * end;
    }
    BezierUtils.quadratic = quadratic;
    function cubic(start, control1, control2, end, t) {
        return Math.pow(1 - t, 3) * start + 3 * Math.pow(1 - t, 2) * t * control1 + 3 * (1 - t) * Math.pow(t, 2) * control2 + Math.pow(t, 3) * end;
    }
    BezierUtils.cubic = cubic;
})(BezierUtils = exports.BezierUtils || (exports.BezierUtils = {}));
var LerpUtils;
(function (LerpUtils) {
    class Lerper {
        constructor(lerpFunction, from, to, duration, clamped = true) {
            this.lerpFunction = lerpFunction;
            this.from = from;
            this.to = to;
            this.duration = duration;
            this.clamped = clamped;
            this.startTime = Date.now();
        }
        value(currentTime = Date.now()) {
            if (this.clamped)
                return lerp(this.from, this.to, MathUtils.clamp((currentTime - this.startTime) / this.duration), this.lerpFunction);
            else
                return lerp(this.from, this.to, (currentTime - this.startTime) / this.duration, this.lerpFunction);
        }
        tValue(t) {
            if (this.clamped)
                return lerp(this.from, this.to, MathUtils.clamp(t), this.lerpFunction);
            else
                return lerp(this.from, this.to, t, this.lerpFunction);
        }
        reset() {
            this.startTime = Date.now();
        }
        get done() {
            return (this.startTime + this.duration) < Date.now();
        }
    }
    LerpUtils.Lerper = Lerper;
    class LerpedValue {
        constructor(from, to, rate, func) {
            this._time = 0;
            this.rate = rate;
            this._from = from;
            this._to = to;
            this._time = 0;
            this._lerpFunction = func;
        }
        get value() {
            return lerp(this._from, this._to, this._time, this._lerpFunction);
        }
        tick() {
            this._time += this.rate;
        }
    }
    LerpUtils.LerpedValue = LerpedValue;
    function lerp(from, to, time, f = Functions.Linear) {
        return BezierUtils.linear(from, to, f(time));
    }
    LerpUtils.lerp = lerp;
    function vector(from, to, time, f = Functions.Linear) {
        return new Vector2(lerp(from.x, to.x, time, f), lerp(from.y, to.y, time, f));
    }
    LerpUtils.vector = vector;
    let Functions;
    (function (Functions) {
        Functions.Linear = x => x;
        Functions.Reverse = x => 1 - x;
        Functions.EaseIn = x => x * x;
        Functions.EaseOut = x => Functions.Reverse(Functions.EaseIn(Functions.Reverse(x)));
        Functions.EaseInOut = x => x * x * (3 - 2 * x);
        Functions.Spike = x => Math.min(2 * x, 2 * Functions.Reverse(x));
        Functions.SmoothSpike = x => 4 * x * Functions.Reverse(x);
    })(Functions = LerpUtils.Functions || (LerpUtils.Functions = {}));
})(LerpUtils = exports.LerpUtils || (exports.LerpUtils = {}));
var Color;
(function (Color) {
    function rbgToHex(red, blue, green) {
        return `#${TextUtils.prefixSpacing(red.toString(16), "0", 2)}${TextUtils.prefixSpacing(blue.toString(16), "0", 2)}${TextUtils.prefixSpacing(green.toString(16), "0", 2)}`;
    }
    Color.rbgToHex = rbgToHex;
    function rbgaToHex(red, blue, green, alpha) {
        return `#${TextUtils.prefixSpacing(red.toString(16), "0", 2)}${TextUtils.prefixSpacing(blue.toString(16), "0", 2)}${TextUtils.prefixSpacing(green.toString(16), "0", 2)}${TextUtils.prefixSpacing((Math.round(255 * alpha)).toString(16), "0", 2)}`;
    }
    Color.rbgaToHex = rbgaToHex;
    class RGB {
        constructor(red, green, blue) {
            this.red = red;
            this.green = green;
            this.blue = blue;
        }
        toHex() {
            const space = (str) => TextUtils.prefixSpacing(str, "0", 2);
            return new Hex(`#${space(this.red.toString(16))}${space(this.green.toString(16))}${space(this.blue.toString(16))}`);
        }
        toString() {
            return `rgb(${this.red}, ${this.green}, ${this.blue})`;
        }
        clone() {
            return new RGB(this.red, this.green, this.blue);
        }
    }
    Color.RGB = RGB;
    class Hex {
        constructor(hexadecimal) {
            if (Number.isInteger(hexadecimal)) {
                this._value = +hexadecimal;
            }
            else {
                this._value = parseInt(hexadecimal.toString().substring(1), 16);
            }
        }
        toRGB() {
            const stringified = this.toString();
            return new RGB(parseInt(stringified.substring(1, 3), 16), parseInt(stringified.substring(3, 5), 16), parseInt(stringified.substring(5, 7), 16));
        }
        toString() {
            return `#${TextUtils.prefixSpacing(this._value.toString(16), "0", 6)}`;
        }
        clone() {
            return new Hex(this.toString());
        }
    }
    Color.Hex = Hex;
})(Color = exports.Color || (exports.Color = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map