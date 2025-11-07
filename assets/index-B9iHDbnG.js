var _a;
import { Y as effectScope, r as ref, s as shallowRef, c as computed, e as watch, f as isRef, j as defineComponent, W as h, F as Fragment, g as getCurrentInstance, i as inject, d as onMounted, x as onUnmounted, R as onBeforeMount, J as createVNode, P as Text, k as createElementBlock, B as createBlock, D as resolveDynamicComponent, l as openBlock, y as useAttrs, z as useSlots, C as withCtx, q as mergeProps, u as unref, A as createCommentVNode, m as renderSlot, t as createBaseVNode, a2 as resolveComponent, a8 as useRouter, a9 as defineStore, v as toRef, aa as storeToRefs, n as nextTick, H as withDirectives, I as vShow, ab as vue_runtime_esmBundler, E as withModifiers, a4 as renderList, ac as createRouter, ad as createWebHistory, ae as createApp, af as createPinia } from "./vue-vendor-BOzvWsoI.js";
import { G, a as G$1, F, b as F$1, D, c as D$1, d as F$2, e as G$2, f as F$3, g as G$3, h as F$4, i as G$4, j as G$5, k as G$6, l as G$7, m as F$5, H, I, n as F$6, o as G$8, p as G$9, q as G$a, r as I$1, s as H$1, t as H$2, u as I$2, v as F$7, w as G$b, x as I$3, y as I$4, z as F$8, A as F$9, B as G$c, C as G$d, E as I$5 } from "./icons-C7POaVbu.js";
import { q as normalizeStyle, Q as ElButton, R as ElTooltip, S as ElMessageBox, T as ElNotification, U as ElMessage, P as toDisplayString$1, V as getAugmentedNamespace, W as commonjsGlobal, X as getDefaultExportFromCjs, Y as ElSwitch, Z as ElScrollbar, _ as ElImage, p as normalizeClass, $ as ElContainer, a0 as ElDrawer, a1 as ElMain, a2 as ElButtonGroup, a3 as ElDivider, a4 as ElSlider, a5 as ElInputNumber, a6 as ElSelect, a7 as ElOption } from "./element-plus-LGtjvZX4.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/*!
  * shared v9.14.5
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const inBrowser = typeof window !== "undefined";
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
const assign$1 = Object.assign;
const _create = Object.create;
const create = (obj = null) => _create(obj);
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : create());
};
function escapeHtml(rawText) {
  return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function escapeAttributeValue(value) {
  return value.replace(/&(?![a-zA-Z0-9#]{2,6};)/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function sanitizeTranslatedHtml(html) {
  html = html.replace(/(\w+)\s*=\s*"([^"]*)"/g, (_, attrName, attrValue) => `${attrName}="${escapeAttributeValue(attrValue)}"`);
  html = html.replace(/(\w+)\s*=\s*'([^']*)'/g, (_, attrName, attrValue) => `${attrName}='${escapeAttributeValue(attrValue)}'`);
  const eventHandlerPattern = /\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi;
  if (eventHandlerPattern.test(html)) {
    html = html.replace(/(\s+)(on)(\w+\s*=)/gi, "$1&#111;n$3");
  }
  const javascriptUrlPattern = [
    // In href, src, action, formaction attributes
    /(\s+(?:href|src|action|formaction)\s*=\s*["']?)\s*javascript:/gi,
    // In style attributes within url()
    /(style\s*=\s*["'][^"']*url\s*\(\s*)javascript:/gi
  ];
  javascriptUrlPattern.forEach((pattern) => {
    html = html.replace(pattern, "$1javascript&#58;");
  });
  return html;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => {
  if (!isObject$1(val))
    return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto.constructor === Object;
};
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join$1(items, separator = "") {
  return items.reduce((str, item, index2) => index2 === 0 ? str + item : str + separator + item, "");
}
function incrementer(code2) {
  let current = code2;
  return () => ++current;
}
const isNotObjectOrIsArray = (val) => !isObject$1(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error("Invalid value");
  }
  const stack = [{ src, des }];
  while (stack.length) {
    const { src: src2, des: des2 } = stack.pop();
    Object.keys(src2).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isObject$1(src2[key]) && !isObject$1(des2[key])) {
        des2[key] = Array.isArray(src2[key]) ? [] : create();
      }
      if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
        des2[key] = src2[key];
      } else {
        stack.push({ src: src2[key], des: des2[key] });
      }
    });
  }
}
/*!
  * message-compiler v9.14.5
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  return loc;
}
const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g;
function format$1(message, ...args) {
  if (args.length === 1 && isObject(args[0])) {
    args = args[0];
  }
  if (!args || !args.hasOwnProperty) {
    args = {};
  }
  return message.replace(RE_ARGS, (match, identifier) => {
    return args.hasOwnProperty(identifier) ? args[identifier] : "";
  });
}
const assign = Object.assign;
const isString = (val) => typeof val === "string";
const isObject = (val) => val !== null && typeof val === "object";
function join(items, separator = "") {
  return items.reduce((str, item, index2) => index2 === 0 ? str + item : str + separator + item, "");
}
const CompileWarnCodes = {
  USE_MODULO_SYNTAX: 1,
  __EXTEND_POINT__: 2
};
const warnMessages = {
  [CompileWarnCodes.USE_MODULO_SYNTAX]: `Use modulo before '{{0}}'.`
};
function createCompileWarn(code2, loc, ...args) {
  const msg = format$1(warnMessages[code2], ...args || []);
  const message = { message: String(msg), code: code2 };
  if (loc) {
    message.location = loc;
  }
  return message;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  // generator error codes
  UNHANDLED_CODEGEN_NODE_TYPE: 15,
  // minifier error codes
  UNHANDLED_MINIFIER_NODE_TYPE: 16,
  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__: 17
};
const errorMessages = {
  // tokenizer error messages
  [CompileErrorCodes.EXPECTED_TOKEN]: `Expected token: '{0}'`,
  [CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER]: `Invalid token in placeholder: '{0}'`,
  [CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: `Unterminated single quote in placeholder`,
  [CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE]: `Unknown escape sequence: \\{0}`,
  [CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE]: `Invalid unicode escape sequence: {0}`,
  [CompileErrorCodes.UNBALANCED_CLOSING_BRACE]: `Unbalanced closing brace`,
  [CompileErrorCodes.UNTERMINATED_CLOSING_BRACE]: `Unterminated closing brace`,
  [CompileErrorCodes.EMPTY_PLACEHOLDER]: `Empty placeholder`,
  [CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER]: `Not allowed nest placeholder`,
  [CompileErrorCodes.INVALID_LINKED_FORMAT]: `Invalid linked format`,
  // parser error messages
  [CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL]: `Plural must have messages`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER]: `Unexpected empty linked modifier`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY]: `Unexpected empty linked key`,
  [CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS]: `Unexpected lexical analysis in token: '{0}'`,
  // generator error messages
  [CompileErrorCodes.UNHANDLED_CODEGEN_NODE_TYPE]: `unhandled codegen node type: '{0}'`,
  // minimizer error messages
  [CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE]: `unhandled mimifier node type: '{0}'`
};
function createCompileError(code2, loc, options = {}) {
  const { domain, messages, args } = options;
  const msg = format$1((messages || errorMessages)[code2] || "", ...args || []);
  const error = new SyntaxError(String(msg));
  error.code = code2;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index3) => _buf[index3] === CHAR_CR && _buf[index3 + 1] === CHAR_LF;
  const isLF = (index3) => _buf[index3] === CHAR_LF;
  const isPS = (index3) => _buf[index3] === CHAR_PS;
  const isLS = (index3) => _buf[index3] === CHAR_LS;
  const isLineEnd = (index3) => isCRLF(index3) || isLF(index3) || isPS(index3) || isLS(index3);
  const index2 = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index: index2,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location2 = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 14,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 14,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code2, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = location2 ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code2, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location2) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    14
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 8 || currentType === 12)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 10) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "%" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isTextStart(scnr, false);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function detectModuloStart(scnr) {
    const spaces = peekSpaces(scnr);
    const ret = scnr.currentPeek() === "%" && scnr.peek() === "{";
    scnr.resetPeek();
    return {
      isModulo: ret,
      hasSpace: spaces.length > 0
    };
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "", detectModulo = false) => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return prev === "%" ? false : hasSpace;
      } else if (ch === "@" || !ch) {
        return prev === "%" ? true : hasSpace;
      } else if (ch === "%") {
        scnr.peek();
        return fn(hasSpace, "%", true);
      } else if (ch === "|") {
        return prev === "%" || detectModulo ? true : !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP, detectModulo);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF, detectModulo);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function isIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36;
  }
  function takeIdentifierChar(scnr) {
    return takeChar(scnr, isIdentifier);
  }
  function isNamedIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36 || // $
    cc === 45;
  }
  function takeNamedIdentifierChar(scnr) {
    return takeChar(scnr, isNamedIdentifier);
  }
  function isDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function takeDigit(scnr) {
    return takeChar(scnr, isDigit);
  }
  function isHexDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57 || // 0-9
    cc >= 65 && cc <= 70 || // A-F
    cc >= 97 && cc <= 102;
  }
  function takeHexDigit(scnr) {
    return takeChar(scnr, isHexDigit);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readModulo(scnr) {
    skipSpaces(scnr);
    const ch = scnr.currentChar();
    if (ch !== "%") {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
    }
    scnr.next();
    return "%";
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === "%") {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else {
          break;
        }
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeNamedIdentifierChar(scnr)) {
      name += ch;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function isLiteral2(ch) {
    return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    while (ch = takeChar(scnr, isLiteral2)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function isInvalidIdentifier(ch) {
    return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    while (ch = takeChar(scnr, isInvalidIdentifier)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn = (buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "%" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn(buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(buf);
      }
    };
    return fn("");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default: {
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 5 || context2.currentType === 6 || context2.currentType === 7)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 6, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 7, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 13, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
      }
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 8 || currentType === 9 || currentType === 12 || currentType === 10) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          8,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          10,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 12, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 11, readLinkedRefer(scnr));
          }
        }
        if (currentType === 8) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 14
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        const { isModulo, hasSpace } = detectModuloStart(scnr);
        if (isModulo) {
          return hasSpace ? getToken(context2, 0, readText(scnr)) : getToken(context2, 4, readModulo(scnr));
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
      }
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        14
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location2 = options.location !== false;
  const { onError, onWarn } = options;
  function emitError(tokenzer, code2, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = location2 ? createLocation(start, end) : null;
      const err = createCompileError(code2, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function emitWarn(tokenzer, code2, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onWarn) {
      const loc = location2 ? createLocation(start, end) : null;
      onWarn(createCompileWarn(code2, loc, args));
    }
  }
  function startNode(type, offset, loc) {
    const node = { type };
    if (location2) {
      node.start = offset;
      node.end = offset;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    if (location2) {
      node.end = offset;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index2) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index2, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key, modulo) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    if (modulo === true) {
      node.modulo = true;
    }
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 12) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 9) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 10) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 11:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 7:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default: {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
      }
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    let modulo = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 4:
          modulo = true;
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || "", !!modulo));
          if (modulo) {
            emitWarn(tokenizer, CompileWarnCodes.USE_MODULO_SYNTAX, context.lastStartLoc, 0, getTokenCaption(token));
            modulo = null;
          }
          break;
        case 7:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 8: {
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
        }
      }
    } while (context.currentType !== 14 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 14);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 14) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location2 && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 14) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 14) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6: {
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c) => optimizeMessageNode(c));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
const ERROR_DOMAIN$1 = "minifier";
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0: {
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    }
    case 1: {
      const plural = node;
      const cases = plural.cases;
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    }
    case 2: {
      const message = node;
      const items = message.items;
      for (let i = 0; i < items.length; i++) {
        minify(items[i]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    }
    case 6: {
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    }
    case 5: {
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    }
    case 4: {
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    }
    default: {
      throw createCompileError(CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE, null, {
        domain: ERROR_DOMAIN$1,
        args: [node.type]
      });
    }
  }
  delete node.type;
}
const ERROR_DOMAIN = "parser";
function createCodeGenerator(ast, options) {
  const { filename, breakLineCode, needIndent: _needIndent } = options;
  const location2 = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location2 && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push(code2, node) {
    _context.code += code2;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
    default: {
      throw createCompileError(CompileErrorCodes.UNHANDLED_CODEGEN_NODE_TYPE, null, {
        domain: ERROR_DOMAIN,
        args: [node.type]
      });
    }
  }
}
const generate = (ast, options = {}) => {
  const mode = isString(options.mode) ? options.mode : "normal";
  const filename = isString(options.filename) ? options.filename : "message.intl";
  !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    filename,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code: code2, map } = generator.context();
  return {
    ast,
    code: code2,
    map: map ? map.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
/*!
  * core-base v9.14.5
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function initFeatureFlags$1() {
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
  if (typeof __INTLIFY_JIT_COMPILATION__ !== "boolean") {
    getGlobalThis().__INTLIFY_JIT_COMPILATION__ = false;
  }
  if (typeof __INTLIFY_DROP_MESSAGE_COMPILER__ !== "boolean") {
    getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false;
  }
}
function isMessageAST(val) {
  return isObject$1(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
}
const PROPS_BODY = ["b", "body"];
function resolveBody(node) {
  return resolveProps(node, PROPS_BODY);
}
const PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
  return resolveProps(node, PROPS_CASES, []);
}
const PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
  return resolveProps(node, PROPS_STATIC);
}
const PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
  return resolveProps(node, PROPS_ITEMS, []);
}
const PROPS_TYPE = ["t", "type"];
function resolveType(node) {
  return resolveProps(node, PROPS_TYPE);
}
const PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type) {
  const resolved = resolveProps(node, PROPS_VALUE);
  if (resolved != null) {
    return resolved;
  } else {
    throw createUnhandleNodeError(type);
  }
}
const PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
  return resolveProps(node, PROPS_MODIFIER);
}
const PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
  const resolved = resolveProps(node, PROPS_KEY);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(
      6
      /* NodeTypes.Linked */
    );
  }
}
function resolveProps(node, props, defaultValue) {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (hasOwn(node, prop) && node[prop] != null) {
      return node[prop];
    }
  }
  return defaultValue;
}
const AST_NODE_PROPS_KEYS = [
  ...PROPS_BODY,
  ...PROPS_CASES,
  ...PROPS_STATIC,
  ...PROPS_ITEMS,
  ...PROPS_KEY,
  ...PROPS_MODIFIER,
  ...PROPS_VALUE,
  ...PROPS_TYPE
];
function createUnhandleNodeError(type) {
  return new Error(`unhandled node type: ${type}`);
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code2 = ch.charCodeAt(0);
  switch (code2) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return ch;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index2 = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index2 + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index2++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index2++;
    c = path[index2];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject$1(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject$1(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const key = hit[i];
    if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) {
      return null;
    }
    const val = last[key];
    if (val === void 0) {
      return null;
    }
    if (isFunction(last)) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join$1(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index2 = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index2 : index2;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject$1(options.pluralRules) && isString$1(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject$1(options.pluralRules) && isString$1(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages) => {
    return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index2) => _list[index2];
  const _named = options.named || create();
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key) {
    const msg = isFunction(options.messages) ? options.messages(key) : isObject$1(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString$1(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject$1(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString$1(arg2)) {
        type2 = arg2 || type2;
      }
    }
    const ret = message(key)(ctx);
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type2 === "vnode" && isArray(ret) && modifier ? ret[0] : ret
    );
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign$1(create(), _list, _named)
  };
  return ctx;
}
let devtools = null;
function setDevToolsHook(hook) {
  devtools = hook;
}
function initI18nDevTools(i18n2, version2, meta) {
  devtools && devtools.emit("i18n:init", {
    timestamp: Date.now(),
    i18n: i18n2,
    version: version2,
    meta
  });
}
const translateDevTools = /* @__PURE__ */ createDevToolsHook(
  "function:translate"
  /* IntlifyDevToolsHooks.FunctionTranslate */
);
function createDevToolsHook(hook) {
  return (payloads) => devtools && devtools.emit(hook, payloads);
}
const code$1$1 = CompileWarnCodes.__EXTEND_POINT__;
const inc$1$1 = incrementer(code$1$1);
const CoreWarnCodes = {
  // 2
  FALLBACK_TO_TRANSLATE: inc$1$1(),
  // 3
  CANNOT_FORMAT_NUMBER: inc$1$1(),
  // 4
  FALLBACK_TO_NUMBER_FORMAT: inc$1$1(),
  // 5
  CANNOT_FORMAT_DATE: inc$1$1(),
  // 6
  FALLBACK_TO_DATE_FORMAT: inc$1$1(),
  // 7
  EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: inc$1$1(),
  // 8
  __EXTEND_POINT__: inc$1$1()
  // 9
};
const code$2 = CompileErrorCodes.__EXTEND_POINT__;
const inc$2 = incrementer(code$2);
const CoreErrorCodes = {
  INVALID_ARGUMENT: code$2,
  // 17
  INVALID_DATE_ARGUMENT: inc$2(),
  // 18
  INVALID_ISO_DATE_ARGUMENT: inc$2(),
  // 19
  NOT_SUPPORT_NON_STRING_MESSAGE: inc$2(),
  // 20
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: inc$2(),
  // 21
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: inc$2(),
  // 22
  NOT_SUPPORT_LOCALE_TYPE: inc$2(),
  // 23
  __EXTEND_POINT__: inc$2()
  // 24
};
function createCoreError(code2) {
  return createCompileError(code2, null, void 0);
}
function getLocale(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  if (isString$1(locale)) {
    return locale;
  } else {
    if (isFunction(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale;
      } else if (locale.constructor.name === "Function") {
        const resolve = locale();
        if (isPromise(resolve)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
        }
        return _resolveLocale = resolve;
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
    }
  }
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray(fallback) ? fallback : isObject$1(fallback) ? Object.keys(fallback) : isString$1(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString$1(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults2 = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString$1(defaults2) ? [defaults2] : defaults2;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString$1(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const VERSION$1 = "9.14.5";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize$1 = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString$1(val) ? val.toUpperCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString$1(val) ? val.toLowerCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString$1(val) ? capitalize$1(val) : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? capitalize$1(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
let _additionalMeta = null;
const setAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ (meta) => {
  _additionalMeta = meta;
};
const getAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ () => _additionalMeta;
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
  const version2 = isString$1(options.version) ? options.version : VERSION$1;
  const locale = isString$1(options.locale) || isFunction(options.locale) ? options.locale : DEFAULT_LOCALE;
  const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString$1(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages = isPlainObject(options.messages) ? options.messages : createResources(_locale);
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : createResources(_locale);
  const modifiers = assign$1(create(), options.modifiers, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || create();
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject$1(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject$1(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$1(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$1(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version: version2,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  if (__INTLIFY_PROD_DEVTOOLS__) {
    initI18nDevTools(context, version2, __meta);
  }
  return context;
}
const createResources = (locale) => ({ [locale]: create() });
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString$1(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function isAlmostSameLocale(locale, compareLocale) {
  if (locale === compareLocale)
    return false;
  return locale.split("-")[0] === compareLocale.split("-")[0];
}
function isImplicitFallback(targetLocale, locales) {
  const index2 = locales.indexOf(targetLocale);
  if (index2 === -1) {
    return false;
  }
  for (let i = index2 + 1; i < locales.length; i++) {
    if (isAlmostSameLocale(targetLocale, locales[i])) {
      return true;
    }
  }
  return false;
}
function format(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = resolveBody(ast);
  if (body == null) {
    throw createUnhandleNodeError(
      0
      /* NodeTypes.Resource */
    );
  }
  const type = resolveType(body);
  if (type === 1) {
    const plural = body;
    const cases = resolveCases(plural);
    return ctx.plural(cases.reduce((messages, c) => [
      ...messages,
      formatMessageParts(ctx, c)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
function formatMessageParts(ctx, node) {
  const static_ = resolveStatic(node);
  if (static_ != null) {
    return ctx.type === "text" ? static_ : ctx.normalize([static_]);
  } else {
    const messages = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
    return ctx.normalize(messages);
  }
}
function formatMessagePart(ctx, node) {
  const type = resolveType(node);
  switch (type) {
    case 3: {
      return resolveValue$1(node, type);
    }
    case 9: {
      return resolveValue$1(node, type);
    }
    case 4: {
      const named = node;
      if (hasOwn(named, "k") && named.k) {
        return ctx.interpolate(ctx.named(named.k));
      }
      if (hasOwn(named, "key") && named.key) {
        return ctx.interpolate(ctx.named(named.key));
      }
      throw createUnhandleNodeError(type);
    }
    case 5: {
      const list = node;
      if (hasOwn(list, "i") && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i));
      }
      if (hasOwn(list, "index") && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index));
      }
      throw createUnhandleNodeError(type);
    }
    case 6: {
      const linked = node;
      const modifier = resolveLinkedModifier(linked);
      const key = resolveLinkedKey(linked);
      return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    }
    case 7: {
      return resolveValue$1(node, type);
    }
    case 8: {
      return resolveValue$1(node, type);
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`);
  }
}
const defaultOnCacheKey = (message) => message;
let compileCache = create();
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
const compileToFunction = /* @__NO_SIDE_EFFECTS__ */ (message, context) => {
  if (!isString$1(message)) {
    throw createCoreError(CoreErrorCodes.NOT_SUPPORT_NON_STRING_MESSAGE);
  }
  {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { code: code2, detectError } = baseCompile(message, context);
    const msg = new Function(`return ${code2}`)();
    return !detectError ? compileCache[cacheKey] = msg : msg;
  }
};
function compile(message, context) {
  if (__INTLIFY_JIT_COMPILATION__ && !__INTLIFY_DROP_MESSAGE_COMPILER__ && isString$1(message)) {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: false,
      jit: true
    });
    const msg = format(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format(message);
    } else {
      return format(message);
    }
  }
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString$1(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : "";
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== "";
  const locale = getLocale(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages[locale] || create()
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString$1(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  let ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (escapeParameter && isString$1(ret)) {
    ret = sanitizeTranslatedHtml(ret);
  }
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const payloads = {
      timestamp: Date.now(),
      key: isString$1(key) ? key : isMessageFunction(format2) ? format2.key : "",
      locale: targetLocale || (isMessageFunction(format2) ? format2.locale : ""),
      format: isString$1(format2) ? format2 : isMessageFunction(format2) ? format2.source : "",
      message: ret
    };
    payloads.meta = assign$1({}, context.__meta, /* @__PURE__ */ getAdditionalMeta() || {});
    translateDevTools(payloads);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString$1(item) ? escapeHtml(item) : item);
  } else if (isObject$1(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString$1(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = create();
  let targetLocale;
  let format2 = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    message = messages[targetLocale] || create();
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(
        context,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type
      );
      if (missingRet !== key) {
        format2 = missingRet;
      }
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = () => format2;
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = create();
  if (!isString$1(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString$1(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString$1(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign$1(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key) => {
    let val = resolveValue2(message, key);
    if (val == null && fallbackContext) {
      const [, , message2] = resolveMessageFormat(fallbackContext, key, locale, fallbackLocale, fallbackWarn, missingWarn);
      val = resolveValue2(message2, key);
    }
    if (isString$1(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign$1({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  let value;
  if (isString$1(arg1)) {
    const matches2 = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches2) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches2[3] ? matches2[3].trim().startsWith("T") ? `${matches2[1].trim()}${matches2[3].trim()}` : `${matches2[1].trim()}T${matches2[3].trim()}` : matches2[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch (e) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign$1({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
{
  initFeatureFlags$1();
}
/*!
  * vue-i18n v9.14.5
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
const VERSION = "9.14.5";
function initFeatureFlags() {
  if (typeof __VUE_I18N_FULL_INSTALL__ !== "boolean") {
    getGlobalThis().__VUE_I18N_FULL_INSTALL__ = true;
  }
  if (typeof __VUE_I18N_LEGACY_API__ !== "boolean") {
    getGlobalThis().__VUE_I18N_LEGACY_API__ = true;
  }
  if (typeof __INTLIFY_JIT_COMPILATION__ !== "boolean") {
    getGlobalThis().__INTLIFY_JIT_COMPILATION__ = false;
  }
  if (typeof __INTLIFY_DROP_MESSAGE_COMPILER__ !== "boolean") {
    getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false;
  }
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
const code$1 = CoreWarnCodes.__EXTEND_POINT__;
const inc$1 = incrementer(code$1);
({
  // 9
  NOT_SUPPORTED_PRESERVE: inc$1(),
  // 10
  NOT_SUPPORTED_FORMATTER: inc$1(),
  // 11
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: inc$1(),
  // 12
  NOT_SUPPORTED_GET_CHOICE_INDEX: inc$1(),
  // 13
  COMPONENT_NAME_LEGACY_COMPATIBLE: inc$1(),
  // 14
  NOT_FOUND_PARENT_SCOPE: inc$1(),
  // 15
  IGNORE_OBJ_FLATTEN: inc$1(),
  // 16
  NOTICE_DROP_ALLOW_COMPOSITION: inc$1(),
  // 17
  NOTICE_DROP_TRANSLATE_EXIST_COMPATIBLE_FLAG: inc$1()
  // 18
});
const code = CoreErrorCodes.__EXTEND_POINT__;
const inc = incrementer(code);
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: code,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: inc(),
  // 25
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: inc(),
  // 26
  NOT_INSTALLED: inc(),
  // 27
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(),
  // 28
  // directive module errors
  REQUIRED_VALUE: inc(),
  // 29
  INVALID_VALUE: inc(),
  // 30
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(),
  // 31
  NOT_INSTALLED_WITH_PROVIDE: inc(),
  // 32
  // unexpected error
  UNEXPECTED_ERROR: inc(),
  // 33
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(),
  // 34
  // bridge support vue 2.x only
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(),
  // 35
  // need to define `i18n` option in `allowComposition: true` and `useScope: 'local' at `useI18n``
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(),
  // 36
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(),
  // 37
  // for enhancement
  __EXTEND_POINT__: inc()
  // 38
};
function createI18nError(code2, ...args) {
  return createCompileError(code2, null, void 0);
}
const TranslateVNodeSymbol = /* @__PURE__ */ makeSymbol("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
const InejctWithOptionSymbol = /* @__PURE__ */ makeSymbol("__injectWithOption");
const DisposeSymbol = /* @__PURE__ */ makeSymbol("__dispose");
function handleFlatJson(obj) {
  if (!isObject$1(obj)) {
    return obj;
  }
  if (isMessageAST(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject$1(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      let hasStringValue = false;
      for (let i = 0; i < lastIndex; i++) {
        if (subKeys[i] === "__proto__") {
          throw new Error(`unsafe key: ${subKeys[i]}`);
        }
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = create();
        }
        if (!isObject$1(currentObj[subKeys[i]])) {
          hasStringValue = true;
          break;
        }
        currentObj = currentObj[subKeys[i]];
      }
      if (!hasStringValue) {
        if (!isMessageAST(currentObj)) {
          currentObj[subKeys[lastIndex]] = obj[key];
          delete obj[key];
        } else {
          if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
            delete obj[key];
          }
        }
      }
      if (!isMessageAST(currentObj)) {
        const target = currentObj[subKeys[lastIndex]];
        if (isObject$1(target)) {
          handleFlatJson(target);
        }
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages) ? messages : isArray(__i18n) ? create() : { [locale]: create() };
  if (isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || create();
          deepCopy(resource, ret[locale2]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString$1(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
  let messages = isObject$1(options.messages) ? options.messages : create();
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(gl.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      gl.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (isObject$1(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject$1(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
const NOOP_RETURN_ARRAY = () => [];
const NOOP_RETURN_FALSE = () => false;
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  };
}
const getMetaInfo = /* @__NO_SIDE_EFFECTS__ */ () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}, VueI18nLegacy) {
  const { __root, __injectWithOption } = options;
  const _isGlobal = __root === void 0;
  const flatJson = options.flatJson;
  const _ref = inBrowser ? ref : shallowRef;
  const translateExistCompatible = !!options.translateExistCompatible;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString$1(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString$1(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = _ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = _ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = _ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    try {
      if (__INTLIFY_PROD_DEVTOOLS__) {
        /* @__PURE__ */ setAdditionalMeta(/* @__PURE__ */ getMetaInfo());
      }
      if (!_isGlobal) {
        _context.fallbackContext = __root ? getFallbackContext() : void 0;
      }
      ret = fn(_context);
    } finally {
      if (__INTLIFY_PROD_DEVTOOLS__) ;
      if (!_isGlobal) {
        _context.fallbackContext = void 0;
      }
    }
    if (warnType !== "translate exists" && // for not `te` (e.g `t`)
    isNumber(ret) && ret === NOT_REOSLVED || warnType === "translate exists" && !ret) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString$1(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject$1(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, assign$1({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function normalize(values) {
    return values.map((val) => isString$1(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps(
      (context) => {
        let ret;
        const _context2 = context;
        try {
          _context2.processor = processor;
          ret = Reflect.apply(translate, null, [_context2, ...args]);
        } finally {
          _context2.processor = null;
        }
        return ret;
      },
      () => parseTranslateArgs(...args),
      "translate",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[TranslateVNodeSymbol](...args),
      (key) => [createTextNode(key)],
      (val) => isArray(val)
    );
  }
  function numberParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(number, null, [context, ...args]),
      () => parseNumberArgs(...args),
      "number format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[NumberPartsSymbol](...args),
      NOOP_RETURN_ARRAY,
      (val) => isString$1(val) || isArray(val)
    );
  }
  function datetimeParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(datetime, null, [context, ...args]),
      () => parseDateTimeArgs(...args),
      "datetime format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[DatetimePartsSymbol](...args),
      NOOP_RETURN_ARRAY,
      (val) => isString$1(val) || isArray(val)
    );
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    return wrapWithDeps(() => {
      if (!key) {
        return false;
      }
      const targetLocale = isString$1(locale2) ? locale2 : _locale.value;
      const message = getLocaleMessage(targetLocale);
      const resolved = _context.messageResolver(message, key);
      return !translateExistCompatible ? isMessageAST(resolved) || isMessageFunction(resolved) || isString$1(resolved) : resolved != null;
    }, () => [key], "translate exists", (root) => {
      return Reflect.apply(root.te, root, [key, locale2]);
    }, NOOP_RETURN_FALSE, (val) => isBoolean(val));
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    if (flatJson) {
      const _message = { [locale2]: message };
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
      message = _message[locale2];
    }
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    const _message = { [locale2]: message };
    if (flatJson) {
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
    }
    message = _message[locale2];
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign$1(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign$1(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  if (__root && inBrowser) {
    watch(__root.locale, (val) => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, (val) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  }
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOptionSymbol] = __injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
function convertComposerOptions(options) {
  const locale = isString$1(options.locale) ? options.locale : DEFAULT_LOCALE;
  const fallbackLocale = isString$1(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const missing = isFunction(options.missing) ? options.missing : void 0;
  const missingWarn = isBoolean(options.silentTranslationWarn) || isRegExp(options.silentTranslationWarn) ? !options.silentTranslationWarn : true;
  const fallbackWarn = isBoolean(options.silentFallbackWarn) || isRegExp(options.silentFallbackWarn) ? !options.silentFallbackWarn : true;
  const fallbackRoot = isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  const fallbackFormat = !!options.formatFallbackMessages;
  const modifiers = isPlainObject(options.modifiers) ? options.modifiers : {};
  const pluralizationRules = options.pluralizationRules;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : void 0;
  const warnHtmlMessage = isString$1(options.warnHtmlInMessage) ? options.warnHtmlInMessage !== "off" : true;
  const escapeParameter = !!options.escapeParameterHtml;
  const inheritLocale = isBoolean(options.sync) ? options.sync : true;
  let messages = options.messages;
  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages;
    const locales = Object.keys(sharedMessages);
    messages = locales.reduce((messages2, locale2) => {
      const message = messages2[locale2] || (messages2[locale2] = {});
      assign$1(message, sharedMessages[locale2]);
      return messages2;
    }, messages || {});
  }
  const { __i18n, __root, __injectWithOption } = options;
  const datetimeFormats = options.datetimeFormats;
  const numberFormats = options.numberFormats;
  const flatJson = options.flatJson;
  const translateExistCompatible = options.translateExistCompatible;
  return {
    locale,
    fallbackLocale,
    messages,
    flatJson,
    datetimeFormats,
    numberFormats,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackRoot,
    fallbackFormat,
    modifiers,
    pluralRules: pluralizationRules,
    postTranslation,
    warnHtmlMessage,
    escapeParameter,
    messageResolver: options.messageResolver,
    inheritLocale,
    translateExistCompatible,
    __i18n,
    __root,
    __injectWithOption
  };
}
function createVueI18n(options = {}, VueI18nLegacy) {
  {
    const composer = createComposer(convertComposerOptions(options));
    const { __extender } = options;
    const vueI18n = {
      // id
      id: composer.id,
      // locale
      get locale() {
        return composer.locale.value;
      },
      set locale(val) {
        composer.locale.value = val;
      },
      // fallbackLocale
      get fallbackLocale() {
        return composer.fallbackLocale.value;
      },
      set fallbackLocale(val) {
        composer.fallbackLocale.value = val;
      },
      // messages
      get messages() {
        return composer.messages.value;
      },
      // datetimeFormats
      get datetimeFormats() {
        return composer.datetimeFormats.value;
      },
      // numberFormats
      get numberFormats() {
        return composer.numberFormats.value;
      },
      // availableLocales
      get availableLocales() {
        return composer.availableLocales;
      },
      // formatter
      get formatter() {
        return {
          interpolate() {
            return [];
          }
        };
      },
      set formatter(val) {
      },
      // missing
      get missing() {
        return composer.getMissingHandler();
      },
      set missing(handler) {
        composer.setMissingHandler(handler);
      },
      // silentTranslationWarn
      get silentTranslationWarn() {
        return isBoolean(composer.missingWarn) ? !composer.missingWarn : composer.missingWarn;
      },
      set silentTranslationWarn(val) {
        composer.missingWarn = isBoolean(val) ? !val : val;
      },
      // silentFallbackWarn
      get silentFallbackWarn() {
        return isBoolean(composer.fallbackWarn) ? !composer.fallbackWarn : composer.fallbackWarn;
      },
      set silentFallbackWarn(val) {
        composer.fallbackWarn = isBoolean(val) ? !val : val;
      },
      // modifiers
      get modifiers() {
        return composer.modifiers;
      },
      // formatFallbackMessages
      get formatFallbackMessages() {
        return composer.fallbackFormat;
      },
      set formatFallbackMessages(val) {
        composer.fallbackFormat = val;
      },
      // postTranslation
      get postTranslation() {
        return composer.getPostTranslationHandler();
      },
      set postTranslation(handler) {
        composer.setPostTranslationHandler(handler);
      },
      // sync
      get sync() {
        return composer.inheritLocale;
      },
      set sync(val) {
        composer.inheritLocale = val;
      },
      // warnInHtmlMessage
      get warnHtmlInMessage() {
        return composer.warnHtmlMessage ? "warn" : "off";
      },
      set warnHtmlInMessage(val) {
        composer.warnHtmlMessage = val !== "off";
      },
      // escapeParameterHtml
      get escapeParameterHtml() {
        return composer.escapeParameter;
      },
      set escapeParameterHtml(val) {
        composer.escapeParameter = val;
      },
      // preserveDirectiveContent
      get preserveDirectiveContent() {
        return true;
      },
      set preserveDirectiveContent(val) {
      },
      // pluralizationRules
      get pluralizationRules() {
        return composer.pluralRules || {};
      },
      // for internal
      __composer: composer,
      // t
      t(...args) {
        const [arg1, arg2, arg3] = args;
        const options2 = {};
        let list = null;
        let named = null;
        if (!isString$1(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }
        const key = arg1;
        if (isString$1(arg2)) {
          options2.locale = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }
        if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        }
        return Reflect.apply(composer.t, composer, [
          key,
          list || named || {},
          options2
        ]);
      },
      rt(...args) {
        return Reflect.apply(composer.rt, composer, [...args]);
      },
      // tc
      tc(...args) {
        const [arg1, arg2, arg3] = args;
        const options2 = { plural: 1 };
        let list = null;
        let named = null;
        if (!isString$1(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }
        const key = arg1;
        if (isString$1(arg2)) {
          options2.locale = arg2;
        } else if (isNumber(arg2)) {
          options2.plural = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }
        if (isString$1(arg3)) {
          options2.locale = arg3;
        } else if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        }
        return Reflect.apply(composer.t, composer, [
          key,
          list || named || {},
          options2
        ]);
      },
      // te
      te(key, locale) {
        return composer.te(key, locale);
      },
      // tm
      tm(key) {
        return composer.tm(key);
      },
      // getLocaleMessage
      getLocaleMessage(locale) {
        return composer.getLocaleMessage(locale);
      },
      // setLocaleMessage
      setLocaleMessage(locale, message) {
        composer.setLocaleMessage(locale, message);
      },
      // mergeLocaleMessage
      mergeLocaleMessage(locale, message) {
        composer.mergeLocaleMessage(locale, message);
      },
      // d
      d(...args) {
        return Reflect.apply(composer.d, composer, [...args]);
      },
      // getDateTimeFormat
      getDateTimeFormat(locale) {
        return composer.getDateTimeFormat(locale);
      },
      // setDateTimeFormat
      setDateTimeFormat(locale, format2) {
        composer.setDateTimeFormat(locale, format2);
      },
      // mergeDateTimeFormat
      mergeDateTimeFormat(locale, format2) {
        composer.mergeDateTimeFormat(locale, format2);
      },
      // n
      n(...args) {
        return Reflect.apply(composer.n, composer, [...args]);
      },
      // getNumberFormat
      getNumberFormat(locale) {
        return composer.getNumberFormat(locale);
      },
      // setNumberFormat
      setNumberFormat(locale, format2) {
        composer.setNumberFormat(locale, format2);
      },
      // mergeNumberFormat
      mergeNumberFormat(locale, format2) {
        composer.mergeNumberFormat(locale, format2);
      },
      // getChoiceIndex
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getChoiceIndex(choice, choicesLength) {
        return -1;
      }
    };
    vueI18n.__extender = __extender;
    return vueI18n;
  }
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return [
        ...slot,
        // prettier-ignore
        ...current.type === Fragment ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, create());
  }
}
function getFragmentableTag(tag) {
  return Fragment;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-t",
  props: assign$1({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n2 = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter((key) => key !== "_");
      const options = create();
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString$1(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n2[TranslateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign$1(create(), attrs);
      const tag = isString$1(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return isArray(target) && !isString$1(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = create();
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString$1(props.format)) {
      options.key = props.format;
    } else if (isObject$1(props.format)) {
      if (isString$1(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign$1(create(), options2, { [prop]: props.format[prop] }) : options2;
      }, create());
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray(parts)) {
      children = parts.map((part, index2) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index: index2, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index2}`;
        }
        return node;
      });
    } else if (isString$1(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign$1(create(), attrs);
    const tag = isString$1(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-n",
  props: assign$1({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n2 = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n2[NumberPartsSymbol](...args)
    ));
  }
});
const NumberFormat = NumberFormatImpl;
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-d",
  props: assign$1({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n2 = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n2[DatetimePartsSymbol](...args)
    ));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
function getComposer$2(i18n2, instance) {
  const i18nInternal = i18n2;
  if (i18n2.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n2.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n2.global.__composer;
  }
}
function vTDirective(i18n2) {
  const _process = (binding) => {
    const { instance, modifiers, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$2(i18n2, instance.$);
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    if (inBrowser && i18n2.global === composer) {
      el.__i18nWatcher = watch(composer.locale, () => {
        binding.instance && binding.instance.$forceUpdate();
      });
    }
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (inBrowser && el.__i18nWatcher) {
      el.__i18nWatcher();
      el.__i18nWatcher = void 0;
      delete el.__i18nWatcher;
    }
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString$1(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString$1(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app2, i18n2, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    [!useI18nComponentName ? Translation.name : "i18n", "I18nT"].forEach((name) => app2.component(name, Translation));
    [NumberFormat.name, "I18nN"].forEach((name) => app2.component(name, NumberFormat));
    [DatetimeFormat.name, "I18nD"].forEach((name) => app2.component(name, DatetimeFormat));
  }
  {
    app2.directive("t", vTDirective(i18n2));
  }
}
function defineMixin(vuei18n, composer, i18n2) {
  return {
    beforeCreate() {
      const instance = getCurrentInstance();
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      const options = this.$options;
      if (options.i18n) {
        const optionsI18n = options.i18n;
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n;
        }
        optionsI18n.__root = composer;
        if (this === this.$root) {
          this.$i18n = mergeToGlobal(vuei18n, optionsI18n);
        } else {
          optionsI18n.__injectWithOption = true;
          optionsI18n.__extender = i18n2.__vueI18nExtend;
          this.$i18n = createVueI18n(optionsI18n);
          const _vueI18n = this.$i18n;
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n);
          }
        }
      } else if (options.__i18n) {
        if (this === this.$root) {
          this.$i18n = mergeToGlobal(vuei18n, options);
        } else {
          this.$i18n = createVueI18n({
            __i18n: options.__i18n,
            __injectWithOption: true,
            __extender: i18n2.__vueI18nExtend,
            __root: composer
          });
          const _vueI18n = this.$i18n;
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n);
          }
        }
      } else {
        this.$i18n = vuei18n;
      }
      if (options.__i18nGlobal) {
        adjustI18nResources(composer, options, options);
      }
      this.$t = (...args) => this.$i18n.t(...args);
      this.$rt = (...args) => this.$i18n.rt(...args);
      this.$tc = (...args) => this.$i18n.tc(...args);
      this.$te = (key, locale) => this.$i18n.te(key, locale);
      this.$d = (...args) => this.$i18n.d(...args);
      this.$n = (...args) => this.$i18n.n(...args);
      this.$tm = (key) => this.$i18n.tm(key);
      i18n2.__setInstance(instance, this.$i18n);
    },
    mounted() {
    },
    unmounted() {
      const instance = getCurrentInstance();
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      const _vueI18n = this.$i18n;
      delete this.$t;
      delete this.$rt;
      delete this.$tc;
      delete this.$te;
      delete this.$d;
      delete this.$n;
      delete this.$tm;
      if (_vueI18n.__disposer) {
        _vueI18n.__disposer();
        delete _vueI18n.__disposer;
        delete _vueI18n.__extender;
      }
      i18n2.__deleteInstance(instance);
      delete this.$i18n;
    }
  };
}
function mergeToGlobal(g, options) {
  g.locale = options.locale || g.locale;
  g.fallbackLocale = options.fallbackLocale || g.fallbackLocale;
  g.missing = options.missing || g.missing;
  g.silentTranslationWarn = options.silentTranslationWarn || g.silentFallbackWarn;
  g.silentFallbackWarn = options.silentFallbackWarn || g.silentFallbackWarn;
  g.formatFallbackMessages = options.formatFallbackMessages || g.formatFallbackMessages;
  g.postTranslation = options.postTranslation || g.postTranslation;
  g.warnHtmlInMessage = options.warnHtmlInMessage || g.warnHtmlInMessage;
  g.escapeParameterHtml = options.escapeParameterHtml || g.escapeParameterHtml;
  g.sync = options.sync || g.sync;
  g.__composer[SetPluralRulesSymbol](options.pluralizationRules || g.pluralizationRules);
  const messages = getLocaleMessages(g.locale, {
    messages: options.messages,
    __i18n: options.__i18n
  });
  Object.keys(messages).forEach((locale) => g.mergeLocaleMessage(locale, messages[locale]));
  if (options.datetimeFormats) {
    Object.keys(options.datetimeFormats).forEach((locale) => g.mergeDateTimeFormat(locale, options.datetimeFormats[locale]));
  }
  if (options.numberFormats) {
    Object.keys(options.numberFormats).forEach((locale) => g.mergeNumberFormat(locale, options.numberFormats[locale]));
  }
  return g;
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __legacyMode = __VUE_I18N_LEGACY_API__ && isBoolean(options.legacy) ? options.legacy : __VUE_I18N_LEGACY_API__;
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __allowComposition = __VUE_I18N_LEGACY_API__ && __legacyMode ? !!options.allowComposition : true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options, __legacyMode);
  const symbol = /* @__PURE__ */ makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  {
    const i18n2 = {
      // mode
      get mode() {
        return __VUE_I18N_LEGACY_API__ && __legacyMode ? "legacy" : "composition";
      },
      // allowComposition
      get allowComposition() {
        return __allowComposition;
      },
      // install plugin
      async install(app2, ...options2) {
        app2.__VUE_I18N_SYMBOL__ = symbol;
        app2.provide(app2.__VUE_I18N_SYMBOL__, i18n2);
        if (isPlainObject(options2[0])) {
          const opts = options2[0];
          i18n2.__composerExtend = opts.__composerExtend;
          i18n2.__vueI18nExtend = opts.__vueI18nExtend;
        }
        let globalReleaseHandler = null;
        if (!__legacyMode && __globalInjection) {
          globalReleaseHandler = injectGlobalFields(app2, i18n2.global);
        }
        if (__VUE_I18N_FULL_INSTALL__) {
          apply(app2, i18n2, ...options2);
        }
        if (__VUE_I18N_LEGACY_API__ && __legacyMode) {
          app2.mixin(defineMixin(__global, __global.__composer, i18n2));
        }
        const unmountApp = app2.unmount;
        app2.unmount = () => {
          globalReleaseHandler && globalReleaseHandler();
          i18n2.dispose();
          unmountApp();
        };
      },
      // global accessor
      get global() {
        return __global;
      },
      dispose() {
        globalScope.stop();
      },
      // @internal
      __instances,
      // @internal
      __getInstance,
      // @internal
      __setInstance,
      // @internal
      __deleteInstance
    };
    return i18n2;
  }
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
  }
  const i18n2 = getI18nInstance(instance);
  const gl = getGlobalComposer(i18n2);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (__VUE_I18N_LEGACY_API__) {
    if (i18n2.mode === "legacy" && !options.__useComponent) {
      if (!i18n2.allowComposition) {
        throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE);
      }
      return useI18nForLegacy(instance, scope, gl, options);
    }
  }
  if (scope === "global") {
    adjustI18nResources(gl, options, componentOptions);
    return gl;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n2, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = gl;
    }
    return composer2;
  }
  const i18nInternal = i18n2;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign$1({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (gl) {
      composerOptions.__root = gl;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
    }
    setupLifeCycle(i18nInternal, instance, composer);
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  {
    const obj = __VUE_I18N_LEGACY_API__ && legacyMode ? scope.run(() => createVueI18n(options)) : scope.run(() => createComposer(options));
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    return [scope, obj];
  }
}
function getI18nInstance(instance) {
  {
    const i18n2 = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    if (!i18n2) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
    }
    return i18n2;
  }
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n2) {
  return i18n2.mode === "composition" ? i18n2.global : i18n2.global.__composer;
}
function getComposer(i18n2, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = getParentComponentInstance(target, useComponent);
  while (current != null) {
    const i18nInternal = i18n2;
    if (i18n2.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    } else {
      if (__VUE_I18N_LEGACY_API__) {
        const vueI18n = i18nInternal.__getInstance(current);
        if (vueI18n != null) {
          composer = vueI18n.__composer;
          if (useComponent && composer && !composer[InejctWithOptionSymbol]) {
            composer = null;
          }
        }
      }
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function getParentComponentInstance(target, useComponent = false) {
  if (target == null) {
    return null;
  }
  {
    return !useComponent ? target.parent : target.vnode.ctx || target.parent;
  }
}
function setupLifeCycle(i18n2, target, composer) {
  {
    onMounted(() => {
    }, target);
    onUnmounted(() => {
      const _composer = composer;
      i18n2.__deleteInstance(target);
      const dispose = _composer[DisposeSymbol];
      if (dispose) {
        dispose();
        delete _composer[DisposeSymbol];
      }
    }, target);
  }
}
function useI18nForLegacy(instance, scope, root, options = {}) {
  const isLocalScope = scope === "local";
  const _composer = shallowRef(null);
  if (isLocalScope && instance.proxy && !(instance.proxy.$options.i18n || instance.proxy.$options.__i18n)) {
    throw createI18nError(I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);
  }
  const _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : !isString$1(options.locale);
  const _locale = ref(
    // prettier-ignore
    !isLocalScope || _inheritLocale ? root.locale.value : isString$1(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = ref(
    // prettier-ignore
    !isLocalScope || _inheritLocale ? root.fallbackLocale.value : isString$1(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  const _missingWarn = isLocalScope ? root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const _fallbackWarn = isLocalScope ? root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const _fallbackRoot = isLocalScope ? root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  const _fallbackFormat = !!options.fallbackFormat;
  const _missing = isFunction(options.missing) ? options.missing : null;
  const _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const _warnHtmlMessage = isLocalScope ? root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const _escapeParameter = !!options.escapeParameter;
  const _modifiers = isLocalScope ? root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  const _pluralRules = options.pluralRules || isLocalScope && root.pluralRules;
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => {
      return _composer.value ? _composer.value.locale.value : _locale.value;
    },
    set: (val) => {
      if (_composer.value) {
        _composer.value.locale.value = val;
      }
      _locale.value = val;
    }
  });
  const fallbackLocale = computed({
    get: () => {
      return _composer.value ? _composer.value.fallbackLocale.value : _fallbackLocale.value;
    },
    set: (val) => {
      if (_composer.value) {
        _composer.value.fallbackLocale.value = val;
      }
      _fallbackLocale.value = val;
    }
  });
  const messages = computed(() => {
    if (_composer.value) {
      return _composer.value.messages.value;
    } else {
      return _messages.value;
    }
  });
  const datetimeFormats = computed(() => _datetimeFormats.value);
  const numberFormats = computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return _composer.value ? _composer.value.getPostTranslationHandler() : _postTranslation;
  }
  function setPostTranslationHandler(handler) {
    if (_composer.value) {
      _composer.value.setPostTranslationHandler(handler);
    }
  }
  function getMissingHandler() {
    return _composer.value ? _composer.value.getMissingHandler() : _missing;
  }
  function setMissingHandler(handler) {
    if (_composer.value) {
      _composer.value.setMissingHandler(handler);
    }
  }
  function warpWithDeps(fn) {
    trackReactivityValues();
    return fn();
  }
  function t(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.t, null, [...args])) : warpWithDeps(() => "");
  }
  function rt(...args) {
    return _composer.value ? Reflect.apply(_composer.value.rt, null, [...args]) : "";
  }
  function d(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.d, null, [...args])) : warpWithDeps(() => "");
  }
  function n(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.n, null, [...args])) : warpWithDeps(() => "");
  }
  function tm(key) {
    return _composer.value ? _composer.value.tm(key) : {};
  }
  function te(key, locale2) {
    return _composer.value ? _composer.value.te(key, locale2) : false;
  }
  function getLocaleMessage(locale2) {
    return _composer.value ? _composer.value.getLocaleMessage(locale2) : {};
  }
  function setLocaleMessage(locale2, message) {
    if (_composer.value) {
      _composer.value.setLocaleMessage(locale2, message);
      _messages.value[locale2] = message;
    }
  }
  function mergeLocaleMessage(locale2, message) {
    if (_composer.value) {
      _composer.value.mergeLocaleMessage(locale2, message);
    }
  }
  function getDateTimeFormat(locale2) {
    return _composer.value ? _composer.value.getDateTimeFormat(locale2) : {};
  }
  function setDateTimeFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.setDateTimeFormat(locale2, format2);
      _datetimeFormats.value[locale2] = format2;
    }
  }
  function mergeDateTimeFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.mergeDateTimeFormat(locale2, format2);
    }
  }
  function getNumberFormat(locale2) {
    return _composer.value ? _composer.value.getNumberFormat(locale2) : {};
  }
  function setNumberFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.setNumberFormat(locale2, format2);
      _numberFormats.value[locale2] = format2;
    }
  }
  function mergeNumberFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.mergeNumberFormat(locale2, format2);
    }
  }
  const wrapper = {
    get id() {
      return _composer.value ? _composer.value.id : -1;
    },
    locale,
    fallbackLocale,
    messages,
    datetimeFormats,
    numberFormats,
    get inheritLocale() {
      return _composer.value ? _composer.value.inheritLocale : _inheritLocale;
    },
    set inheritLocale(val) {
      if (_composer.value) {
        _composer.value.inheritLocale = val;
      }
    },
    get availableLocales() {
      return _composer.value ? _composer.value.availableLocales : Object.keys(_messages.value);
    },
    get modifiers() {
      return _composer.value ? _composer.value.modifiers : _modifiers;
    },
    get pluralRules() {
      return _composer.value ? _composer.value.pluralRules : _pluralRules;
    },
    get isGlobal() {
      return _composer.value ? _composer.value.isGlobal : false;
    },
    get missingWarn() {
      return _composer.value ? _composer.value.missingWarn : _missingWarn;
    },
    set missingWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },
    get fallbackWarn() {
      return _composer.value ? _composer.value.fallbackWarn : _fallbackWarn;
    },
    set fallbackWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },
    get fallbackRoot() {
      return _composer.value ? _composer.value.fallbackRoot : _fallbackRoot;
    },
    set fallbackRoot(val) {
      if (_composer.value) {
        _composer.value.fallbackRoot = val;
      }
    },
    get fallbackFormat() {
      return _composer.value ? _composer.value.fallbackFormat : _fallbackFormat;
    },
    set fallbackFormat(val) {
      if (_composer.value) {
        _composer.value.fallbackFormat = val;
      }
    },
    get warnHtmlMessage() {
      return _composer.value ? _composer.value.warnHtmlMessage : _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      if (_composer.value) {
        _composer.value.warnHtmlMessage = val;
      }
    },
    get escapeParameter() {
      return _composer.value ? _composer.value.escapeParameter : _escapeParameter;
    },
    set escapeParameter(val) {
      if (_composer.value) {
        _composer.value.escapeParameter = val;
      }
    },
    t,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    rt,
    d,
    n,
    tm,
    te,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat
  };
  function sync(composer) {
    composer.locale.value = _locale.value;
    composer.fallbackLocale.value = _fallbackLocale.value;
    Object.keys(_messages.value).forEach((locale2) => {
      composer.mergeLocaleMessage(locale2, _messages.value[locale2]);
    });
    Object.keys(_datetimeFormats.value).forEach((locale2) => {
      composer.mergeDateTimeFormat(locale2, _datetimeFormats.value[locale2]);
    });
    Object.keys(_numberFormats.value).forEach((locale2) => {
      composer.mergeNumberFormat(locale2, _numberFormats.value[locale2]);
    });
    composer.escapeParameter = _escapeParameter;
    composer.fallbackFormat = _fallbackFormat;
    composer.fallbackRoot = _fallbackRoot;
    composer.fallbackWarn = _fallbackWarn;
    composer.missingWarn = _missingWarn;
    composer.warnHtmlMessage = _warnHtmlMessage;
  }
  onBeforeMount(() => {
    if (instance.proxy == null || instance.proxy.$i18n == null) {
      throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
    }
    const composer = _composer.value = instance.proxy.$i18n.__composer;
    if (scope === "global") {
      _locale.value = composer.locale.value;
      _fallbackLocale.value = composer.fallbackLocale.value;
      _messages.value = composer.messages.value;
      _datetimeFormats.value = composer.datetimeFormats.value;
      _numberFormats.value = composer.numberFormats.value;
    } else if (isLocalScope) {
      sync(composer);
    }
  });
  return wrapper;
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app2, composer) {
  const i18n2 = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n2, prop, wrap);
  });
  app2.config.globalProperties.$i18n = i18n2;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app2.config.globalProperties, `$${method}`, desc);
  });
  const dispose = () => {
    delete app2.config.globalProperties.$i18n;
    globalExportMethods.forEach((method) => {
      delete app2.config.globalProperties[`$${method}`];
    });
  };
  return dispose;
}
{
  initFeatureFlags();
}
if (__INTLIFY_JIT_COMPILATION__) {
  registerMessageCompiler(compile);
} else {
  registerMessageCompiler(compileToFunction);
}
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
if (__INTLIFY_PROD_DEVTOOLS__) {
  const target = getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
const en = {
  home: {
    imageQuiz: "Image Quiz Display Tool",
    textQuiz: "Text Quiz Display Tool",
    zoomerMode: "Zoom Out Mode",
    panelMode: "Panel Mode"
  },
  notification: {
    added: "File loaded",
    updated: "Same file already exists",
    error: "Failed to load file",
    exported: "Export successful",
    imported: "Import successful",
    cancel: "Operation cancelled",
    "export-confirm": "Some images do not have selected areas. Would you like to randomly select areas for these images and export?",
    "mode-mismatch": "Imported data does not match current mode. Unable to load data."
  },
  buttons: {
    confirm: "Confirm",
    cancel: "Cancel"
  },
  aria: {
    selectMode: "Select mode"
  },
  sidebar: {
    addItem: "Add Item",
    openSidebar: "Open sidebar",
    delete: "Delete",
    import: "Import zip file",
    export: "Export zip file",
    home: "Back to Home",
    showThumbnails: "Show thumbnails and overview",
    hideThumbnails: "Hide thumbnails and overview"
  },
  topbar: {
    previous: "Previous",
    next: "Next",
    hideAll: "Hide all",
    showAll: "Show all",
    play: "Start",
    pause: "Pause"
  },
  mode: {
    random: "Random",
    linear: "Linear",
    spiral: "Spiral",
    direction: {
      right: "Right",
      left: "Left",
      down: "Down",
      up: "Up"
    },
    position: {
      topLeft: "from Top-left",
      topRight: "from Top-right",
      bottomRight: "from Bottom-right",
      bottomLeft: "from Bottom-left",
      center: "from Center"
    }
  },
  panel: {
    directionPriority: "Direction priority",
    directionAndStart: "Direction and start point",
    switchToManual: "Switch to manual mode",
    switchToAuto: "Switch to auto mode"
  },
  zoomer: {
    showFullImage: "Showing full image",
    showSelectedArea: "Showing selected area only",
    hideImage: "Hiding image",
    switchToShowFullImage: "Show full image",
    switchToShowSelectedArea: "Show selected area",
    switchToHideImage: "Hide image"
  },
  letter: {
    charsPerRow: "Characters per row",
    random: "Random",
    sequential: "Sequential",
    reverse: "Reverse",
    switchToManual: "Switch to manual mode",
    switchToAuto: "Switch to auto mode"
  }
};
const ja = {
  home: {
    imageQuiz: "画像クイズ表示ツール",
    textQuiz: "文字クイズ表示ツール",
    zoomerMode: "ズームアウトクイズ",
    panelMode: "パネルクイズ"
  },
  notification: {
    added: "データが読み込まれました",
    updated: "同じデータが既に存在します",
    error: "データの読み込みに失敗しました",
    exported: "エクスポートに成功しました",
    imported: "インポートに成功しました",
    cancel: "操作がキャンセルされました",
    "export-confirm": "一部の画像にはまだ選択領域がありません。これらの画像にランダムな領域を選択してエクスポートしますか？",
    "mode-mismatch": "インポートされたデータが現在のモードと一致しません。データを読み込めません。"
  },
  buttons: {
    confirm: "確認",
    cancel: "キャンセル"
  },
  aria: {
    selectMode: "モードを選択"
  },
  sidebar: {
    addItem: "項目を追加",
    openSidebar: "サイドバーを開く",
    delete: "削除",
    import: "zipファイルをインポート",
    export: "zipファイルをエクスポート",
    home: "ホームに戻る",
    showThumbnails: "サムネイルと概要を表示",
    hideThumbnails: "サムネイルと概要を非表示"
  },
  topbar: {
    previous: "前へ",
    next: "次へ",
    hideAll: "すべて隠す",
    showAll: "すべて表示",
    play: "開始",
    pause: "一時停止"
  },
  mode: {
    random: "ランダム",
    linear: "各行・各列",
    spiral: "渦巻き",
    direction: {
      right: "右",
      left: "左",
      down: "下",
      up: "上"
    },
    position: {
      topLeft: "左上から",
      topRight: "右上から",
      bottomRight: "右下から",
      bottomLeft: "左下から",
      center: "中心から"
    }
  },
  panel: {
    directionPriority: "順番変更",
    directionAndStart: "方向と開始位置",
    switchToManual: "手動モードに切り替え",
    switchToAuto: "自動モードに切り替え"
  },
  zoomer: {
    showFullImage: "画像全体表示中",
    showSelectedArea: "選択領域表示中",
    hideImage: "画像非表示中",
    switchToShowFullImage: "画像全体を表示",
    switchToShowSelectedArea: "選択領域を表示",
    switchToHideImage: "画像を非表示"
  },
  letter: {
    charsPerRow: "一行あたりの文字数",
    random: "ランダム",
    sequential: "順番",
    reverse: "逆順",
    switchToManual: "手動モードに切り替え",
    switchToAuto: "自動モードに切り替え"
  }
};
const zhTW = {
  home: {
    imageQuiz: "圖片Quiz顯示工具",
    textQuiz: "文字Quiz顯示工具",
    zoomerMode: "縮放模式",
    panelMode: "面板模式"
  },
  notification: {
    added: "檔案已載入",
    updated: "相同檔案已存在",
    error: "載入檔案失敗",
    exported: "匯出成功",
    imported: "匯入成功",
    cancel: "已取消操作",
    "export-confirm": "有部分圖片尚未框選區域。是否要為這些圖片隨機選取一塊區域後匯出？",
    "mode-mismatch": "導入的資料與當前模式不符。無法載入資料。"
  },
  buttons: {
    confirm: "確認",
    cancel: "取消"
  },
  aria: {
    selectMode: "選擇模式"
  },
  sidebar: {
    addItem: "新增項目",
    openSidebar: "開啟側邊欄",
    delete: "刪除",
    import: "匯入壓縮檔",
    export: "匯出壓縮檔",
    home: "回到首頁",
    showThumbnails: "顯示縮圖與概要",
    hideThumbnails: "隱藏縮圖與概要"
  },
  topbar: {
    previous: "上一項",
    next: "下一項",
    hideAll: "隱藏全部",
    showAll: "顯示全部",
    play: "開始",
    pause: "暫停"
  },
  mode: {
    random: "隨機",
    linear: "線性",
    spiral: "螺旋",
    direction: {
      right: "向右",
      left: "向左",
      down: "向下",
      up: "向上"
    },
    position: {
      topLeft: "左上開始",
      topRight: "右上開始",
      bottomRight: "右下開始",
      bottomLeft: "左下開始",
      center: "中心開始"
    }
  },
  panel: {
    directionPriority: "方向優先度",
    directionAndStart: "方向與起點",
    switchToManual: "切換為手動模式",
    switchToAuto: "切換為自動模式"
  },
  zoomer: {
    showFullImage: "完整顯示中",
    showSelectedArea: "框選區域顯示中",
    hideImage: "圖片隱藏中",
    switchToShowFullImage: "顯示完整圖片",
    switchToShowSelectedArea: "顯示框選區域",
    switchToHideImage: "隱藏圖片"
  },
  letter: {
    charsPerRow: "每行字數",
    random: "隨機",
    sequential: "順序",
    reverse: "倒序",
    switchToManual: "切換為手動模式",
    switchToAuto: "切換為自動模式"
  }
};
const getBrowserLanguage = () => {
  const navigatorLanguage = navigator.language.toLowerCase();
  const supportedLanguages = ["en", "ja", "zh-tw"];
  if (supportedLanguages.includes(navigatorLanguage)) {
    return navigatorLanguage;
  }
  const languageCode = navigatorLanguage.split("-")[0];
  const matchingLang = supportedLanguages.find(
    (lang) => lang.startsWith(languageCode)
  );
  return matchingLang || "zh-tw";
};
const getSavedLanguage = () => {
  return localStorage.getItem("language") || getBrowserLanguage();
};
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getSavedLanguage(),
  fallbackLocale: "zh-tw",
  messages: {
    en,
    ja,
    "zh-tw": zhTW
  }
});
function setLanguage(lang) {
  var _a2;
  i18n.global.locale.value = lang;
  localStorage.setItem("language", lang);
  (_a2 = document.querySelector("html")) == null ? void 0 : _a2.setAttribute("lang", lang);
}
const icons = {
  PhHouse: I$5,
  PhTrash: G$d,
  PhBoxArrowDown: G$c,
  PhBoxArrowUp: F$9,
  PhTranslate: F$8,
  PhSidebarSimple: I$4,
  PhPlus: I$3,
  PhArrowLeft: G$b,
  PhArrowRight: F$7,
  PhPause: I$2,
  PhPlay: H$2,
  PhEyeClosed: H$1,
  PhFrameCorners: I$1,
  PhCursorClick: G$a,
  PhClockClockwise: G$9,
  PhCornersOut: G$8,
  PhImage: F$6,
  PhCrop: I,
  PhEyeSlash: H,
  PhX: F$5,
  PhPictureInPicture: G$7,
  PhCheckerboard: G$6,
  PhArrowClockwise: G$5,
  PhArrowCounterClockwise: G$4,
  PhArrowElbowRightDown: F$4,
  PhArrowElbowLeftDown: G$3,
  PhArrowElbowDownRight: F$3,
  PhArrowElbowDownLeft: G$2,
  PhArrowElbowLeftUp: F$2,
  PhArrowElbowRightUp: D$1,
  PhArrowElbowUpRight: D,
  PhArrowElbowUpLeft: F$1,
  PhArrowsLeftRight: F,
  PhArrowsClockwise: G$1,
  PhShuffleSimple: G
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  props: {
    size: { default: "20" },
    name: { default: "Plus" },
    weight: { default: "regular" },
    color: { default: "currentColor" }
  },
  setup(__props) {
    const props = __props;
    const PhosphorIcons = icons;
    const iconStyle = computed(() => ({
      fontSize: props.size ? `${props.size}px` : "20px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }));
    const iconComponent = computed(() => {
      return PhosphorIcons[props.name];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "phosphor-icon",
        style: normalizeStyle(iconStyle.value)
      }, [
        (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), {
          weight: _ctx.weight,
          color: _ctx.color
        }, null, 8, ["weight", "color"]))
      ], 4);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const Icon = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-a41fcb0a"]]);
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "Button",
  props: {
    icon: { default: null },
    iconSize: { default: "20" },
    type: { default: "default" },
    size: { default: "default" },
    circle: { type: Boolean, default: false },
    plain: { type: Boolean },
    title: { default: void 0 },
    tooltipDelay: { default: 300 },
    tooltipPlacement: { default: "bottom" }
  },
  setup(__props) {
    const props = __props;
    const $attrs = useAttrs();
    const slots = useSlots();
    const buttonProps = computed(() => {
      const attrs = { ...$attrs };
      delete attrs.title;
      if (!attrs.role) {
        attrs.role = "button";
      }
      return {
        type: props.type,
        size: props.size,
        circle: props.circle,
        plain: props.plain,
        ...attrs
      };
    });
    return (_ctx, _cache) => {
      const _component_el_button = ElButton;
      const _component_el_tooltip = ElTooltip;
      return _ctx.title ? (openBlock(), createBlock(_component_el_tooltip, {
        key: 0,
        content: _ctx.title,
        "show-after": _ctx.tooltipDelay,
        placement: _ctx.tooltipPlacement
      }, {
        default: withCtx(() => [
          createVNode(_component_el_button, mergeProps(buttonProps.value, {
            class: [_ctx.icon && !unref(slots).default ? "icon-only-btn" : "", unref($attrs).class],
            plain: ""
          }), {
            default: withCtx(() => [
              _ctx.icon ? (openBlock(), createBlock(Icon, {
                key: 0,
                name: _ctx.icon,
                size: String(_ctx.iconSize)
              }, null, 8, ["name", "size"])) : createCommentVNode("", true),
              !_ctx.icon ? renderSlot(_ctx.$slots, "default", { key: 1 }, void 0, true) : createCommentVNode("", true)
            ]),
            _: 3
          }, 16, ["class"])
        ]),
        _: 3
      }, 8, ["content", "show-after", "placement"])) : (openBlock(), createBlock(_component_el_button, mergeProps({ key: 1 }, buttonProps.value, {
        class: [_ctx.icon && !unref(slots).default ? "icon-only-btn" : "", unref($attrs).class],
        plain: ""
      }), {
        default: withCtx(() => [
          _ctx.icon ? (openBlock(), createBlock(Icon, {
            key: 0,
            name: _ctx.icon,
            size: String(_ctx.iconSize)
          }, null, 8, ["name", "size"])) : createCommentVNode("", true),
          !_ctx.icon ? renderSlot(_ctx.$slots, "default", { key: 1 }, void 0, true) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16, ["class"]));
    };
  }
});
const Button = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-91922f32"]]);
const capitalize = (s) => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
function useNotifier() {
  const { t } = useI18n();
  async function notify(type, options = {}) {
    const message = t(`notification.${type}`);
    const title = options.title || t("buttons.confirm");
    let level = "info";
    switch (type) {
      case "added":
      case "exported":
      case "imported":
        level = "success";
        break;
      case "updated":
      case "export-confirm":
        level = "warning";
        break;
      case "error":
      case "mode-mismatch":
        level = "error";
        break;
      default:
        level = "info";
    }
    const mode = type === "export-confirm" ? "confirm" : options.mode || "message";
    if (mode === "confirm") {
      try {
        await ElMessageBox.confirm(message, title, {
          type: level,
          confirmButtonText: t("buttons.confirm"),
          cancelButtonText: t("buttons.cancel")
        });
        return true;
      } catch {
        return false;
      }
    }
    if (mode === "notification") {
      ElNotification({
        title: options.title || capitalize(level),
        message,
        type: level,
        duration: options.duration || 4500,
        ...options
      });
      return;
    }
    ElMessage({
      message,
      type: level,
      duration: options.duration || 2e3,
      ...options
    });
  }
  return {
    notify
  };
}
const _hoisted_1$a = { class: "language-selector" };
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "LanguageSelector",
  setup(__props) {
    const { locale, t } = useI18n();
    const currentLanguage = ref(locale.value);
    const { notify } = useNotifier();
    const availableLanguages = [
      { code: "zh-tw", label: "中文", name: "繁體中文" },
      { code: "ja", label: "日本語", name: "日本語" },
      { code: "en", label: "English", name: "English" }
    ];
    onMounted(() => {
      currentLanguage.value = locale.value;
    });
    const getCurrentLanguageName = () => {
      const lang = availableLanguages.find((l) => l.code === currentLanguage.value);
      return lang ? lang.name : "";
    };
    const cycleLanguage = () => {
      const currentIndex = availableLanguages.findIndex(
        (l) => l.code === currentLanguage.value
      );
      const nextIndex = (currentIndex + 1) % availableLanguages.length;
      const nextLang = availableLanguages[nextIndex].code;
      changeLanguage(nextLang);
      notify("info", {
        mode: "message",
        message: getCurrentLanguageName()
      });
    };
    const changeLanguage = (lang) => {
      if (!availableLanguages.map((l) => l.code).includes(lang)) {
        lang = "zh-tw";
      }
      setLanguage(lang);
      currentLanguage.value = lang;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$a, [
        createVNode(Button, {
          icon: "PhTranslate",
          onClick: cycleLanguage,
          title: getCurrentLanguageName(),
          tooltipPlacement: "left"
        }, null, 8, ["title"])
      ]);
    };
  }
});
const _hoisted_1$9 = { id: "app" };
const _hoisted_2$9 = {
  key: 0,
  style: { "position": "fixed", "bottom": "10px", "right": "10px", "z-index": "2000" },
  class: "home-button-container"
};
const _hoisted_3$8 = { class: "language-controls" };
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createElementBlock("div", _hoisted_1$9, [
        _ctx.$route.name !== "home" ? (openBlock(), createElementBlock("div", _hoisted_2$9)) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_3$8, [
          _ctx.$route.name === "home" ? (openBlock(), createBlock(_sfc_main$b, { key: 0 })) : createCommentVNode("", true)
        ]),
        createBaseVNode("main", null, [
          createVNode(_component_router_view)
        ])
      ]);
    };
  }
});
const App = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-6e68f81f"]]);
const _hoisted_1$8 = { class: "home-page" };
const _hoisted_2$8 = { class: "quiz-section" };
const _hoisted_3$7 = { class: "section-title" };
const _hoisted_4$6 = ["aria-label"];
const _hoisted_5$4 = ["aria-label"];
const _hoisted_6$3 = { class: "mode-name" };
const _hoisted_7$3 = ["aria-label"];
const _hoisted_8$2 = { class: "mode-name" };
const _hoisted_9$2 = { class: "quiz-section" };
const _hoisted_10$1 = { class: "section-title" };
const _hoisted_11$1 = ["aria-label"];
const _hoisted_12$1 = ["aria-label"];
const _hoisted_13 = { class: "mode-name" };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "HomePage",
  setup(__props) {
    const { t } = useI18n();
    const router2 = useRouter();
    const selectMode = (mode) => {
      router2.push(`/${mode}`);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$8, [
        createBaseVNode("div", _hoisted_2$8, [
          createBaseVNode("h2", _hoisted_3$7, toDisplayString$1(unref(t)("home.imageQuiz")), 1),
          createBaseVNode("div", {
            class: "mode-selection",
            role: "group",
            "aria-label": unref(t)("aria.selectMode")
          }, [
            createBaseVNode("button", {
              class: "mode-card",
              onClick: _cache[0] || (_cache[0] = ($event) => selectMode("zoomer")),
              "aria-label": unref(t)("home.zoomerMode"),
              tabindex: "0",
              role: "button"
            }, [
              createVNode(Icon, {
                name: "PhPictureInPicture",
                size: "128",
                color: "#039390",
                "aria-hidden": "true"
              }),
              createBaseVNode("span", _hoisted_6$3, toDisplayString$1(unref(t)("home.zoomerMode")), 1)
            ], 8, _hoisted_5$4),
            createBaseVNode("button", {
              class: "mode-card",
              onClick: _cache[1] || (_cache[1] = ($event) => selectMode("panel")),
              "aria-label": unref(t)("home.panelMode"),
              tabindex: "0",
              role: "button"
            }, [
              createVNode(Icon, {
                name: "PhCheckerboard",
                size: "128",
                color: "#039390",
                "aria-hidden": "true"
              }),
              createBaseVNode("span", _hoisted_8$2, toDisplayString$1(unref(t)("home.panelMode")), 1)
            ], 8, _hoisted_7$3)
          ], 8, _hoisted_4$6)
        ]),
        createBaseVNode("div", _hoisted_9$2, [
          createBaseVNode("h2", _hoisted_10$1, toDisplayString$1(unref(t)("home.textQuiz")), 1),
          createBaseVNode("div", {
            class: "mode-selection",
            role: "group",
            "aria-label": unref(t)("aria.selectMode")
          }, [
            createBaseVNode("button", {
              class: "mode-card",
              onClick: _cache[2] || (_cache[2] = ($event) => selectMode("text-panel")),
              "aria-label": unref(t)("home.panelMode"),
              tabindex: "0",
              role: "button"
            }, [
              createVNode(Icon, {
                name: "PhCheckerboard",
                size: "128",
                color: "#039390",
                "aria-hidden": "true"
              }),
              createBaseVNode("span", _hoisted_13, toDisplayString$1(unref(t)("home.panelMode")), 1)
            ], 8, _hoisted_12$1)
          ], 8, _hoisted_11$1)
        ])
      ]);
    };
  }
});
const HomePage = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-8acfecfb"]]);
function createDataStore(storeName) {
  return defineStore(storeName, {
    state: () => ({
      allData: [],
      currentIndex: -1
    }),
    getters: {
      currentData(state) {
        if (state.currentIndex >= 0 && state.currentIndex < state.allData.length) {
          return state.allData[state.currentIndex];
        }
        return null;
      },
      canGoPrev(state) {
        return state.currentIndex > 0;
      },
      canGoNext(state) {
        return state.currentIndex < state.allData.length - 1;
      }
    },
    actions: {
      setCurrentById(id) {
        const index2 = this.allData.findIndex((data) => data.id === id);
        if (index2 !== -1) {
          this.currentIndex = index2;
        }
      },
      goToNext() {
        var _a2;
        if (this.canGoNext) {
          this.currentIndex++;
          return ((_a2 = this.currentData) == null ? void 0 : _a2.id) || null;
        }
        return null;
      },
      goToPrev() {
        var _a2;
        if (this.canGoPrev) {
          this.currentIndex--;
          return ((_a2 = this.currentData) == null ? void 0 : _a2.id) || null;
        }
        return null;
      },
      updateOrder(newOrder) {
        var _a2;
        const currentId = (_a2 = this.currentData) == null ? void 0 : _a2.id;
        this.allData = newOrder;
        if (currentId) {
          this.setCurrentById(currentId);
        }
      },
      getIndexById(id) {
        return this.allData.findIndex((c) => c.id === id);
      },
      addData(data) {
        const existingIndex = this.getIndexById(data.id);
        if (existingIndex === -1) {
          this.allData.push(data);
          this.currentIndex = this.allData.length - 1;
          return "added";
        } else {
          this.allData[existingIndex] = data;
          return "updated";
        }
      },
      removeData(id) {
        var _a2;
        const indexToRemove = this.allData.findIndex((data) => data.id === id);
        if (indexToRemove === -1) return;
        const wasCurrentData = ((_a2 = this.currentData) == null ? void 0 : _a2.id) === id;
        const removedData = this.allData[indexToRemove];
        this.allData.splice(indexToRemove, 1);
        if (removedData && removedData.thumbnailSrc && removedData.thumbnailSrc.startsWith("blob:")) {
          URL.revokeObjectURL(removedData.thumbnailSrc);
        }
        if (this.allData.length === 0) {
          this.currentIndex = -1;
          return;
        }
        if (wasCurrentData) {
          this.currentIndex = Math.min(indexToRemove, this.allData.length - 1);
        } else if (this.currentIndex > indexToRemove) {
          this.currentIndex--;
        }
      },
      getData(id) {
        if (id === null) {
          return this.allData[this.currentIndex] || null;
        }
        if (typeof id === "number" && id >= 0 && id < this.allData.length) {
          return this.allData[id] || null;
        }
        const idx = this.getIndexById(id);
        return idx !== -1 ? this.allData[idx] : null;
      },
      setData(id, data) {
        if (typeof id === "number" && id >= 0 && id < this.allData.length) {
          this.allData[id] = data;
          return true;
        }
        const idx = this.getIndexById(id);
        if (idx !== -1) {
          this.allData[idx] = data;
          return true;
        }
        return false;
      },
      importData(data) {
        this.allData = data.allData;
        this.currentIndex = data.currentIndex;
      },
      getAllData() {
        return this.allData;
      }
    }
  });
}
const useImageStore = createDataStore("imageStore");
const useTextStore = createDataStore("textStore");
const useZoomerStore = defineStore("zoomer", {
  state: () => ({
    contexts: {},
    isPaused: false,
    isZooming: false
  }),
  actions: {
    getContext(id) {
      return id ? this.contexts[id] || null : null;
    },
    setContext(id, context) {
      this.contexts[id] = context;
    },
    setRect(id, rect) {
      if (this.contexts[id]) {
        this.contexts[id].selection = rect;
      }
    },
    removeContext(id) {
      if (this.contexts[id]) {
        delete this.contexts[id];
        return true;
      }
      return false;
    },
    setPaused(paused) {
      this.isPaused = paused;
    },
    setZooming(zooming) {
      this.isZooming = zooming;
    },
    hasSelection(id) {
      const context = this.getContext(id);
      return context ? !!(context.selection.w && context.selection.h) : false;
    },
    hasContext(id) {
      return !!this.contexts[id];
    },
    importData(data) {
      this.contexts = data.contexts;
    }
  }
});
function useManagerBase(config) {
  const {
    dataStore,
    extraStore,
    dataType,
    fileAccept,
    loadFile,
    onFileAdded,
    showNotifications = true
  } = config;
  const fileInput = ref(null);
  const { notify } = useNotifier();
  const canGoPrev = toRef(dataStore, "canGoPrev");
  const canGoNext = toRef(dataStore, "canGoNext");
  const currentData = toRef(dataStore, "currentData");
  const isZooming = computed(() => extraStore.isZooming ?? false);
  const isAutoRevealing = computed(() => extraStore.isAutoRevealing ?? false);
  const isPaused = computed(() => extraStore.isPaused ?? false);
  const currentId = computed(() => {
    var _a2;
    return ((_a2 = currentData.value) == null ? void 0 : _a2.id) || null;
  });
  const triggerFileInput = () => {
    var _a2;
    (_a2 = fileInput.value) == null ? void 0 : _a2.click();
  };
  const onFileChange = async (e) => {
    const files = e.target.files;
    if (!files || !files[0]) return;
    const file = files[0];
    try {
      const data = await loadFile(file);
      if (!Array.isArray(data)) {
        const status = dataStore.addData(data);
        if (data.id) {
          if (onFileAdded) {
            onFileAdded(data.id, status);
          }
          if (showNotifications) {
            notify(status);
          }
        }
        return status;
      }
      let lastStatus = "error";
      data.forEach((item) => {
        const status = dataStore.addData(item);
        if (item.id) {
          if (onFileAdded) {
            onFileAdded(item.id, status);
          }
          if (showNotifications) {
            notify(status);
          }
        }
        lastStatus = status;
      });
      return lastStatus;
    } catch (err) {
      console.error("Failed to load file:", err);
      if (showNotifications) {
        notify("error");
      }
      return "error";
    } finally {
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    }
  };
  const handleDataSelect = (id) => {
    dataStore.setCurrentById(id);
  };
  const goToPrev = () => {
    dataStore.goToPrev();
  };
  const goToNext = () => {
    dataStore.goToNext();
  };
  return {
    // Reactive state
    fileInput,
    // Computed
    currentId,
    canGoPrev,
    canGoNext,
    currentData,
    // Store state (if needed by parent)
    isZooming,
    isAutoRevealing,
    isPaused,
    // Methods
    triggerFileInput,
    onFileChange,
    handleDataSelect,
    goToPrev,
    goToNext,
    // Config passed through
    dataType,
    fileAccept,
    dataStore,
    extraStore
  };
}
async function loadImageFile(file, maxWidth = 1280, maxHeight = 720) {
  const key = await getSha256(file);
  const objectURL = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let w = img.width;
      let h2 = img.height;
      const naturalWidth = w;
      const naturalHeight = h2;
      const scale = Math.min(maxWidth / w, maxHeight / h2, 1);
      w = Math.round(w * scale);
      h2 = Math.round(h2 * scale);
      createImageBitmap(img).then((bitmap) => {
        resolve({
          id: key,
          name: file.name,
          // Add this line
          image: file,
          renderable: bitmap,
          canvas: null,
          thumbnailSrc: objectURL,
          naturalWidth,
          naturalHeight,
          displayWidth: w,
          displayHeight: h2
        });
      });
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectURL);
      reject(err);
    };
    img.src = objectURL;
  });
}
async function getSha256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
function useRectSelection(aspect, context, setRect2) {
  const isDragging = ref(false);
  let startX = 0;
  let startY = 0;
  const onMouseDown = (e, canvas) => {
    const bounds = canvas.getBoundingClientRect();
    if (!context.value) return;
    const scaleX = canvas.width / bounds.width;
    const scaleY = canvas.height / bounds.height;
    if (!context.value) return;
    startX = (e.clientX - bounds.left) * scaleX;
    startY = (e.clientY - bounds.top) * scaleY;
    const newSelection = {
      x: startX,
      y: startY,
      w: 0,
      h: 0
    };
    setRect2(newSelection);
    isDragging.value = true;
  };
  const onMouseMove = (e, canvas) => {
    if (!isDragging.value || !context.value) return;
    const bounds = canvas.getBoundingClientRect();
    const mx = e.clientX - bounds.left;
    const dx = mx - startX;
    const dy = dx / aspect.value;
    const newSelection = {
      x: startX,
      y: startY,
      w: dx,
      h: dy
    };
    setRect2(newSelection);
  };
  const onMouseUp = () => {
    isDragging.value = false;
  };
  const drawSelection = (canvas) => {
    if (!context.value) return;
    const rect = context.value.selection;
    const c2d = canvas.getContext("2d");
    if (!c2d) return;
    c2d.strokeStyle = "red";
    c2d.lineWidth = 1.5;
    c2d.strokeRect(rect.x, rect.y, rect.w, rect.h);
  };
  return {
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawSelection
  };
}
function randomSelection(displayWidth, displayHeight) {
  const minSize = Math.min(displayWidth, displayHeight) / 10;
  const maxSize = Math.min(displayWidth, displayHeight) / 5;
  const aspectRatio = displayWidth / displayHeight;
  const w = Math.random() * (maxSize - minSize) + minSize;
  const h2 = w / aspectRatio;
  const x = Math.random() * (displayWidth - w);
  const y = Math.random() * (displayHeight - h2);
  return {
    x: Math.max(0, Math.floor(x)),
    y: Math.max(0, Math.floor(y)),
    w: Math.min(displayWidth - Math.floor(x), Math.floor(w)),
    h: Math.min(displayHeight - Math.floor(y), Math.floor(h2))
  };
}
let currentController = null;
function startZoomOut(params) {
  const imageStore = useZoomerStore();
  imageStore.setZooming(true);
  imageStore.setPaused(false);
  let paused = false;
  let finished = false;
  let animationFrameId = null;
  let start = performance.now();
  let pauseTime = 0;
  const {
    canvas,
    renderable,
    naturalWidth,
    naturalHeight,
    displayWidth,
    displayHeight,
    selection,
    duration
  } = params;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const sx = selection.w >= 0 ? selection.x : selection.x + selection.w;
  const sy = selection.h >= 0 ? selection.y : selection.y + selection.h;
  const sw = Math.abs(selection.w);
  const sh = Math.abs(selection.h);
  const center0 = { x: sx + sw / 2, y: sy + sh / 2 };
  const size0 = { w: sw, h: sh };
  const center1 = { x: displayWidth / 2, y: displayHeight / 2 };
  const size1 = { w: displayWidth, h: displayHeight };
  const scaleX = naturalWidth / displayWidth;
  const scaleY = naturalHeight / displayHeight;
  function animate(ts) {
    if (paused || finished) return;
    let progress = Math.min((ts - start) / duration, 1);
    progress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    const cx = center0.x + (center1.x - center0.x) * progress;
    const cy = center0.y + (center1.y - center0.y) * progress;
    const w = size0.w + (size1.w - size0.w) * progress;
    const h2 = size0.h + (size1.h - size0.h) * progress;
    let sx2 = (cx - w / 2) * scaleX;
    let sy2 = (cy - h2 / 2) * scaleY;
    let sw2 = w * scaleX;
    let sh2 = h2 * scaleY;
    if (sx2 < 0) {
      sw2 += sx2;
      sx2 = 0;
    }
    if (sy2 < 0) {
      sh2 += sy2;
      sy2 = 0;
    }
    if (sx2 + sw2 > naturalWidth) sw2 = naturalWidth - sx2;
    if (sy2 + sh2 > naturalHeight) sh2 = naturalHeight - sy2;
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(
      renderable,
      sx2,
      sy2,
      sw2,
      sh2,
      0,
      0,
      displayWidth,
      displayHeight
    );
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      finished = true;
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(
        renderable,
        0,
        0,
        naturalWidth,
        naturalHeight,
        0,
        0,
        displayWidth,
        displayHeight
      );
      imageStore.setZooming(false);
    }
  }
  animationFrameId = requestAnimationFrame(animate);
  const controller = {
    pause() {
      if (!paused && !finished) {
        paused = true;
        pauseTime = performance.now();
        imageStore.setPaused(true);
      }
    },
    resume() {
      if (paused && !finished) {
        paused = false;
        start += performance.now() - pauseTime;
        animationFrameId = requestAnimationFrame(animate);
        imageStore.setPaused(false);
      }
    },
    stop() {
      finished = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      imageStore.setZooming(false);
      imageStore.setPaused(false);
    }
  };
  currentController = controller;
  return controller;
}
function stopZoomOut() {
  if (currentController) {
    currentController.stop();
    currentController = null;
  }
}
function showFullImage(params) {
  stopZoomOut();
  const {
    renderable,
    canvas,
    naturalWidth,
    naturalHeight,
    displayWidth,
    displayHeight
  } = params;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.drawImage(
    renderable,
    0,
    0,
    naturalWidth,
    naturalHeight,
    0,
    0,
    displayWidth,
    displayHeight
  );
}
const _hoisted_1$7 = { class: "display-root" };
const _hoisted_2$7 = {
  class: "display-canvas-container",
  ref: "canvasContainer"
};
const _hoisted_3$6 = ["width", "height"];
const _hoisted_4$5 = ["width", "height"];
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Zoomer",
  props: {
    id: { default: null },
    displayMode: { default: "full" }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const zoomerStore = useZoomerStore();
    const imageStore = useImageStore();
    const { isZooming } = storeToRefs(zoomerStore);
    const mainCanvas = ref(null);
    const zoomCanvas = ref(null);
    const context = computed(() => {
      if (!props.id) return {};
      const imageData = imageStore.getData(props.id);
      const zoomerCtx = zoomerStore.getContext(props.id);
      return {
        ...imageData,
        ...zoomerCtx
      };
    });
    const aspect = computed(
      () => {
        var _a2, _b;
        return ((_a2 = context.value) == null ? void 0 : _a2.displayWidth) / ((_b = context.value) == null ? void 0 : _b.displayHeight) || 1;
      }
    );
    const setRect2 = (rect) => {
      if (props.id) {
        zoomerStore.setRect(props.id, rect);
      }
    };
    const { isDragging, onMouseDown, onMouseMove, onMouseUp, drawSelection } = useRectSelection(aspect, context, setRect2);
    const drawSelect = () => {
      if (context.value.selection && context.value.selection.w !== 0 && context.value.selection.h !== 0) {
        drawSelection(mainCanvas.value);
      }
    };
    const drawImage = () => {
      var _a2;
      if (!mainCanvas.value || !((_a2 = context.value) == null ? void 0 : _a2.renderable)) return;
      const ctx = mainCanvas.value.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, context.value.displayWidth, context.value.displayHeight);
      if (props.displayMode === "selection" && context.value.selection && context.value.selection.w && context.value.selection.h) {
        const sel = context.value.selection;
        const scaleX = context.value.renderable.width / context.value.displayWidth;
        const scaleY = context.value.renderable.height / context.value.displayHeight;
        const sourceSelection = {
          x: sel.x * scaleX,
          y: sel.y * scaleY,
          w: sel.w * scaleX,
          h: sel.h * scaleY
        };
        ctx.drawImage(
          context.value.renderable,
          sourceSelection.x,
          sourceSelection.y,
          sourceSelection.w,
          sourceSelection.h,
          0,
          0,
          context.value.displayWidth,
          context.value.displayHeight
        );
      } else if (props.displayMode === "full" || isZooming.value) {
        showFullImage({
          ...context.value,
          canvas: mainCanvas.value
        });
        drawSelect();
      }
    };
    const handleMouseDown = (e) => {
      if (isZooming.value || !mainCanvas.value || props.displayMode !== "full")
        return;
      onMouseDown(e, mainCanvas.value);
    };
    const handleMouseMove = (e) => {
      if (isZooming.value || !mainCanvas.value || props.displayMode !== "full")
        return;
      onMouseMove(e, mainCanvas.value);
      if (isDragging.value) {
        drawImage();
      }
    };
    const handleMouseUp = () => {
      onMouseUp();
      drawImage();
    };
    let zoomController = null;
    const startZoomOut$1 = () => {
      var _a2;
      if (!zoomCanvas.value || !((_a2 = context.value) == null ? void 0 : _a2.renderable)) return;
      zoomController = startZoomOut({
        ...context.value,
        canvas: zoomCanvas.value
      });
    };
    const pauseZoomOut = () => {
      zoomController == null ? void 0 : zoomController.pause();
    };
    const resumeZoomOut = () => {
      zoomController == null ? void 0 : zoomController.resume();
    };
    const showFullImage$1 = () => {
      var _a2;
      if (!mainCanvas.value || !((_a2 = context.value) == null ? void 0 : _a2.renderable)) return;
      showFullImage({
        ...context.value,
        canvas: mainCanvas.value
      });
      drawSelect();
      if (isZooming.value) {
        zoomController = null;
      }
    };
    __expose({
      startZoomOut: startZoomOut$1,
      pauseZoomOut,
      resumeZoomOut,
      showFullImage: showFullImage$1
    });
    watch(
      () => props.id,
      (newId) => {
        if (newId) {
          nextTick(() => {
            drawImage();
          });
        }
      },
      { immediate: true }
    );
    watch(
      () => props.displayMode,
      () => {
        drawImage();
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createBaseVNode("div", _hoisted_2$7, [
          withDirectives(createBaseVNode("canvas", {
            ref_key: "mainCanvas",
            ref: mainCanvas,
            width: context.value.displayWidth,
            height: context.value.displayHeight,
            onMousedown: handleMouseDown,
            onMousemove: handleMouseMove,
            onMouseup: handleMouseUp
          }, null, 40, _hoisted_3$6), [
            [vShow, !unref(isZooming) && props.displayMode !== "none"]
          ]),
          withDirectives(createBaseVNode("canvas", {
            ref_key: "zoomCanvas",
            ref: zoomCanvas,
            width: context.value.displayWidth,
            height: context.value.displayHeight,
            class: "zoom-canvas"
          }, null, 8, _hoisted_4$5), [
            [vShow, unref(isZooming)]
          ])
        ], 512)
      ]);
    };
  }
});
var vuedraggable_umd = { exports: {} };
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(vue_runtime_esmBundler);
/**!
 * Sortable 1.14.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var version = "1.14.0";
function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var captureMode = {
  capture: false,
  passive: false
};
function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}
function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}
function matches(el, selector) {
  if (!selector) return;
  selector[0] === ">" && (selector = selector.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}
function closest(el, selector, ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx) break;
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? "add" : "remove"](name);
    } else {
      var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
      el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
    }
  }
}
function css(el, prop, val) {
  var style = el && el.style;
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, "");
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }
      style[prop] = val + (typeof val === "string" ? "" : "px");
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = "";
  if (typeof el === "string") {
    appliedTransforms = el;
  } else {
    do {
      var transform2 = css(el, "transform");
      if (transform2 && transform2 !== "none") {
        appliedTransforms = transform2 + " " + appliedTransforms;
      }
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    container = container || el.parentNode;
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
          var containerRect = container.getBoundingClientRect();
          top -= containerRect.top + parseInt(css(container, "border-top-width"));
          left -= containerRect.left + parseInt(css(container, "border-left-width"));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }
  return {
    top,
    left,
    bottom,
    right,
    width,
    height
  };
}
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide], visible = void 0;
    {
      visible = elSideVal >= parentSideVal;
    }
    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0, i = 0, children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}
function lastChild(el, selector) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }
  return last || null;
}
function index(el, selector) {
  var index2 = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index2++;
    }
  }
  return index2;
}
function getRelativeScrollOffset(el) {
  var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function() {
    if (!_throttleTimeout) {
      var args = arguments, _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function() {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
function setRect(el, rect) {
  css(el, "position", "absolute");
  css(el, "top", rect.top);
  css(el, "left", rect.left);
  css(el, "width", rect.width);
  css(el, "height", rect.height);
}
function unsetRect(el) {
  css(el, "position", "");
  css(el, "top", "");
  css(el, "left", "");
  css(el, "width", "");
  css(el, "height", "");
}
var expando = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function AnimationStateManager() {
  var animationStates = [], animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function(child) {
        if (css(child, "display") === "none" || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === "function") callback();
        return;
      }
      var animating = false, animationTime = 0;
      animationStates.forEach(function(state) {
        var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
        if (targetMatrix) {
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function() {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === "function") callback();
      } else {
        animationCallbackId = setTimeout(function() {
          if (typeof callback === "function") callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, "transition", "");
        css(target, "transform", "");
        var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
        this.forRepaintDummy = repaint(target);
        css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
        css(target, "transform", "translate3d(0,0,0)");
        typeof target.animated === "number" && clearTimeout(target.animated);
        target.animated = setTimeout(function() {
          css(target, "transition", "");
          css(target, "transform", "");
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}
var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    for (var option2 in defaults) {
      if (defaults.hasOwnProperty(option2) && !(option2 in plugin)) {
        plugin[option2] = defaults[option2];
      }
    }
    plugins.forEach(function(p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function() {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + "Global";
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName]) return;
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable
        }, evt));
      }
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults2, options) {
    plugins.forEach(function(plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;
      _extends(defaults2, initialized.defaults);
    });
    for (var option2 in sortable.options) {
      if (!sortable.options.hasOwnProperty(option2)) continue;
      var modified = this.modifyOption(sortable, option2, sortable.options[option2]);
      if (typeof modified !== "undefined") {
        sortable.options[option2] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function(plugin) {
      if (typeof plugin.eventProperties !== "function") return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName]) return;
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
function dispatchEvent(_ref) {
  var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl2 && rootEl2[expando];
  if (!sortable) return;
  var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl2;
  evt.from = fromEl || rootEl2;
  evt.item = targetEl || rootEl2;
  evt.clone = cloneEl2;
  evt.oldIndex = oldIndex2;
  evt.newIndex = newIndex2;
  evt.oldDraggableIndex = oldDraggableIndex2;
  evt.newDraggableIndex = newDraggableIndex2;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option2 in allEventProperties) {
    evt[option2] = allEventProperties[option2];
  }
  if (rootEl2) {
    rootEl2.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
var _excluded = ["evt"];
var pluginEvent2 = function pluginEvent3(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    dragStarted: moved,
    putSortable,
    activeSortable: Sortable.active,
    originalEvent,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable,
        name,
        originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable,
    cloneEl,
    targetEl: dragEl,
    rootEl,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex
  }, info));
}
var dragEl, parentEl, ghostEl, rootEl, nextEl, lastDownEl, cloneEl, cloneHidden, oldIndex, newIndex, oldDraggableIndex, newDraggableIndex, activeGroup, putSortable, awaitingDragStarted = false, ignoreNextClick = false, sortables = [], tapEvt, touchEvt, lastDx, lastDy, tapDistanceLeft, tapDistanceTop, moved, lastTarget, lastDirection, pastFirstInvertThresh = false, isCircumstantialInvert = false, targetMoveDistance, ghostRelativeParent, ghostRelativeParentInitialScroll = [], _silent = false, savedInputChecked = [];
var documentExists = typeof document !== "undefined", PositionGhostAbsolutely = IOS, CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float", supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div"), supportCssPointerEvents = function() {
  if (!documentExists) return;
  if (IE11OrLess) {
    return false;
  }
  var el = document.createElement("x");
  el.style.cssText = "pointer-events:auto";
  return el.style.pointerEvents === "auto";
}(), _detectDirection = function _detectDirection2(el, options) {
  var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
  if (elCSS.display === "flex") {
    return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  }
  if (elCSS.display === "grid") {
    return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  }
  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
    var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
    return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
  }
  return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
}, _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
}, _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
  var ret;
  sortables.some(function(sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable)) return;
    var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
}, _prepareGroup = function _prepareGroup2(options) {
  function toFn(value, pull) {
    return function(to, from, dragEl2, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
      if (value == null && (pull || sameGroup)) {
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === "clone") {
        return value;
      } else if (typeof value === "function") {
        return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }
  var group = {};
  var originalGroup = options.group;
  if (!originalGroup || _typeof(originalGroup) != "object") {
    originalGroup = {
      name: originalGroup
    };
  }
  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
}, _hideGhostForTarget = function _hideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "none");
  }
}, _unhideGhostForTarget = function _unhideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "");
  }
};
if (documentExists) {
  document.addEventListener("click", function(evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el;
  this.options = options = _extends({}, options);
  el[expando] = this;
  var defaults2 = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl2) {
      dataTransfer.setData("Text", dragEl2.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults2);
  for (var name in defaults2) {
    !(name in options) && (options[name] = defaults2[name]);
  }
  _prepareGroup(options);
  for (var fn in this) {
    if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
      this[fn] = this[fn].bind(this);
    }
  }
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    this.options.touchStartThreshold = 1;
  }
  if (options.supportPointer) {
    on(el, "pointerdown", this._onTapStart);
  } else {
    on(el, "mousedown", this._onTapStart);
    on(el, "touchstart", this._onTapStart);
  }
  if (this.nativeDraggable) {
    on(el, "dragover", this);
    on(el, "dragenter", this);
  }
  sortables.push(this.el);
  options.store && options.store.get && this.sort(options.store.get(this) || []);
  _extends(this, AnimationStateManager());
}
Sortable.prototype = /** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(evt) {
    if (!evt.cancelable) return;
    var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
    _saveInputCheckedState(el);
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return;
    }
    if (originalTarget.isContentEditable) {
      return;
    }
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      return;
    }
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);
    if (typeof filter === "function") {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: "filter",
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent2("filter", _this, {
          evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    } else if (filter) {
      filter = filter.split(",").some(function(criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: "filter",
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent2("filter", _this, {
            evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(evt, touch, target) {
    var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style["will-change"] = "all";
      dragStartFn = function dragStartFn2() {
        pluginEvent2("delayEnded", _this, {
          evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }
        _this._triggerDragStart(evt, touch);
        _dispatchEvent({
          sortable: _this,
          name: "choose",
          originalEvent: evt
        });
        toggleClass(dragEl, options.chosenClass, true);
      };
      options.ignore.split(",").forEach(function(criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mouseup", _this._onDrop);
      on(ownerDocument, "touchend", _this._onDrop);
      on(ownerDocument, "touchcancel", _this._onDrop);
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent2("delayStart", this, {
        evt
      });
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        on(ownerDocument, "mouseup", _this._disableDelayedDrag);
        on(ownerDocument, "touchend", _this._disableDelayedDrag);
        on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._disableDelayedDrag);
    off(ownerDocument, "touchend", this._disableDelayedDrag);
    off(ownerDocument, "touchcancel", this._disableDelayedDrag);
    off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(evt, touch) {
    touch = touch || evt.pointerType == "touch" && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, "pointermove", this._onTouchMove);
      } else if (touch) {
        on(document, "touchmove", this._onTouchMove);
      } else {
        on(document, "mousemove", this._onTouchMove);
      }
    } else {
      on(dragEl, "dragend", this);
      on(rootEl, "dragstart", this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function() {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {
    }
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent2("dragStarted", this, {
        evt
      });
      if (this.nativeDraggable) {
        on(document, "dragover", _checkOutsideTargetEl);
      }
      var options = this.options;
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();
      _dispatchEvent({
        sortable: this,
        name: "start",
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent;
        } while (parent = parent.parentNode);
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(evt) {
    if (tapEvt) {
      var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, "webkitTransform", cssMatrix);
        css(ghostEl, "mozTransform", cssMatrix);
        css(ghostEl, "msTransform", cssMatrix);
        css(ghostEl, "transform", cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
      if (PositionGhostAbsolutely) {
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, "transition", "");
      css(ghostEl, "transform", "");
      css(ghostEl, "box-sizing", "border-box");
      css(ghostEl, "margin", 0);
      css(ghostEl, "top", rect.top);
      css(ghostEl, "left", rect.left);
      css(ghostEl, "width", rect.width);
      css(ghostEl, "height", rect.height);
      css(ghostEl, "opacity", "0.8");
      css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
      css(ghostEl, "zIndex", "100000");
      css(ghostEl, "pointerEvents", "none");
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);
      css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
    }
  },
  _onDragStart: function _onDragStart(evt, fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent2("dragStart", this, {
      evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent2("setupClone", this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }
    _this.cloneId = _nextTick(function() {
      pluginEvent2("clone", _this);
      if (Sortable.eventCanceled) return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: "clone"
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      off(document, "mouseup", _this._onDrop);
      off(document, "touchend", _this._onDrop);
      off(document, "touchcancel", _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = "move";
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on(document, "drop", _this);
      css(dragEl, "transform", "translateZ(0)");
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, "selectstart", _this);
    moved = true;
    if (Safari) {
      css(document.body, "user-select", "none");
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(evt) {
    var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
    if (_silent) return;
    function dragOverEvent(name, extra) {
      pluginEvent2(name, _this, _objectSpread2({
        evt,
        isOwner,
        axis: vertical ? "vertical" : "horizontal",
        revert,
        dragRect,
        targetRect,
        canSort,
        fromSortable,
        target,
        completed,
        onMove: function onMove(target2, after2) {
          return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
        },
        changed
      }, extra));
    }
    function capture() {
      dragOverEvent("dragOverAnimationCapture");
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }
    function completed(insertion) {
      dragOverEvent("dragOverCompleted", {
        insertion
      });
      if (insertion) {
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function() {
          dragOverEvent("dragOverAnimationComplete");
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: "change",
        toEl: el,
        newIndex,
        newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent("dragOver");
    if (Sortable.eventCanceled) return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === "vertical";
      dragRect = getRect(dragEl);
      dragOverEvent("dragOverValid");
      if (Sortable.eventCanceled) return completedFired;
      if (revert) {
        parentEl = rootEl;
        capture();
        this._hideClone();
        dragOverEvent("revert");
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        if (elLastChild === dragEl) {
          return completed(false);
        }
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild(dragEl);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
        }
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling, after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode;
          if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, "mousemove", this._onTouchMove);
    off(document, "touchmove", this._onTouchMove);
    off(document, "pointermove", this._onTouchMove);
    off(document, "dragover", nearestEmptyInsertDetectEvent);
    off(document, "mousemove", nearestEmptyInsertDetectEvent);
    off(document, "touchmove", nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._onDrop);
    off(ownerDocument, "touchend", this._onDrop);
    off(ownerDocument, "pointerup", this._onDrop);
    off(ownerDocument, "touchcancel", this._onDrop);
    off(document, "selectstart", this);
  },
  _onDrop: function _onDrop(evt) {
    var el = this.el, options = this.options;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent2("drop", this, {
      evt
    });
    parentEl = dragEl && dragEl.parentNode;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);
    if (this.nativeDraggable) {
      off(document, "drop", this);
      off(el, "dragstart", this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, "user-select", "");
    }
    css(dragEl, "transform", "");
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, "dragend", this);
        }
        _disableDraggable(dragEl);
        dragEl.style["will-change"] = "";
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);
        _dispatchEvent({
          sortable: this,
          name: "unchoose",
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            _dispatchEvent({
              rootEl: parentEl,
              name: "add",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "remove",
              toEl: parentEl,
              originalEvent: evt
            });
            _dispatchEvent({
              rootEl: parentEl,
              name: "sort",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "sort",
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              _dispatchEvent({
                sortable: this,
                name: "update",
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: "end",
            toEl: parentEl,
            originalEvent: evt
          });
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent2("nulling", this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function(el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(evt) {
    switch (evt.type) {
      case "drop":
      case "dragend":
        this._onDrop(evt);
        break;
      case "dragenter":
      case "dragover":
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case "selectstart":
        evt.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {}, rootEl2 = this.el;
    this.toArray().forEach(function(id, i) {
      var el = rootEl2.children[i];
      if (closest(el, this.options.draggable, rootEl2, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function(id) {
      if (items[id]) {
        rootEl2.removeChild(items[id]);
        rootEl2.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== "undefined") {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === "group") {
        _prepareGroup(options);
      }
    }
  },
  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent2("destroy", this);
    var el = this.el;
    el[expando] = null;
    off(el, "mousedown", this._onTapStart);
    off(el, "touchstart", this._onTapStart);
    off(el, "pointerdown", this._onTapStart);
    if (this.nativeDraggable) {
      off(el, "dragover", this);
      off(el, "dragenter", this);
    }
    Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
      el2.removeAttribute("draggable");
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent2("hideClone", this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, "display", "none");
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable2) {
    if (putSortable2.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent2("showClone", this);
      if (Sortable.eventCanceled) return;
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, "display", "");
      cloneHidden = false;
    }
  }
};
function _globalDragOver(evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = "move";
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent("move", {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent("move", true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl2;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
  if (!invertSwap) {
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName("input");
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn) {
  return setTimeout(fn, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}
if (documentExists) {
  on(document, "touchmove", function(evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}
Sortable.utils = {
  on,
  off,
  css,
  find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend,
  throttle,
  closest,
  toggleClass,
  clone,
  index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild
};
Sortable.get = function(element) {
  return element[expando];
};
Sortable.mount = function() {
  for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins2[_key] = arguments[_key];
  }
  if (plugins2[0].constructor === Array) plugins2 = plugins2[0];
  plugins2.forEach(function(plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
Sortable.create = function(el, options) {
  return new Sortable(el, options);
};
Sortable.version = version;
var autoScrolls = [], scrollEl, scrollRootEl, scrolling = false, lastAutoScrollX, lastAutoScrollY, touchEvt$1, pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };
    for (var fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted2(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on(document, "dragover", this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, "touchmove", this._handleFallbackAutoScroll);
        } else {
          on(document, "mousemove", this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop3() {
      if (this.sortable.nativeDraggable) {
        off(document, "dragover", this._handleAutoScroll);
      } else {
        off(document, "pointermove", this._handleFallbackAutoScroll);
        off(document, "touchmove", this._handleFallbackAutoScroll);
        off(document, "mousemove", this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          pointerElemChangedInterval = setInterval(function() {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: "scroll",
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function(autoScroll2) {
    clearInterval(autoScroll2.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
  var scrollThisInstance = false, scrollCustomFn;
  if (scrollRootEl !== rootEl2) {
    scrollRootEl = rootEl2;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl2, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
    }
    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        autoScrolls[layersOut].pid = setInterval((function() {
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1);
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === "function") {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }).bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance;
}, 30);
var drop = function drop2(_ref) {
  var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable2 || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent("spill");
    this.onSpill({
      dragEl: dragEl2,
      putSortable: putSortable2
    });
  }
};
function Revert() {
}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex2 = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex2;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable2) {
      putSortable2.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl2, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl2);
    }
    this.sortable.animateAll();
    if (putSortable2) {
      putSortable2.animateAll();
    }
  },
  drop
};
_extends(Revert, {
  pluginName: "revertOnSpill"
});
function Remove() {
}
Remove.prototype = {
  onSpill: function onSpill2(_ref4) {
    var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
    var parentSortable = putSortable2 || this.sortable;
    parentSortable.captureAnimationState();
    dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
    parentSortable.animateAll();
  },
  drop
};
_extends(Remove, {
  pluginName: "removeOnSpill"
});
var lastSwapEl;
function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: "sortable-swap-highlight"
    };
  }
  Swap.prototype = {
    dragStart: function dragStart2(_ref) {
      var dragEl2 = _ref.dragEl;
      lastSwapEl = dragEl2;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed, target = _ref2.target, onMove = _ref2.onMove, activeSortable = _ref2.activeSortable, changed = _ref2.changed, cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el, options = this.options;
      if (target && target !== el) {
        var prevSwapEl = lastSwapEl;
        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }
        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }
      changed();
      completed(true);
      cancel();
    },
    drop: function drop3(_ref3) {
      var activeSortable = _ref3.activeSortable, putSortable2 = _ref3.putSortable, dragEl2 = _ref3.dragEl;
      var toSortable = putSortable2 || this.sortable;
      var options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);
      if (lastSwapEl && (options.swap || putSortable2 && putSortable2.options.swap)) {
        if (dragEl2 !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl2, lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      lastSwapEl = null;
    }
  };
  return _extends(Swap, {
    pluginName: "swap",
    eventProperties: function eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}
function swapNodes(n1, n2) {
  var p1 = n1.parentNode, p2 = n2.parentNode, i1, i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = index(n1);
  i2 = index(n2);
  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }
  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}
var multiDragElements = [], multiDragClones = [], lastMultiDragSelect, multiDragSortable, initialFolding = false, folding = false, dragStarted = false, dragEl$1, clonesFromRect, clonesHidden;
function MultiDragPlugin() {
  function MultiDrag(sortable) {
    for (var fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
    if (sortable.options.supportPointer) {
      on(document, "pointerup", this._deselectMultiDrag);
    } else {
      on(document, "mouseup", this._deselectMultiDrag);
      on(document, "touchend", this._deselectMultiDrag);
    }
    on(document, "keydown", this._checkKeyDown);
    on(document, "keyup", this._checkKeyUp);
    this.defaults = {
      selectedClass: "sortable-selected",
      multiDragKey: null,
      setData: function setData(dataTransfer, dragEl2) {
        var data = "";
        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach(function(multiDragElement, i) {
            data += (!i ? "" : ", ") + multiDragElement.textContent;
          });
        } else {
          data = dragEl2.textContent;
        }
        dataTransfer.setData("Text", data);
      }
    };
  }
  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      dragEl$1 = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable, cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;
      for (var i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));
        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
        multiDragClones[i].draggable = false;
        multiDragClones[i].style["will-change"] = "";
        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }
      sortable._hideClone();
      cancel();
    },
    clone: function clone2(_ref3) {
      var sortable = _ref3.sortable, rootEl2 = _ref3.rootEl, dispatchSortableEvent = _ref3.dispatchSortableEvent, cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;
      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl2);
          dispatchSortableEvent("clone");
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown, rootEl2 = _ref4.rootEl, cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl2);
      multiDragClones.forEach(function(clone2) {
        css(clone2, "display", "");
      });
      cloneNowShown();
      clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;
      _ref5.sortable;
      var cloneNowHidden = _ref5.cloneNowHidden, cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      multiDragClones.forEach(function(clone2) {
        css(clone2, "display", "none");
        if (_this.options.removeCloneOnHide && clone2.parentNode) {
          clone2.parentNode.removeChild(clone2);
        }
      });
      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      _ref6.sortable;
      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }
      multiDragElements.forEach(function(multiDragElement) {
        multiDragElement.sortableIndex = index(multiDragElement);
      });
      multiDragElements = multiDragElements.sort(function(a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },
    dragStarted: function dragStarted2(_ref7) {
      var _this2 = this;
      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;
      if (this.options.sort) {
        sortable.captureAnimationState();
        if (this.options.animation) {
          multiDragElements.forEach(function(multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, "position", "absolute");
          });
          var dragRect = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function(multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });
          folding = true;
          initialFolding = true;
        }
      }
      sortable.animateAll(function() {
        folding = false;
        initialFolding = false;
        if (_this2.options.animation) {
          multiDragElements.forEach(function(multiDragElement) {
            unsetRect(multiDragElement);
          });
        }
        if (_this2.options.sort) {
          removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target, completed = _ref8.completed, cancel = _ref8.cancel;
      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable, rootEl2 = _ref9.rootEl, sortable = _ref9.sortable, dragRect = _ref9.dragRect;
      if (multiDragElements.length > 1) {
        multiDragElements.forEach(function(multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect
          });
          unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl2);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable, isOwner = _ref10.isOwner, insertion = _ref10.insertion, activeSortable = _ref10.activeSortable, parentEl2 = _ref10.parentEl, putSortable2 = _ref10.putSortable;
      var options = this.options;
      if (insertion) {
        if (isOwner) {
          activeSortable._hideClone();
        }
        initialFolding = false;
        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable2)) {
          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function(multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute);
            parentEl2.appendChild(multiDragElement);
          });
          folding = true;
        }
        if (!isOwner) {
          if (!folding) {
            removeMultiDragElements();
          }
          if (multiDragElements.length > 1) {
            var clonesHiddenBefore = clonesHidden;
            activeSortable._showClone(sortable);
            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
              multiDragClones.forEach(function(clone2) {
                activeSortable.addAnimationState({
                  target: clone2,
                  rect: clonesFromRect
                });
                clone2.fromRect = clonesFromRect;
                clone2.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },
    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
      var dragRect = _ref11.dragRect, isOwner = _ref11.isOwner, activeSortable = _ref11.activeSortable;
      multiDragElements.forEach(function(multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });
      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        clonesFromRect = _extends({}, dragRect);
        var dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },
    drop: function drop3(_ref12) {
      var evt = _ref12.originalEvent, rootEl2 = _ref12.rootEl, parentEl2 = _ref12.parentEl, sortable = _ref12.sortable, dispatchSortableEvent = _ref12.dispatchSortableEvent, oldIndex2 = _ref12.oldIndex, putSortable2 = _ref12.putSortable;
      var toSortable = putSortable2 || this.sortable;
      if (!evt) return;
      var options = this.options, children = parentEl2.children;
      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }
        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));
        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable,
            rootEl: rootEl2,
            name: "select",
            targetEl: dragEl$1
          });
          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
            var lastIndex = index(lastMultiDragSelect), currentIndex = index(dragEl$1);
            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              var n, i;
              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }
              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);
                dispatchEvent({
                  sortable,
                  rootEl: rootEl2,
                  name: "select",
                  targetEl: children[i]
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }
          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable,
            rootEl: rootEl2,
            name: "deselect",
            targetEl: dragEl$1
          });
        }
      }
      if (dragStarted && this.isMultiDrag) {
        folding = false;
        if ((parentEl2[expando].options.sort || parentEl2 !== rootEl2) && multiDragElements.length > 1) {
          var dragRect = getRect(dragEl$1), multiDragIndex = index(dragEl$1, ":not(." + this.options.selectedClass + ")");
          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
          toSortable.captureAnimationState();
          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach(function(multiDragElement) {
                multiDragElement.thisAnimationDuration = null;
                if (multiDragElement !== dragEl$1) {
                  var rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect;
                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect
                  });
                }
              });
            }
            removeMultiDragElements();
            multiDragElements.forEach(function(multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl2.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl2.appendChild(multiDragElement);
              }
              multiDragIndex++;
            });
            if (oldIndex2 === index(dragEl$1)) {
              var update = false;
              multiDragElements.forEach(function(multiDragElement) {
                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                  update = true;
                  return;
                }
              });
              if (update) {
                dispatchSortableEvent("update");
              }
            }
          }
          multiDragElements.forEach(function(multiDragElement) {
            unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }
        multiDragSortable = toSortable;
      }
      if (rootEl2 === parentEl2 || putSortable2 && putSortable2.lastPutMode !== "clone") {
        multiDragClones.forEach(function(clone2) {
          clone2.parentNode && clone2.parentNode.removeChild(clone2);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();
      off(document, "pointerup", this._deselectMultiDrag);
      off(document, "mouseup", this._deselectMultiDrag);
      off(document, "touchend", this._deselectMultiDrag);
      off(document, "keydown", this._checkKeyDown);
      off(document, "keyup", this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return;
      if (multiDragSortable !== this.sortable) return;
      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return;
      if (evt && evt.button !== 0) return;
      while (multiDragElements.length) {
        var el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: "deselect",
          targetEl: el
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return _extends(MultiDrag, {
    // Static methods & properties
    pluginName: "multiDrag",
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[expando];
        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;
        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();
          multiDragSortable = sortable;
        }
        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },
      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[expando], index2 = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index2) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index2, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;
      var oldIndicies = [], newIndicies = [];
      multiDragElements.forEach(function(multiDragElement) {
        oldIndicies.push({
          multiDragElement,
          index: multiDragElement.sortableIndex
        });
        var newIndex2;
        if (folding && multiDragElement !== dragEl$1) {
          newIndex2 = -1;
        } else if (folding) {
          newIndex2 = index(multiDragElement, ":not(." + _this3.options.selectedClass + ")");
        } else {
          newIndex2 = index(multiDragElement);
        }
        newIndicies.push({
          multiDragElement,
          index: newIndex2
        });
      });
      return {
        items: _toConsumableArray(multiDragElements),
        clones: [].concat(multiDragClones),
        oldIndicies,
        newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();
        if (key === "ctrl") {
          key = "Control";
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }
        return key;
      }
    }
  });
}
function insertMultiDragElements(clonesInserted, rootEl2) {
  multiDragElements.forEach(function(multiDragElement, i) {
    var target = rootEl2.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];
    if (target) {
      rootEl2.insertBefore(multiDragElement, target);
    } else {
      rootEl2.appendChild(multiDragElement);
    }
  });
}
function insertMultiDragClones(elementsInserted, rootEl2) {
  multiDragClones.forEach(function(clone2, i) {
    var target = rootEl2.children[clone2.sortableIndex + (elementsInserted ? Number(i) : 0)];
    if (target) {
      rootEl2.insertBefore(clone2, target);
    } else {
      rootEl2.appendChild(clone2);
    }
  });
}
function removeMultiDragElements() {
  multiDragElements.forEach(function(multiDragElement) {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}
Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);
const sortable_esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultiDrag: MultiDragPlugin,
  Sortable,
  Swap: SwapPlugin,
  default: Sortable
}, Symbol.toStringTag, { value: "Module" }));
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(sortable_esm);
(function(module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory(require$$0, require$$1);
  })(typeof self !== "undefined" ? self : commonjsGlobal, function(__WEBPACK_EXTERNAL_MODULE__8bbf__, __WEBPACK_EXTERNAL_MODULE_a352__) {
    return (
      /******/
      function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
          if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
          }
          var module2 = installedModules[moduleId] = {
            /******/
            i: moduleId,
            /******/
            l: false,
            /******/
            exports: {}
            /******/
          };
          modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
          module2.l = true;
          return module2.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports2, name, getter) {
          if (!__webpack_require__.o(exports2, name)) {
            Object.defineProperty(exports2, name, { enumerable: true, get: getter });
          }
        };
        __webpack_require__.r = function(exports2) {
          if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
          }
          Object.defineProperty(exports2, "__esModule", { value: true });
        };
        __webpack_require__.t = function(value, mode) {
          if (mode & 1) value = __webpack_require__(value);
          if (mode & 8) return value;
          if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
          var ns = /* @__PURE__ */ Object.create(null);
          __webpack_require__.r(ns);
          Object.defineProperty(ns, "default", { enumerable: true, value });
          if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, (function(key2) {
            return value[key2];
          }).bind(null, key));
          return ns;
        };
        __webpack_require__.n = function(module2) {
          var getter = module2 && module2.__esModule ? (
            /******/
            function getDefault() {
              return module2["default"];
            }
          ) : (
            /******/
            function getModuleExports() {
              return module2;
            }
          );
          __webpack_require__.d(getter, "a", getter);
          return getter;
        };
        __webpack_require__.o = function(object, property) {
          return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = "fb15");
      }({
        /***/
        "00ee": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var wellKnownSymbol = __webpack_require__("b622");
            var TO_STRING_TAG = wellKnownSymbol("toStringTag");
            var test = {};
            test[TO_STRING_TAG] = "z";
            module2.exports = String(test) === "[object z]";
          }
        ),
        /***/
        "0366": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var aFunction = __webpack_require__("1c0b");
            module2.exports = function(fn, that, length) {
              aFunction(fn);
              if (that === void 0) return fn;
              switch (length) {
                case 0:
                  return function() {
                    return fn.call(that);
                  };
                case 1:
                  return function(a) {
                    return fn.call(that, a);
                  };
                case 2:
                  return function(a, b) {
                    return fn.call(that, a, b);
                  };
                case 3:
                  return function(a, b, c) {
                    return fn.call(that, a, b, c);
                  };
              }
              return function() {
                return fn.apply(that, arguments);
              };
            };
          }
        ),
        /***/
        "057f": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var toIndexedObject = __webpack_require__("fc6a");
            var nativeGetOwnPropertyNames = __webpack_require__("241c").f;
            var toString = {}.toString;
            var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
            var getWindowNames = function(it) {
              try {
                return nativeGetOwnPropertyNames(it);
              } catch (error) {
                return windowNames.slice();
              }
            };
            module2.exports.f = function getOwnPropertyNames(it) {
              return windowNames && toString.call(it) == "[object Window]" ? getWindowNames(it) : nativeGetOwnPropertyNames(toIndexedObject(it));
            };
          }
        ),
        /***/
        "06cf": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var propertyIsEnumerableModule = __webpack_require__("d1e7");
            var createPropertyDescriptor = __webpack_require__("5c6c");
            var toIndexedObject = __webpack_require__("fc6a");
            var toPrimitive = __webpack_require__("c04e");
            var has = __webpack_require__("5135");
            var IE8_DOM_DEFINE = __webpack_require__("0cfb");
            var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            exports2.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
              O = toIndexedObject(O);
              P = toPrimitive(P, true);
              if (IE8_DOM_DEFINE) try {
                return nativeGetOwnPropertyDescriptor(O, P);
              } catch (error) {
              }
              if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
            };
          }
        ),
        /***/
        "0cfb": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var fails = __webpack_require__("d039");
            var createElement = __webpack_require__("cc12");
            module2.exports = !DESCRIPTORS && !fails(function() {
              return Object.defineProperty(createElement("div"), "a", {
                get: function() {
                  return 7;
                }
              }).a != 7;
            });
          }
        ),
        /***/
        "13d5": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var $reduce = __webpack_require__("d58f").left;
            var arrayMethodIsStrict = __webpack_require__("a640");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var STRICT_METHOD = arrayMethodIsStrict("reduce");
            var USES_TO_LENGTH = arrayMethodUsesToLength("reduce", { 1: 0 });
            $({ target: "Array", proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
              reduce: function reduce(callbackfn) {
                return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
          }
        ),
        /***/
        "14c3": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var classof = __webpack_require__("c6b6");
            var regexpExec = __webpack_require__("9263");
            module2.exports = function(R, S) {
              var exec = R.exec;
              if (typeof exec === "function") {
                var result = exec.call(R, S);
                if (typeof result !== "object") {
                  throw TypeError("RegExp exec method returned something other than an Object or null");
                }
                return result;
              }
              if (classof(R) !== "RegExp") {
                throw TypeError("RegExp#exec called on incompatible receiver");
              }
              return regexpExec.call(R, S);
            };
          }
        ),
        /***/
        "159b": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var DOMIterables = __webpack_require__("fdbc");
            var forEach = __webpack_require__("17c2");
            var createNonEnumerableProperty = __webpack_require__("9112");
            for (var COLLECTION_NAME in DOMIterables) {
              var Collection = global2[COLLECTION_NAME];
              var CollectionPrototype = Collection && Collection.prototype;
              if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
                createNonEnumerableProperty(CollectionPrototype, "forEach", forEach);
              } catch (error) {
                CollectionPrototype.forEach = forEach;
              }
            }
          }
        ),
        /***/
        "17c2": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $forEach = __webpack_require__("b727").forEach;
            var arrayMethodIsStrict = __webpack_require__("a640");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var STRICT_METHOD = arrayMethodIsStrict("forEach");
            var USES_TO_LENGTH = arrayMethodUsesToLength("forEach");
            module2.exports = !STRICT_METHOD || !USES_TO_LENGTH ? function forEach(callbackfn) {
              return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
            } : [].forEach;
          }
        ),
        /***/
        "1be4": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var getBuiltIn = __webpack_require__("d066");
            module2.exports = getBuiltIn("document", "documentElement");
          }
        ),
        /***/
        "1c0b": (
          /***/
          function(module2, exports2) {
            module2.exports = function(it) {
              if (typeof it != "function") {
                throw TypeError(String(it) + " is not a function");
              }
              return it;
            };
          }
        ),
        /***/
        "1c7e": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var wellKnownSymbol = __webpack_require__("b622");
            var ITERATOR = wellKnownSymbol("iterator");
            var SAFE_CLOSING = false;
            try {
              var called = 0;
              var iteratorWithReturn = {
                next: function() {
                  return { done: !!called++ };
                },
                "return": function() {
                  SAFE_CLOSING = true;
                }
              };
              iteratorWithReturn[ITERATOR] = function() {
                return this;
              };
              Array.from(iteratorWithReturn, function() {
                throw 2;
              });
            } catch (error) {
            }
            module2.exports = function(exec, SKIP_CLOSING) {
              if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
              var ITERATION_SUPPORT = false;
              try {
                var object = {};
                object[ITERATOR] = function() {
                  return {
                    next: function() {
                      return { done: ITERATION_SUPPORT = true };
                    }
                  };
                };
                exec(object);
              } catch (error) {
              }
              return ITERATION_SUPPORT;
            };
          }
        ),
        /***/
        "1d80": (
          /***/
          function(module2, exports2) {
            module2.exports = function(it) {
              if (it == void 0) throw TypeError("Can't call method on " + it);
              return it;
            };
          }
        ),
        /***/
        "1dde": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            var wellKnownSymbol = __webpack_require__("b622");
            var V8_VERSION = __webpack_require__("2d00");
            var SPECIES = wellKnownSymbol("species");
            module2.exports = function(METHOD_NAME) {
              return V8_VERSION >= 51 || !fails(function() {
                var array = [];
                var constructor = array.constructor = {};
                constructor[SPECIES] = function() {
                  return { foo: 1 };
                };
                return array[METHOD_NAME](Boolean).foo !== 1;
              });
            };
          }
        ),
        /***/
        "23cb": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var toInteger = __webpack_require__("a691");
            var max = Math.max;
            var min = Math.min;
            module2.exports = function(index2, length) {
              var integer = toInteger(index2);
              return integer < 0 ? max(integer + length, 0) : min(integer, length);
            };
          }
        ),
        /***/
        "23e7": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
            var createNonEnumerableProperty = __webpack_require__("9112");
            var redefine = __webpack_require__("6eeb");
            var setGlobal = __webpack_require__("ce4e");
            var copyConstructorProperties = __webpack_require__("e893");
            var isForced = __webpack_require__("94ca");
            module2.exports = function(options, source) {
              var TARGET = options.target;
              var GLOBAL = options.global;
              var STATIC = options.stat;
              var FORCED, target, key, targetProperty, sourceProperty, descriptor;
              if (GLOBAL) {
                target = global2;
              } else if (STATIC) {
                target = global2[TARGET] || setGlobal(TARGET, {});
              } else {
                target = (global2[TARGET] || {}).prototype;
              }
              if (target) for (key in source) {
                sourceProperty = source[key];
                if (options.noTargetGet) {
                  descriptor = getOwnPropertyDescriptor(target, key);
                  targetProperty = descriptor && descriptor.value;
                } else targetProperty = target[key];
                FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
                if (!FORCED && targetProperty !== void 0) {
                  if (typeof sourceProperty === typeof targetProperty) continue;
                  copyConstructorProperties(sourceProperty, targetProperty);
                }
                if (options.sham || targetProperty && targetProperty.sham) {
                  createNonEnumerableProperty(sourceProperty, "sham", true);
                }
                redefine(target, key, sourceProperty, options);
              }
            };
          }
        ),
        /***/
        "241c": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var internalObjectKeys = __webpack_require__("ca84");
            var enumBugKeys = __webpack_require__("7839");
            var hiddenKeys = enumBugKeys.concat("length", "prototype");
            exports2.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
              return internalObjectKeys(O, hiddenKeys);
            };
          }
        ),
        /***/
        "25f0": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var redefine = __webpack_require__("6eeb");
            var anObject = __webpack_require__("825a");
            var fails = __webpack_require__("d039");
            var flags = __webpack_require__("ad6d");
            var TO_STRING = "toString";
            var RegExpPrototype = RegExp.prototype;
            var nativeToString = RegExpPrototype[TO_STRING];
            var NOT_GENERIC = fails(function() {
              return nativeToString.call({ source: "a", flags: "b" }) != "/a/b";
            });
            var INCORRECT_NAME = nativeToString.name != TO_STRING;
            if (NOT_GENERIC || INCORRECT_NAME) {
              redefine(RegExp.prototype, TO_STRING, function toString() {
                var R = anObject(this);
                var p = String(R.source);
                var rf = R.flags;
                var f = String(rf === void 0 && R instanceof RegExp && !("flags" in RegExpPrototype) ? flags.call(R) : rf);
                return "/" + p + "/" + f;
              }, { unsafe: true });
            }
          }
        ),
        /***/
        "2ca0": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
            var toLength = __webpack_require__("50c4");
            var notARegExp = __webpack_require__("5a34");
            var requireObjectCoercible = __webpack_require__("1d80");
            var correctIsRegExpLogic = __webpack_require__("ab13");
            var IS_PURE = __webpack_require__("c430");
            var nativeStartsWith = "".startsWith;
            var min = Math.min;
            var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("startsWith");
            var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function() {
              var descriptor = getOwnPropertyDescriptor(String.prototype, "startsWith");
              return descriptor && !descriptor.writable;
            }();
            $({ target: "String", proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
              startsWith: function startsWith(searchString) {
                var that = String(requireObjectCoercible(this));
                notARegExp(searchString);
                var index2 = toLength(min(arguments.length > 1 ? arguments[1] : void 0, that.length));
                var search = String(searchString);
                return nativeStartsWith ? nativeStartsWith.call(that, search, index2) : that.slice(index2, index2 + search.length) === search;
              }
            });
          }
        ),
        /***/
        "2d00": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var userAgent2 = __webpack_require__("342f");
            var process2 = global2.process;
            var versions = process2 && process2.versions;
            var v8 = versions && versions.v8;
            var match, version2;
            if (v8) {
              match = v8.split(".");
              version2 = match[0] + match[1];
            } else if (userAgent2) {
              match = userAgent2.match(/Edge\/(\d+)/);
              if (!match || match[1] >= 74) {
                match = userAgent2.match(/Chrome\/(\d+)/);
                if (match) version2 = match[1];
              }
            }
            module2.exports = version2 && +version2;
          }
        ),
        /***/
        "342f": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var getBuiltIn = __webpack_require__("d066");
            module2.exports = getBuiltIn("navigator", "userAgent") || "";
          }
        ),
        /***/
        "35a1": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var classof = __webpack_require__("f5df");
            var Iterators = __webpack_require__("3f8c");
            var wellKnownSymbol = __webpack_require__("b622");
            var ITERATOR = wellKnownSymbol("iterator");
            module2.exports = function(it) {
              if (it != void 0) return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
            };
          }
        ),
        /***/
        "37e8": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var definePropertyModule = __webpack_require__("9bf2");
            var anObject = __webpack_require__("825a");
            var objectKeys = __webpack_require__("df75");
            module2.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
              anObject(O);
              var keys = objectKeys(Properties);
              var length = keys.length;
              var index2 = 0;
              var key;
              while (length > index2) definePropertyModule.f(O, key = keys[index2++], Properties[key]);
              return O;
            };
          }
        ),
        /***/
        "3bbe": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var isObject2 = __webpack_require__("861d");
            module2.exports = function(it) {
              if (!isObject2(it) && it !== null) {
                throw TypeError("Can't set " + String(it) + " as a prototype");
              }
              return it;
            };
          }
        ),
        /***/
        "3ca3": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var charAt = __webpack_require__("6547").charAt;
            var InternalStateModule = __webpack_require__("69f3");
            var defineIterator = __webpack_require__("7dd0");
            var STRING_ITERATOR = "String Iterator";
            var setInternalState = InternalStateModule.set;
            var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
            defineIterator(String, "String", function(iterated) {
              setInternalState(this, {
                type: STRING_ITERATOR,
                string: String(iterated),
                index: 0
              });
            }, function next() {
              var state = getInternalState(this);
              var string = state.string;
              var index2 = state.index;
              var point;
              if (index2 >= string.length) return { value: void 0, done: true };
              point = charAt(string, index2);
              state.index += point.length;
              return { value: point, done: false };
            });
          }
        ),
        /***/
        "3f8c": (
          /***/
          function(module2, exports2) {
            module2.exports = {};
          }
        ),
        /***/
        "4160": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var forEach = __webpack_require__("17c2");
            $({ target: "Array", proto: true, forced: [].forEach != forEach }, {
              forEach
            });
          }
        ),
        /***/
        "428f": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            module2.exports = global2;
          }
        ),
        /***/
        "44ad": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            var classof = __webpack_require__("c6b6");
            var split = "".split;
            module2.exports = fails(function() {
              return !Object("z").propertyIsEnumerable(0);
            }) ? function(it) {
              return classof(it) == "String" ? split.call(it, "") : Object(it);
            } : Object;
          }
        ),
        /***/
        "44d2": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var wellKnownSymbol = __webpack_require__("b622");
            var create2 = __webpack_require__("7c73");
            var definePropertyModule = __webpack_require__("9bf2");
            var UNSCOPABLES = wellKnownSymbol("unscopables");
            var ArrayPrototype = Array.prototype;
            if (ArrayPrototype[UNSCOPABLES] == void 0) {
              definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
                configurable: true,
                value: create2(null)
              });
            }
            module2.exports = function(key) {
              ArrayPrototype[UNSCOPABLES][key] = true;
            };
          }
        ),
        /***/
        "44e7": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var isObject2 = __webpack_require__("861d");
            var classof = __webpack_require__("c6b6");
            var wellKnownSymbol = __webpack_require__("b622");
            var MATCH = wellKnownSymbol("match");
            module2.exports = function(it) {
              var isRegExp2;
              return isObject2(it) && ((isRegExp2 = it[MATCH]) !== void 0 ? !!isRegExp2 : classof(it) == "RegExp");
            };
          }
        ),
        /***/
        "4930": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            module2.exports = !!Object.getOwnPropertySymbols && !fails(function() {
              return !String(Symbol());
            });
          }
        ),
        /***/
        "4d64": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var toIndexedObject = __webpack_require__("fc6a");
            var toLength = __webpack_require__("50c4");
            var toAbsoluteIndex = __webpack_require__("23cb");
            var createMethod = function(IS_INCLUDES) {
              return function($this, el, fromIndex) {
                var O = toIndexedObject($this);
                var length = toLength(O.length);
                var index2 = toAbsoluteIndex(fromIndex, length);
                var value;
                if (IS_INCLUDES && el != el) while (length > index2) {
                  value = O[index2++];
                  if (value != value) return true;
                }
                else for (; length > index2; index2++) {
                  if ((IS_INCLUDES || index2 in O) && O[index2] === el) return IS_INCLUDES || index2 || 0;
                }
                return !IS_INCLUDES && -1;
              };
            };
            module2.exports = {
              // `Array.prototype.includes` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.includes
              includes: createMethod(true),
              // `Array.prototype.indexOf` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
              indexOf: createMethod(false)
            };
          }
        ),
        /***/
        "4de4": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var $filter = __webpack_require__("b727").filter;
            var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("filter");
            var USES_TO_LENGTH = arrayMethodUsesToLength("filter");
            $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
              filter: function filter(callbackfn) {
                return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
          }
        ),
        /***/
        "4df4": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var bind = __webpack_require__("0366");
            var toObject = __webpack_require__("7b0b");
            var callWithSafeIterationClosing = __webpack_require__("9bdd");
            var isArrayIteratorMethod = __webpack_require__("e95a");
            var toLength = __webpack_require__("50c4");
            var createProperty = __webpack_require__("8418");
            var getIteratorMethod = __webpack_require__("35a1");
            module2.exports = function from(arrayLike) {
              var O = toObject(arrayLike);
              var C = typeof this == "function" ? this : Array;
              var argumentsLength = arguments.length;
              var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
              var mapping = mapfn !== void 0;
              var iteratorMethod = getIteratorMethod(O);
              var index2 = 0;
              var length, result, step, iterator, next, value;
              if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : void 0, 2);
              if (iteratorMethod != void 0 && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
                iterator = iteratorMethod.call(O);
                next = iterator.next;
                result = new C();
                for (; !(step = next.call(iterator)).done; index2++) {
                  value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index2], true) : step.value;
                  createProperty(result, index2, value);
                }
              } else {
                length = toLength(O.length);
                result = new C(length);
                for (; length > index2; index2++) {
                  value = mapping ? mapfn(O[index2], index2) : O[index2];
                  createProperty(result, index2, value);
                }
              }
              result.length = index2;
              return result;
            };
          }
        ),
        /***/
        "4fad": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var $entries = __webpack_require__("6f53").entries;
            $({ target: "Object", stat: true }, {
              entries: function entries(O) {
                return $entries(O);
              }
            });
          }
        ),
        /***/
        "50c4": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var toInteger = __webpack_require__("a691");
            var min = Math.min;
            module2.exports = function(argument) {
              return argument > 0 ? min(toInteger(argument), 9007199254740991) : 0;
            };
          }
        ),
        /***/
        "5135": (
          /***/
          function(module2, exports2) {
            var hasOwnProperty2 = {}.hasOwnProperty;
            module2.exports = function(it, key) {
              return hasOwnProperty2.call(it, key);
            };
          }
        ),
        /***/
        "5319": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
            var anObject = __webpack_require__("825a");
            var toObject = __webpack_require__("7b0b");
            var toLength = __webpack_require__("50c4");
            var toInteger = __webpack_require__("a691");
            var requireObjectCoercible = __webpack_require__("1d80");
            var advanceStringIndex = __webpack_require__("8aa5");
            var regExpExec = __webpack_require__("14c3");
            var max = Math.max;
            var min = Math.min;
            var floor = Math.floor;
            var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
            var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;
            var maybeToString = function(it) {
              return it === void 0 ? it : String(it);
            };
            fixRegExpWellKnownSymbolLogic("replace", 2, function(REPLACE, nativeReplace, maybeCallNative, reason) {
              var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
              var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
              var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? "$" : "$0";
              return [
                // `String.prototype.replace` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.replace
                function replace(searchValue, replaceValue) {
                  var O = requireObjectCoercible(this);
                  var replacer = searchValue == void 0 ? void 0 : searchValue[REPLACE];
                  return replacer !== void 0 ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
                },
                // `RegExp.prototype[@@replace]` method
                // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
                function(regexp, replaceValue) {
                  if (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0 || typeof replaceValue === "string" && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1) {
                    var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
                    if (res.done) return res.value;
                  }
                  var rx = anObject(regexp);
                  var S = String(this);
                  var functionalReplace = typeof replaceValue === "function";
                  if (!functionalReplace) replaceValue = String(replaceValue);
                  var global2 = rx.global;
                  if (global2) {
                    var fullUnicode = rx.unicode;
                    rx.lastIndex = 0;
                  }
                  var results = [];
                  while (true) {
                    var result = regExpExec(rx, S);
                    if (result === null) break;
                    results.push(result);
                    if (!global2) break;
                    var matchStr = String(result[0]);
                    if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                  }
                  var accumulatedResult = "";
                  var nextSourcePosition = 0;
                  for (var i = 0; i < results.length; i++) {
                    result = results[i];
                    var matched = String(result[0]);
                    var position = max(min(toInteger(result.index), S.length), 0);
                    var captures = [];
                    for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
                    var namedCaptures = result.groups;
                    if (functionalReplace) {
                      var replacerArgs = [matched].concat(captures, position, S);
                      if (namedCaptures !== void 0) replacerArgs.push(namedCaptures);
                      var replacement = String(replaceValue.apply(void 0, replacerArgs));
                    } else {
                      replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
                    }
                    if (position >= nextSourcePosition) {
                      accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
                      nextSourcePosition = position + matched.length;
                    }
                  }
                  return accumulatedResult + S.slice(nextSourcePosition);
                }
              ];
              function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
                var tailPos = position + matched.length;
                var m = captures.length;
                var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
                if (namedCaptures !== void 0) {
                  namedCaptures = toObject(namedCaptures);
                  symbols = SUBSTITUTION_SYMBOLS;
                }
                return nativeReplace.call(replacement, symbols, function(match, ch) {
                  var capture;
                  switch (ch.charAt(0)) {
                    case "$":
                      return "$";
                    case "&":
                      return matched;
                    case "`":
                      return str.slice(0, position);
                    case "'":
                      return str.slice(tailPos);
                    case "<":
                      capture = namedCaptures[ch.slice(1, -1)];
                      break;
                    default:
                      var n = +ch;
                      if (n === 0) return match;
                      if (n > m) {
                        var f = floor(n / 10);
                        if (f === 0) return match;
                        if (f <= m) return captures[f - 1] === void 0 ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                        return match;
                      }
                      capture = captures[n - 1];
                  }
                  return capture === void 0 ? "" : capture;
                });
              }
            });
          }
        ),
        /***/
        "5692": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var IS_PURE = __webpack_require__("c430");
            var store = __webpack_require__("c6cd");
            (module2.exports = function(key, value) {
              return store[key] || (store[key] = value !== void 0 ? value : {});
            })("versions", []).push({
              version: "3.6.5",
              mode: IS_PURE ? "pure" : "global",
              copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
            });
          }
        ),
        /***/
        "56ef": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var getBuiltIn = __webpack_require__("d066");
            var getOwnPropertyNamesModule = __webpack_require__("241c");
            var getOwnPropertySymbolsModule = __webpack_require__("7418");
            var anObject = __webpack_require__("825a");
            module2.exports = getBuiltIn("Reflect", "ownKeys") || function ownKeys2(it) {
              var keys = getOwnPropertyNamesModule.f(anObject(it));
              var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
              return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
            };
          }
        ),
        /***/
        "5a34": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var isRegExp2 = __webpack_require__("44e7");
            module2.exports = function(it) {
              if (isRegExp2(it)) {
                throw TypeError("The method doesn't accept regular expressions");
              }
              return it;
            };
          }
        ),
        /***/
        "5c6c": (
          /***/
          function(module2, exports2) {
            module2.exports = function(bitmap, value) {
              return {
                enumerable: !(bitmap & 1),
                configurable: !(bitmap & 2),
                writable: !(bitmap & 4),
                value
              };
            };
          }
        ),
        /***/
        "5db7": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var flattenIntoArray = __webpack_require__("a2bf");
            var toObject = __webpack_require__("7b0b");
            var toLength = __webpack_require__("50c4");
            var aFunction = __webpack_require__("1c0b");
            var arraySpeciesCreate = __webpack_require__("65f0");
            $({ target: "Array", proto: true }, {
              flatMap: function flatMap(callbackfn) {
                var O = toObject(this);
                var sourceLen = toLength(O.length);
                var A;
                aFunction(callbackfn);
                A = arraySpeciesCreate(O, 0);
                A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
                return A;
              }
            });
          }
        ),
        /***/
        "6547": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var toInteger = __webpack_require__("a691");
            var requireObjectCoercible = __webpack_require__("1d80");
            var createMethod = function(CONVERT_TO_STRING) {
              return function($this, pos) {
                var S = String(requireObjectCoercible($this));
                var position = toInteger(pos);
                var size = S.length;
                var first, second;
                if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : void 0;
                first = S.charCodeAt(position);
                return first < 55296 || first > 56319 || position + 1 === size || (second = S.charCodeAt(position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
              };
            };
            module2.exports = {
              // `String.prototype.codePointAt` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
              codeAt: createMethod(false),
              // `String.prototype.at` method
              // https://github.com/mathiasbynens/String.prototype.at
              charAt: createMethod(true)
            };
          }
        ),
        /***/
        "65f0": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var isObject2 = __webpack_require__("861d");
            var isArray2 = __webpack_require__("e8b5");
            var wellKnownSymbol = __webpack_require__("b622");
            var SPECIES = wellKnownSymbol("species");
            module2.exports = function(originalArray, length) {
              var C;
              if (isArray2(originalArray)) {
                C = originalArray.constructor;
                if (typeof C == "function" && (C === Array || isArray2(C.prototype))) C = void 0;
                else if (isObject2(C)) {
                  C = C[SPECIES];
                  if (C === null) C = void 0;
                }
              }
              return new (C === void 0 ? Array : C)(length === 0 ? 0 : length);
            };
          }
        ),
        /***/
        "69f3": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var NATIVE_WEAK_MAP = __webpack_require__("7f9a");
            var global2 = __webpack_require__("da84");
            var isObject2 = __webpack_require__("861d");
            var createNonEnumerableProperty = __webpack_require__("9112");
            var objectHas = __webpack_require__("5135");
            var sharedKey = __webpack_require__("f772");
            var hiddenKeys = __webpack_require__("d012");
            var WeakMap = global2.WeakMap;
            var set, get, has;
            var enforce = function(it) {
              return has(it) ? get(it) : set(it, {});
            };
            var getterFor = function(TYPE) {
              return function(it) {
                var state;
                if (!isObject2(it) || (state = get(it)).type !== TYPE) {
                  throw TypeError("Incompatible receiver, " + TYPE + " required");
                }
                return state;
              };
            };
            if (NATIVE_WEAK_MAP) {
              var store = new WeakMap();
              var wmget = store.get;
              var wmhas = store.has;
              var wmset = store.set;
              set = function(it, metadata) {
                wmset.call(store, it, metadata);
                return metadata;
              };
              get = function(it) {
                return wmget.call(store, it) || {};
              };
              has = function(it) {
                return wmhas.call(store, it);
              };
            } else {
              var STATE = sharedKey("state");
              hiddenKeys[STATE] = true;
              set = function(it, metadata) {
                createNonEnumerableProperty(it, STATE, metadata);
                return metadata;
              };
              get = function(it) {
                return objectHas(it, STATE) ? it[STATE] : {};
              };
              has = function(it) {
                return objectHas(it, STATE);
              };
            }
            module2.exports = {
              set,
              get,
              has,
              enforce,
              getterFor
            };
          }
        ),
        /***/
        "6eeb": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var createNonEnumerableProperty = __webpack_require__("9112");
            var has = __webpack_require__("5135");
            var setGlobal = __webpack_require__("ce4e");
            var inspectSource = __webpack_require__("8925");
            var InternalStateModule = __webpack_require__("69f3");
            var getInternalState = InternalStateModule.get;
            var enforceInternalState = InternalStateModule.enforce;
            var TEMPLATE = String(String).split("String");
            (module2.exports = function(O, key, value, options) {
              var unsafe = options ? !!options.unsafe : false;
              var simple = options ? !!options.enumerable : false;
              var noTargetGet = options ? !!options.noTargetGet : false;
              if (typeof value == "function") {
                if (typeof key == "string" && !has(value, "name")) createNonEnumerableProperty(value, "name", key);
                enforceInternalState(value).source = TEMPLATE.join(typeof key == "string" ? key : "");
              }
              if (O === global2) {
                if (simple) O[key] = value;
                else setGlobal(key, value);
                return;
              } else if (!unsafe) {
                delete O[key];
              } else if (!noTargetGet && O[key]) {
                simple = true;
              }
              if (simple) O[key] = value;
              else createNonEnumerableProperty(O, key, value);
            })(Function.prototype, "toString", function toString() {
              return typeof this == "function" && getInternalState(this).source || inspectSource(this);
            });
          }
        ),
        /***/
        "6f53": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var objectKeys = __webpack_require__("df75");
            var toIndexedObject = __webpack_require__("fc6a");
            var propertyIsEnumerable = __webpack_require__("d1e7").f;
            var createMethod = function(TO_ENTRIES) {
              return function(it) {
                var O = toIndexedObject(it);
                var keys = objectKeys(O);
                var length = keys.length;
                var i = 0;
                var result = [];
                var key;
                while (length > i) {
                  key = keys[i++];
                  if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
                    result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
                  }
                }
                return result;
              };
            };
            module2.exports = {
              // `Object.entries` method
              // https://tc39.github.io/ecma262/#sec-object.entries
              entries: createMethod(true),
              // `Object.values` method
              // https://tc39.github.io/ecma262/#sec-object.values
              values: createMethod(false)
            };
          }
        ),
        /***/
        "73d9": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var addToUnscopables = __webpack_require__("44d2");
            addToUnscopables("flatMap");
          }
        ),
        /***/
        "7418": (
          /***/
          function(module2, exports2) {
            exports2.f = Object.getOwnPropertySymbols;
          }
        ),
        /***/
        "746f": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var path = __webpack_require__("428f");
            var has = __webpack_require__("5135");
            var wrappedWellKnownSymbolModule = __webpack_require__("e538");
            var defineProperty = __webpack_require__("9bf2").f;
            module2.exports = function(NAME) {
              var Symbol2 = path.Symbol || (path.Symbol = {});
              if (!has(Symbol2, NAME)) defineProperty(Symbol2, NAME, {
                value: wrappedWellKnownSymbolModule.f(NAME)
              });
            };
          }
        ),
        /***/
        "7839": (
          /***/
          function(module2, exports2) {
            module2.exports = [
              "constructor",
              "hasOwnProperty",
              "isPrototypeOf",
              "propertyIsEnumerable",
              "toLocaleString",
              "toString",
              "valueOf"
            ];
          }
        ),
        /***/
        "7b0b": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var requireObjectCoercible = __webpack_require__("1d80");
            module2.exports = function(argument) {
              return Object(requireObjectCoercible(argument));
            };
          }
        ),
        /***/
        "7c73": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var anObject = __webpack_require__("825a");
            var defineProperties = __webpack_require__("37e8");
            var enumBugKeys = __webpack_require__("7839");
            var hiddenKeys = __webpack_require__("d012");
            var html = __webpack_require__("1be4");
            var documentCreateElement = __webpack_require__("cc12");
            var sharedKey = __webpack_require__("f772");
            var GT = ">";
            var LT = "<";
            var PROTOTYPE = "prototype";
            var SCRIPT = "script";
            var IE_PROTO = sharedKey("IE_PROTO");
            var EmptyConstructor = function() {
            };
            var scriptTag = function(content) {
              return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
            };
            var NullProtoObjectViaActiveX = function(activeXDocument2) {
              activeXDocument2.write(scriptTag(""));
              activeXDocument2.close();
              var temp = activeXDocument2.parentWindow.Object;
              activeXDocument2 = null;
              return temp;
            };
            var NullProtoObjectViaIFrame = function() {
              var iframe = documentCreateElement("iframe");
              var JS = "java" + SCRIPT + ":";
              var iframeDocument;
              iframe.style.display = "none";
              html.appendChild(iframe);
              iframe.src = String(JS);
              iframeDocument = iframe.contentWindow.document;
              iframeDocument.open();
              iframeDocument.write(scriptTag("document.F=Object"));
              iframeDocument.close();
              return iframeDocument.F;
            };
            var activeXDocument;
            var NullProtoObject = function() {
              try {
                activeXDocument = document.domain && new ActiveXObject("htmlfile");
              } catch (error) {
              }
              NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
              var length = enumBugKeys.length;
              while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
              return NullProtoObject();
            };
            hiddenKeys[IE_PROTO] = true;
            module2.exports = Object.create || function create2(O, Properties) {
              var result;
              if (O !== null) {
                EmptyConstructor[PROTOTYPE] = anObject(O);
                result = new EmptyConstructor();
                EmptyConstructor[PROTOTYPE] = null;
                result[IE_PROTO] = O;
              } else result = NullProtoObject();
              return Properties === void 0 ? result : defineProperties(result, Properties);
            };
          }
        ),
        /***/
        "7dd0": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var createIteratorConstructor = __webpack_require__("9ed3");
            var getPrototypeOf = __webpack_require__("e163");
            var setPrototypeOf = __webpack_require__("d2bb");
            var setToStringTag = __webpack_require__("d44e");
            var createNonEnumerableProperty = __webpack_require__("9112");
            var redefine = __webpack_require__("6eeb");
            var wellKnownSymbol = __webpack_require__("b622");
            var IS_PURE = __webpack_require__("c430");
            var Iterators = __webpack_require__("3f8c");
            var IteratorsCore = __webpack_require__("ae93");
            var IteratorPrototype = IteratorsCore.IteratorPrototype;
            var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
            var ITERATOR = wellKnownSymbol("iterator");
            var KEYS = "keys";
            var VALUES = "values";
            var ENTRIES = "entries";
            var returnThis = function() {
              return this;
            };
            module2.exports = function(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
              createIteratorConstructor(IteratorConstructor, NAME, next);
              var getIterationMethod = function(KIND) {
                if (KIND === DEFAULT && defaultIterator) return defaultIterator;
                if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
                switch (KIND) {
                  case KEYS:
                    return function keys() {
                      return new IteratorConstructor(this, KIND);
                    };
                  case VALUES:
                    return function values() {
                      return new IteratorConstructor(this, KIND);
                    };
                  case ENTRIES:
                    return function entries() {
                      return new IteratorConstructor(this, KIND);
                    };
                }
                return function() {
                  return new IteratorConstructor(this);
                };
              };
              var TO_STRING_TAG = NAME + " Iterator";
              var INCORRECT_VALUES_NAME = false;
              var IterablePrototype = Iterable.prototype;
              var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
              var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
              var anyNativeIterator = NAME == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
              var CurrentIteratorPrototype, methods, KEY;
              if (anyNativeIterator) {
                CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
                if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
                  if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
                    if (setPrototypeOf) {
                      setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
                    } else if (typeof CurrentIteratorPrototype[ITERATOR] != "function") {
                      createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
                    }
                  }
                  setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
                  if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
                }
              }
              if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
                INCORRECT_VALUES_NAME = true;
                defaultIterator = function values() {
                  return nativeIterator.call(this);
                };
              }
              if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
                createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
              }
              Iterators[NAME] = defaultIterator;
              if (DEFAULT) {
                methods = {
                  values: getIterationMethod(VALUES),
                  keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
                  entries: getIterationMethod(ENTRIES)
                };
                if (FORCED) for (KEY in methods) {
                  if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                    redefine(IterablePrototype, KEY, methods[KEY]);
                  }
                }
                else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
              }
              return methods;
            };
          }
        ),
        /***/
        "7f9a": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var inspectSource = __webpack_require__("8925");
            var WeakMap = global2.WeakMap;
            module2.exports = typeof WeakMap === "function" && /native code/.test(inspectSource(WeakMap));
          }
        ),
        /***/
        "825a": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var isObject2 = __webpack_require__("861d");
            module2.exports = function(it) {
              if (!isObject2(it)) {
                throw TypeError(String(it) + " is not an object");
              }
              return it;
            };
          }
        ),
        /***/
        "83ab": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            module2.exports = !fails(function() {
              return Object.defineProperty({}, 1, { get: function() {
                return 7;
              } })[1] != 7;
            });
          }
        ),
        /***/
        "8418": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var toPrimitive = __webpack_require__("c04e");
            var definePropertyModule = __webpack_require__("9bf2");
            var createPropertyDescriptor = __webpack_require__("5c6c");
            module2.exports = function(object, key, value) {
              var propertyKey = toPrimitive(key);
              if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
              else object[propertyKey] = value;
            };
          }
        ),
        /***/
        "861d": (
          /***/
          function(module2, exports2) {
            module2.exports = function(it) {
              return typeof it === "object" ? it !== null : typeof it === "function";
            };
          }
        ),
        /***/
        "8875": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
            (function(root, factory) {
              {
                !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports2, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
              }
            })(typeof self !== "undefined" ? self : this, function() {
              function getCurrentScript() {
                var descriptor = Object.getOwnPropertyDescriptor(document, "currentScript");
                if (!descriptor && "currentScript" in document && document.currentScript) {
                  return document.currentScript;
                }
                if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
                  return document.currentScript;
                }
                try {
                  throw new Error();
                } catch (err) {
                  var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig, ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig, stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack), scriptLocation = stackDetails && stackDetails[1] || false, line = stackDetails && stackDetails[2] || false, currentLocation = document.location.href.replace(document.location.hash, ""), pageSource, inlineScriptSourceRegExp, inlineScriptSource, scripts = document.getElementsByTagName("script");
                  if (scriptLocation === currentLocation) {
                    pageSource = document.documentElement.outerHTML;
                    inlineScriptSourceRegExp = new RegExp("(?:[^\\n]+?\\n){0," + (line - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i");
                    inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, "$1").trim();
                  }
                  for (var i = 0; i < scripts.length; i++) {
                    if (scripts[i].readyState === "interactive") {
                      return scripts[i];
                    }
                    if (scripts[i].src === scriptLocation) {
                      return scripts[i];
                    }
                    if (scriptLocation === currentLocation && scripts[i].innerHTML && scripts[i].innerHTML.trim() === inlineScriptSource) {
                      return scripts[i];
                    }
                  }
                  return null;
                }
              }
              return getCurrentScript;
            });
          }
        ),
        /***/
        "8925": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var store = __webpack_require__("c6cd");
            var functionToString = Function.toString;
            if (typeof store.inspectSource != "function") {
              store.inspectSource = function(it) {
                return functionToString.call(it);
              };
            }
            module2.exports = store.inspectSource;
          }
        ),
        /***/
        "8aa5": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var charAt = __webpack_require__("6547").charAt;
            module2.exports = function(S, index2, unicode) {
              return index2 + (unicode ? charAt(S, index2).length : 1);
            };
          }
        ),
        /***/
        "8bbf": (
          /***/
          function(module2, exports2) {
            module2.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;
          }
        ),
        /***/
        "90e3": (
          /***/
          function(module2, exports2) {
            var id = 0;
            var postfix = Math.random();
            module2.exports = function(key) {
              return "Symbol(" + String(key === void 0 ? "" : key) + ")_" + (++id + postfix).toString(36);
            };
          }
        ),
        /***/
        "9112": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var definePropertyModule = __webpack_require__("9bf2");
            var createPropertyDescriptor = __webpack_require__("5c6c");
            module2.exports = DESCRIPTORS ? function(object, key, value) {
              return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
            } : function(object, key, value) {
              object[key] = value;
              return object;
            };
          }
        ),
        /***/
        "9263": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var regexpFlags = __webpack_require__("ad6d");
            var stickyHelpers = __webpack_require__("9f7f");
            var nativeExec = RegExp.prototype.exec;
            var nativeReplace = String.prototype.replace;
            var patchedExec = nativeExec;
            var UPDATES_LAST_INDEX_WRONG = function() {
              var re1 = /a/;
              var re2 = /b*/g;
              nativeExec.call(re1, "a");
              nativeExec.call(re2, "a");
              return re1.lastIndex !== 0 || re2.lastIndex !== 0;
            }();
            var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;
            var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
            var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;
            if (PATCH) {
              patchedExec = function exec(str) {
                var re = this;
                var lastIndex, reCopy, match, i;
                var sticky = UNSUPPORTED_Y && re.sticky;
                var flags = regexpFlags.call(re);
                var source = re.source;
                var charsAdded = 0;
                var strCopy = str;
                if (sticky) {
                  flags = flags.replace("y", "");
                  if (flags.indexOf("g") === -1) {
                    flags += "g";
                  }
                  strCopy = String(str).slice(re.lastIndex);
                  if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== "\n")) {
                    source = "(?: " + source + ")";
                    strCopy = " " + strCopy;
                    charsAdded++;
                  }
                  reCopy = new RegExp("^(?:" + source + ")", flags);
                }
                if (NPCG_INCLUDED) {
                  reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
                }
                if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
                match = nativeExec.call(sticky ? reCopy : re, strCopy);
                if (sticky) {
                  if (match) {
                    match.input = match.input.slice(charsAdded);
                    match[0] = match[0].slice(charsAdded);
                    match.index = re.lastIndex;
                    re.lastIndex += match[0].length;
                  } else re.lastIndex = 0;
                } else if (UPDATES_LAST_INDEX_WRONG && match) {
                  re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
                }
                if (NPCG_INCLUDED && match && match.length > 1) {
                  nativeReplace.call(match[0], reCopy, function() {
                    for (i = 1; i < arguments.length - 2; i++) {
                      if (arguments[i] === void 0) match[i] = void 0;
                    }
                  });
                }
                return match;
              };
            }
            module2.exports = patchedExec;
          }
        ),
        /***/
        "94ca": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            var replacement = /#|\.prototype\./;
            var isForced = function(feature, detection) {
              var value = data[normalize(feature)];
              return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == "function" ? fails(detection) : !!detection;
            };
            var normalize = isForced.normalize = function(string) {
              return String(string).replace(replacement, ".").toLowerCase();
            };
            var data = isForced.data = {};
            var NATIVE = isForced.NATIVE = "N";
            var POLYFILL = isForced.POLYFILL = "P";
            module2.exports = isForced;
          }
        ),
        /***/
        "99af": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var fails = __webpack_require__("d039");
            var isArray2 = __webpack_require__("e8b5");
            var isObject2 = __webpack_require__("861d");
            var toObject = __webpack_require__("7b0b");
            var toLength = __webpack_require__("50c4");
            var createProperty = __webpack_require__("8418");
            var arraySpeciesCreate = __webpack_require__("65f0");
            var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
            var wellKnownSymbol = __webpack_require__("b622");
            var V8_VERSION = __webpack_require__("2d00");
            var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");
            var MAX_SAFE_INTEGER = 9007199254740991;
            var MAXIMUM_ALLOWED_INDEX_EXCEEDED = "Maximum allowed index exceeded";
            var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function() {
              var array = [];
              array[IS_CONCAT_SPREADABLE] = false;
              return array.concat()[0] !== array;
            });
            var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat");
            var isConcatSpreadable = function(O) {
              if (!isObject2(O)) return false;
              var spreadable = O[IS_CONCAT_SPREADABLE];
              return spreadable !== void 0 ? !!spreadable : isArray2(O);
            };
            var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
            $({ target: "Array", proto: true, forced: FORCED }, {
              concat: function concat(arg) {
                var O = toObject(this);
                var A = arraySpeciesCreate(O, 0);
                var n = 0;
                var i, k, length, len, E;
                for (i = -1, length = arguments.length; i < length; i++) {
                  E = i === -1 ? O : arguments[i];
                  if (isConcatSpreadable(E)) {
                    len = toLength(E.length);
                    if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
                  } else {
                    if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    createProperty(A, n++, E);
                  }
                }
                A.length = n;
                return A;
              }
            });
          }
        ),
        /***/
        "9bdd": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var anObject = __webpack_require__("825a");
            module2.exports = function(iterator, fn, value, ENTRIES) {
              try {
                return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
              } catch (error) {
                var returnMethod = iterator["return"];
                if (returnMethod !== void 0) anObject(returnMethod.call(iterator));
                throw error;
              }
            };
          }
        ),
        /***/
        "9bf2": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var IE8_DOM_DEFINE = __webpack_require__("0cfb");
            var anObject = __webpack_require__("825a");
            var toPrimitive = __webpack_require__("c04e");
            var nativeDefineProperty = Object.defineProperty;
            exports2.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
              anObject(O);
              P = toPrimitive(P, true);
              anObject(Attributes);
              if (IE8_DOM_DEFINE) try {
                return nativeDefineProperty(O, P, Attributes);
              } catch (error) {
              }
              if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported");
              if ("value" in Attributes) O[P] = Attributes.value;
              return O;
            };
          }
        ),
        /***/
        "9ed3": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var IteratorPrototype = __webpack_require__("ae93").IteratorPrototype;
            var create2 = __webpack_require__("7c73");
            var createPropertyDescriptor = __webpack_require__("5c6c");
            var setToStringTag = __webpack_require__("d44e");
            var Iterators = __webpack_require__("3f8c");
            var returnThis = function() {
              return this;
            };
            module2.exports = function(IteratorConstructor, NAME, next) {
              var TO_STRING_TAG = NAME + " Iterator";
              IteratorConstructor.prototype = create2(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
              setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
              Iterators[TO_STRING_TAG] = returnThis;
              return IteratorConstructor;
            };
          }
        ),
        /***/
        "9f7f": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            function RE(s, f) {
              return RegExp(s, f);
            }
            exports2.UNSUPPORTED_Y = fails(function() {
              var re = RE("a", "y");
              re.lastIndex = 2;
              return re.exec("abcd") != null;
            });
            exports2.BROKEN_CARET = fails(function() {
              var re = RE("^r", "gy");
              re.lastIndex = 2;
              return re.exec("str") != null;
            });
          }
        ),
        /***/
        "a2bf": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var isArray2 = __webpack_require__("e8b5");
            var toLength = __webpack_require__("50c4");
            var bind = __webpack_require__("0366");
            var flattenIntoArray = function(target, original, source, sourceLen, start, depth, mapper, thisArg) {
              var targetIndex = start;
              var sourceIndex = 0;
              var mapFn = mapper ? bind(mapper, thisArg, 3) : false;
              var element;
              while (sourceIndex < sourceLen) {
                if (sourceIndex in source) {
                  element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];
                  if (depth > 0 && isArray2(element)) {
                    targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
                  } else {
                    if (targetIndex >= 9007199254740991) throw TypeError("Exceed the acceptable array length");
                    target[targetIndex] = element;
                  }
                  targetIndex++;
                }
                sourceIndex++;
              }
              return targetIndex;
            };
            module2.exports = flattenIntoArray;
          }
        ),
        /***/
        "a352": (
          /***/
          function(module2, exports2) {
            module2.exports = __WEBPACK_EXTERNAL_MODULE_a352__;
          }
        ),
        /***/
        "a434": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var toAbsoluteIndex = __webpack_require__("23cb");
            var toInteger = __webpack_require__("a691");
            var toLength = __webpack_require__("50c4");
            var toObject = __webpack_require__("7b0b");
            var arraySpeciesCreate = __webpack_require__("65f0");
            var createProperty = __webpack_require__("8418");
            var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("splice");
            var USES_TO_LENGTH = arrayMethodUsesToLength("splice", { ACCESSORS: true, 0: 0, 1: 2 });
            var max = Math.max;
            var min = Math.min;
            var MAX_SAFE_INTEGER = 9007199254740991;
            var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = "Maximum allowed length exceeded";
            $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
              splice: function splice(start, deleteCount) {
                var O = toObject(this);
                var len = toLength(O.length);
                var actualStart = toAbsoluteIndex(start, len);
                var argumentsLength = arguments.length;
                var insertCount, actualDeleteCount, A, k, from, to;
                if (argumentsLength === 0) {
                  insertCount = actualDeleteCount = 0;
                } else if (argumentsLength === 1) {
                  insertCount = 0;
                  actualDeleteCount = len - actualStart;
                } else {
                  insertCount = argumentsLength - 2;
                  actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
                }
                if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
                  throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
                }
                A = arraySpeciesCreate(O, actualDeleteCount);
                for (k = 0; k < actualDeleteCount; k++) {
                  from = actualStart + k;
                  if (from in O) createProperty(A, k, O[from]);
                }
                A.length = actualDeleteCount;
                if (insertCount < actualDeleteCount) {
                  for (k = actualStart; k < len - actualDeleteCount; k++) {
                    from = k + actualDeleteCount;
                    to = k + insertCount;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                  }
                  for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
                } else if (insertCount > actualDeleteCount) {
                  for (k = len - actualDeleteCount; k > actualStart; k--) {
                    from = k + actualDeleteCount - 1;
                    to = k + insertCount - 1;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                  }
                }
                for (k = 0; k < insertCount; k++) {
                  O[k + actualStart] = arguments[k + 2];
                }
                O.length = len - actualDeleteCount + insertCount;
                return A;
              }
            });
          }
        ),
        /***/
        "a4d3": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var global2 = __webpack_require__("da84");
            var getBuiltIn = __webpack_require__("d066");
            var IS_PURE = __webpack_require__("c430");
            var DESCRIPTORS = __webpack_require__("83ab");
            var NATIVE_SYMBOL = __webpack_require__("4930");
            var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");
            var fails = __webpack_require__("d039");
            var has = __webpack_require__("5135");
            var isArray2 = __webpack_require__("e8b5");
            var isObject2 = __webpack_require__("861d");
            var anObject = __webpack_require__("825a");
            var toObject = __webpack_require__("7b0b");
            var toIndexedObject = __webpack_require__("fc6a");
            var toPrimitive = __webpack_require__("c04e");
            var createPropertyDescriptor = __webpack_require__("5c6c");
            var nativeObjectCreate = __webpack_require__("7c73");
            var objectKeys = __webpack_require__("df75");
            var getOwnPropertyNamesModule = __webpack_require__("241c");
            var getOwnPropertyNamesExternal = __webpack_require__("057f");
            var getOwnPropertySymbolsModule = __webpack_require__("7418");
            var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
            var definePropertyModule = __webpack_require__("9bf2");
            var propertyIsEnumerableModule = __webpack_require__("d1e7");
            var createNonEnumerableProperty = __webpack_require__("9112");
            var redefine = __webpack_require__("6eeb");
            var shared = __webpack_require__("5692");
            var sharedKey = __webpack_require__("f772");
            var hiddenKeys = __webpack_require__("d012");
            var uid = __webpack_require__("90e3");
            var wellKnownSymbol = __webpack_require__("b622");
            var wrappedWellKnownSymbolModule = __webpack_require__("e538");
            var defineWellKnownSymbol = __webpack_require__("746f");
            var setToStringTag = __webpack_require__("d44e");
            var InternalStateModule = __webpack_require__("69f3");
            var $forEach = __webpack_require__("b727").forEach;
            var HIDDEN = sharedKey("hidden");
            var SYMBOL = "Symbol";
            var PROTOTYPE = "prototype";
            var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
            var setInternalState = InternalStateModule.set;
            var getInternalState = InternalStateModule.getterFor(SYMBOL);
            var ObjectPrototype = Object[PROTOTYPE];
            var $Symbol = global2.Symbol;
            var $stringify = getBuiltIn("JSON", "stringify");
            var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
            var nativeDefineProperty = definePropertyModule.f;
            var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
            var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
            var AllSymbols = shared("symbols");
            var ObjectPrototypeSymbols = shared("op-symbols");
            var StringToSymbolRegistry = shared("string-to-symbol-registry");
            var SymbolToStringRegistry = shared("symbol-to-string-registry");
            var WellKnownSymbolsStore = shared("wks");
            var QObject = global2.QObject;
            var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
            var setSymbolDescriptor = DESCRIPTORS && fails(function() {
              return nativeObjectCreate(nativeDefineProperty({}, "a", {
                get: function() {
                  return nativeDefineProperty(this, "a", { value: 7 }).a;
                }
              })).a != 7;
            }) ? function(O, P, Attributes) {
              var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
              if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
              nativeDefineProperty(O, P, Attributes);
              if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
                nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
              }
            } : nativeDefineProperty;
            var wrap = function(tag, description) {
              var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
              setInternalState(symbol, {
                type: SYMBOL,
                tag,
                description
              });
              if (!DESCRIPTORS) symbol.description = description;
              return symbol;
            };
            var isSymbol = USE_SYMBOL_AS_UID ? function(it) {
              return typeof it == "symbol";
            } : function(it) {
              return Object(it) instanceof $Symbol;
            };
            var $defineProperty = function defineProperty(O, P, Attributes) {
              if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
              anObject(O);
              var key = toPrimitive(P, true);
              anObject(Attributes);
              if (has(AllSymbols, key)) {
                if (!Attributes.enumerable) {
                  if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
                  O[HIDDEN][key] = true;
                } else {
                  if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
                  Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
                }
                return setSymbolDescriptor(O, key, Attributes);
              }
              return nativeDefineProperty(O, key, Attributes);
            };
            var $defineProperties = function defineProperties(O, Properties) {
              anObject(O);
              var properties = toIndexedObject(Properties);
              var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
              $forEach(keys, function(key) {
                if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
              });
              return O;
            };
            var $create = function create2(O, Properties) {
              return Properties === void 0 ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
            };
            var $propertyIsEnumerable = function propertyIsEnumerable(V) {
              var P = toPrimitive(V, true);
              var enumerable = nativePropertyIsEnumerable.call(this, P);
              if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
              return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
            };
            var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
              var it = toIndexedObject(O);
              var key = toPrimitive(P, true);
              if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
              var descriptor = nativeGetOwnPropertyDescriptor(it, key);
              if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
                descriptor.enumerable = true;
              }
              return descriptor;
            };
            var $getOwnPropertyNames = function getOwnPropertyNames(O) {
              var names = nativeGetOwnPropertyNames(toIndexedObject(O));
              var result = [];
              $forEach(names, function(key) {
                if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
              });
              return result;
            };
            var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
              var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
              var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
              var result = [];
              $forEach(names, function(key) {
                if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
                  result.push(AllSymbols[key]);
                }
              });
              return result;
            };
            if (!NATIVE_SYMBOL) {
              $Symbol = function Symbol2() {
                if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor");
                var description = !arguments.length || arguments[0] === void 0 ? void 0 : String(arguments[0]);
                var tag = uid(description);
                var setter = function(value) {
                  if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
                  if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
                  setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
                };
                if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
                return wrap(tag, description);
              };
              redefine($Symbol[PROTOTYPE], "toString", function toString() {
                return getInternalState(this).tag;
              });
              redefine($Symbol, "withoutSetter", function(description) {
                return wrap(uid(description), description);
              });
              propertyIsEnumerableModule.f = $propertyIsEnumerable;
              definePropertyModule.f = $defineProperty;
              getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
              getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
              getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;
              wrappedWellKnownSymbolModule.f = function(name) {
                return wrap(wellKnownSymbol(name), name);
              };
              if (DESCRIPTORS) {
                nativeDefineProperty($Symbol[PROTOTYPE], "description", {
                  configurable: true,
                  get: function description() {
                    return getInternalState(this).description;
                  }
                });
                if (!IS_PURE) {
                  redefine(ObjectPrototype, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true });
                }
              }
            }
            $({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
              Symbol: $Symbol
            });
            $forEach(objectKeys(WellKnownSymbolsStore), function(name) {
              defineWellKnownSymbol(name);
            });
            $({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
              // `Symbol.for` method
              // https://tc39.github.io/ecma262/#sec-symbol.for
              "for": function(key) {
                var string = String(key);
                if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
                var symbol = $Symbol(string);
                StringToSymbolRegistry[string] = symbol;
                SymbolToStringRegistry[symbol] = string;
                return symbol;
              },
              // `Symbol.keyFor` method
              // https://tc39.github.io/ecma262/#sec-symbol.keyfor
              keyFor: function keyFor(sym) {
                if (!isSymbol(sym)) throw TypeError(sym + " is not a symbol");
                if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
              },
              useSetter: function() {
                USE_SETTER = true;
              },
              useSimple: function() {
                USE_SETTER = false;
              }
            });
            $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
              // `Object.create` method
              // https://tc39.github.io/ecma262/#sec-object.create
              create: $create,
              // `Object.defineProperty` method
              // https://tc39.github.io/ecma262/#sec-object.defineproperty
              defineProperty: $defineProperty,
              // `Object.defineProperties` method
              // https://tc39.github.io/ecma262/#sec-object.defineproperties
              defineProperties: $defineProperties,
              // `Object.getOwnPropertyDescriptor` method
              // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
              getOwnPropertyDescriptor: $getOwnPropertyDescriptor
            });
            $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL }, {
              // `Object.getOwnPropertyNames` method
              // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
              getOwnPropertyNames: $getOwnPropertyNames,
              // `Object.getOwnPropertySymbols` method
              // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
              getOwnPropertySymbols: $getOwnPropertySymbols
            });
            $({ target: "Object", stat: true, forced: fails(function() {
              getOwnPropertySymbolsModule.f(1);
            }) }, {
              getOwnPropertySymbols: function getOwnPropertySymbols(it) {
                return getOwnPropertySymbolsModule.f(toObject(it));
              }
            });
            if ($stringify) {
              var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function() {
                var symbol = $Symbol();
                return $stringify([symbol]) != "[null]" || $stringify({ a: symbol }) != "{}" || $stringify(Object(symbol)) != "{}";
              });
              $({ target: "JSON", stat: true, forced: FORCED_JSON_STRINGIFY }, {
                // eslint-disable-next-line no-unused-vars
                stringify: function stringify(it, replacer, space) {
                  var args = [it];
                  var index2 = 1;
                  var $replacer;
                  while (arguments.length > index2) args.push(arguments[index2++]);
                  $replacer = replacer;
                  if (!isObject2(replacer) && it === void 0 || isSymbol(it)) return;
                  if (!isArray2(replacer)) replacer = function(key, value) {
                    if (typeof $replacer == "function") value = $replacer.call(this, key, value);
                    if (!isSymbol(value)) return value;
                  };
                  args[1] = replacer;
                  return $stringify.apply(null, args);
                }
              });
            }
            if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
              createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
            }
            setToStringTag($Symbol, SYMBOL);
            hiddenKeys[HIDDEN] = true;
          }
        ),
        /***/
        "a630": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var from = __webpack_require__("4df4");
            var checkCorrectnessOfIteration = __webpack_require__("1c7e");
            var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function(iterable) {
              Array.from(iterable);
            });
            $({ target: "Array", stat: true, forced: INCORRECT_ITERATION }, {
              from
            });
          }
        ),
        /***/
        "a640": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            module2.exports = function(METHOD_NAME, argument) {
              var method = [][METHOD_NAME];
              return !!method && fails(function() {
                method.call(null, argument || function() {
                  throw 1;
                }, 1);
              });
            };
          }
        ),
        /***/
        "a691": (
          /***/
          function(module2, exports2) {
            var ceil = Math.ceil;
            var floor = Math.floor;
            module2.exports = function(argument) {
              return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
            };
          }
        ),
        /***/
        "ab13": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var wellKnownSymbol = __webpack_require__("b622");
            var MATCH = wellKnownSymbol("match");
            module2.exports = function(METHOD_NAME) {
              var regexp = /./;
              try {
                "/./"[METHOD_NAME](regexp);
              } catch (e) {
                try {
                  regexp[MATCH] = false;
                  return "/./"[METHOD_NAME](regexp);
                } catch (f) {
                }
              }
              return false;
            };
          }
        ),
        /***/
        "ac1f": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var exec = __webpack_require__("9263");
            $({ target: "RegExp", proto: true, forced: /./.exec !== exec }, {
              exec
            });
          }
        ),
        /***/
        "ad6d": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var anObject = __webpack_require__("825a");
            module2.exports = function() {
              var that = anObject(this);
              var result = "";
              if (that.global) result += "g";
              if (that.ignoreCase) result += "i";
              if (that.multiline) result += "m";
              if (that.dotAll) result += "s";
              if (that.unicode) result += "u";
              if (that.sticky) result += "y";
              return result;
            };
          }
        ),
        /***/
        "ae40": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var fails = __webpack_require__("d039");
            var has = __webpack_require__("5135");
            var defineProperty = Object.defineProperty;
            var cache2 = {};
            var thrower = function(it) {
              throw it;
            };
            module2.exports = function(METHOD_NAME, options) {
              if (has(cache2, METHOD_NAME)) return cache2[METHOD_NAME];
              if (!options) options = {};
              var method = [][METHOD_NAME];
              var ACCESSORS = has(options, "ACCESSORS") ? options.ACCESSORS : false;
              var argument0 = has(options, 0) ? options[0] : thrower;
              var argument1 = has(options, 1) ? options[1] : void 0;
              return cache2[METHOD_NAME] = !!method && !fails(function() {
                if (ACCESSORS && !DESCRIPTORS) return true;
                var O = { length: -1 };
                if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
                else O[1] = 1;
                method.call(O, argument0, argument1);
              });
            };
          }
        ),
        /***/
        "ae93": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var getPrototypeOf = __webpack_require__("e163");
            var createNonEnumerableProperty = __webpack_require__("9112");
            var has = __webpack_require__("5135");
            var wellKnownSymbol = __webpack_require__("b622");
            var IS_PURE = __webpack_require__("c430");
            var ITERATOR = wellKnownSymbol("iterator");
            var BUGGY_SAFARI_ITERATORS = false;
            var returnThis = function() {
              return this;
            };
            var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
            if ([].keys) {
              arrayIterator = [].keys();
              if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
              else {
                PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
                if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
              }
            }
            if (IteratorPrototype == void 0) IteratorPrototype = {};
            if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
              createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
            }
            module2.exports = {
              IteratorPrototype,
              BUGGY_SAFARI_ITERATORS
            };
          }
        ),
        /***/
        "b041": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
            var classof = __webpack_require__("f5df");
            module2.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
              return "[object " + classof(this) + "]";
            };
          }
        ),
        /***/
        "b0c0": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var DESCRIPTORS = __webpack_require__("83ab");
            var defineProperty = __webpack_require__("9bf2").f;
            var FunctionPrototype = Function.prototype;
            var FunctionPrototypeToString = FunctionPrototype.toString;
            var nameRE = /^\s*function ([^ (]*)/;
            var NAME = "name";
            if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
              defineProperty(FunctionPrototype, NAME, {
                configurable: true,
                get: function() {
                  try {
                    return FunctionPrototypeToString.call(this).match(nameRE)[1];
                  } catch (error) {
                    return "";
                  }
                }
              });
            }
          }
        ),
        /***/
        "b622": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var shared = __webpack_require__("5692");
            var has = __webpack_require__("5135");
            var uid = __webpack_require__("90e3");
            var NATIVE_SYMBOL = __webpack_require__("4930");
            var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");
            var WellKnownSymbolsStore = shared("wks");
            var Symbol2 = global2.Symbol;
            var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2 : Symbol2 && Symbol2.withoutSetter || uid;
            module2.exports = function(name) {
              if (!has(WellKnownSymbolsStore, name)) {
                if (NATIVE_SYMBOL && has(Symbol2, name)) WellKnownSymbolsStore[name] = Symbol2[name];
                else WellKnownSymbolsStore[name] = createWellKnownSymbol("Symbol." + name);
              }
              return WellKnownSymbolsStore[name];
            };
          }
        ),
        /***/
        "b64b": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var toObject = __webpack_require__("7b0b");
            var nativeKeys = __webpack_require__("df75");
            var fails = __webpack_require__("d039");
            var FAILS_ON_PRIMITIVES = fails(function() {
              nativeKeys(1);
            });
            $({ target: "Object", stat: true, forced: FAILS_ON_PRIMITIVES }, {
              keys: function keys(it) {
                return nativeKeys(toObject(it));
              }
            });
          }
        ),
        /***/
        "b727": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var bind = __webpack_require__("0366");
            var IndexedObject = __webpack_require__("44ad");
            var toObject = __webpack_require__("7b0b");
            var toLength = __webpack_require__("50c4");
            var arraySpeciesCreate = __webpack_require__("65f0");
            var push = [].push;
            var createMethod = function(TYPE) {
              var IS_MAP = TYPE == 1;
              var IS_FILTER = TYPE == 2;
              var IS_SOME = TYPE == 3;
              var IS_EVERY = TYPE == 4;
              var IS_FIND_INDEX = TYPE == 6;
              var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
              return function($this, callbackfn, that, specificCreate) {
                var O = toObject($this);
                var self2 = IndexedObject(O);
                var boundFunction = bind(callbackfn, that, 3);
                var length = toLength(self2.length);
                var index2 = 0;
                var create2 = specificCreate || arraySpeciesCreate;
                var target = IS_MAP ? create2($this, length) : IS_FILTER ? create2($this, 0) : void 0;
                var value, result;
                for (; length > index2; index2++) if (NO_HOLES || index2 in self2) {
                  value = self2[index2];
                  result = boundFunction(value, index2, O);
                  if (TYPE) {
                    if (IS_MAP) target[index2] = result;
                    else if (result) switch (TYPE) {
                      case 3:
                        return true;
                      case 5:
                        return value;
                      case 6:
                        return index2;
                      case 2:
                        push.call(target, value);
                    }
                    else if (IS_EVERY) return false;
                  }
                }
                return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
              };
            };
            module2.exports = {
              // `Array.prototype.forEach` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
              forEach: createMethod(0),
              // `Array.prototype.map` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.map
              map: createMethod(1),
              // `Array.prototype.filter` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.filter
              filter: createMethod(2),
              // `Array.prototype.some` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.some
              some: createMethod(3),
              // `Array.prototype.every` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.every
              every: createMethod(4),
              // `Array.prototype.find` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.find
              find: createMethod(5),
              // `Array.prototype.findIndex` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
              findIndex: createMethod(6)
            };
          }
        ),
        /***/
        "c04e": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var isObject2 = __webpack_require__("861d");
            module2.exports = function(input, PREFERRED_STRING) {
              if (!isObject2(input)) return input;
              var fn, val;
              if (PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject2(val = fn.call(input))) return val;
              if (typeof (fn = input.valueOf) == "function" && !isObject2(val = fn.call(input))) return val;
              if (!PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject2(val = fn.call(input))) return val;
              throw TypeError("Can't convert object to primitive value");
            };
          }
        ),
        /***/
        "c430": (
          /***/
          function(module2, exports2) {
            module2.exports = false;
          }
        ),
        /***/
        "c6b6": (
          /***/
          function(module2, exports2) {
            var toString = {}.toString;
            module2.exports = function(it) {
              return toString.call(it).slice(8, -1);
            };
          }
        ),
        /***/
        "c6cd": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var setGlobal = __webpack_require__("ce4e");
            var SHARED = "__core-js_shared__";
            var store = global2[SHARED] || setGlobal(SHARED, {});
            module2.exports = store;
          }
        ),
        /***/
        "c740": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var $findIndex = __webpack_require__("b727").findIndex;
            var addToUnscopables = __webpack_require__("44d2");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var FIND_INDEX = "findIndex";
            var SKIPS_HOLES = true;
            var USES_TO_LENGTH = arrayMethodUsesToLength(FIND_INDEX);
            if (FIND_INDEX in []) Array(1)[FIND_INDEX](function() {
              SKIPS_HOLES = false;
            });
            $({ target: "Array", proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH }, {
              findIndex: function findIndex(callbackfn) {
                return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
            addToUnscopables(FIND_INDEX);
          }
        ),
        /***/
        "c8ba": (
          /***/
          function(module2, exports2) {
            var g;
            g = /* @__PURE__ */ function() {
              return this;
            }();
            try {
              g = g || new Function("return this")();
            } catch (e) {
              if (typeof window === "object") g = window;
            }
            module2.exports = g;
          }
        ),
        /***/
        "c975": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var $indexOf = __webpack_require__("4d64").indexOf;
            var arrayMethodIsStrict = __webpack_require__("a640");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var nativeIndexOf = [].indexOf;
            var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
            var STRICT_METHOD = arrayMethodIsStrict("indexOf");
            var USES_TO_LENGTH = arrayMethodUsesToLength("indexOf", { ACCESSORS: true, 1: 0 });
            $({ target: "Array", proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
              indexOf: function indexOf(searchElement) {
                return NEGATIVE_ZERO ? nativeIndexOf.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
          }
        ),
        /***/
        "ca84": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var has = __webpack_require__("5135");
            var toIndexedObject = __webpack_require__("fc6a");
            var indexOf = __webpack_require__("4d64").indexOf;
            var hiddenKeys = __webpack_require__("d012");
            module2.exports = function(object, names) {
              var O = toIndexedObject(object);
              var i = 0;
              var result = [];
              var key;
              for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
              while (names.length > i) if (has(O, key = names[i++])) {
                ~indexOf(result, key) || result.push(key);
              }
              return result;
            };
          }
        ),
        /***/
        "caad": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var $includes = __webpack_require__("4d64").includes;
            var addToUnscopables = __webpack_require__("44d2");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var USES_TO_LENGTH = arrayMethodUsesToLength("indexOf", { ACCESSORS: true, 1: 0 });
            $({ target: "Array", proto: true, forced: !USES_TO_LENGTH }, {
              includes: function includes(el) {
                return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
            addToUnscopables("includes");
          }
        ),
        /***/
        "cc12": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var isObject2 = __webpack_require__("861d");
            var document2 = global2.document;
            var EXISTS = isObject2(document2) && isObject2(document2.createElement);
            module2.exports = function(it) {
              return EXISTS ? document2.createElement(it) : {};
            };
          }
        ),
        /***/
        "ce4e": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var createNonEnumerableProperty = __webpack_require__("9112");
            module2.exports = function(key, value) {
              try {
                createNonEnumerableProperty(global2, key, value);
              } catch (error) {
                global2[key] = value;
              }
              return value;
            };
          }
        ),
        /***/
        "d012": (
          /***/
          function(module2, exports2) {
            module2.exports = {};
          }
        ),
        /***/
        "d039": (
          /***/
          function(module2, exports2) {
            module2.exports = function(exec) {
              try {
                return !!exec();
              } catch (error) {
                return true;
              }
            };
          }
        ),
        /***/
        "d066": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var path = __webpack_require__("428f");
            var global2 = __webpack_require__("da84");
            var aFunction = function(variable) {
              return typeof variable == "function" ? variable : void 0;
            };
            module2.exports = function(namespace, method) {
              return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global2[namespace]) : path[namespace] && path[namespace][method] || global2[namespace] && global2[namespace][method];
            };
          }
        ),
        /***/
        "d1e7": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
            var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);
            exports2.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
              var descriptor = getOwnPropertyDescriptor(this, V);
              return !!descriptor && descriptor.enumerable;
            } : nativePropertyIsEnumerable;
          }
        ),
        /***/
        "d28b": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var defineWellKnownSymbol = __webpack_require__("746f");
            defineWellKnownSymbol("iterator");
          }
        ),
        /***/
        "d2bb": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var anObject = __webpack_require__("825a");
            var aPossiblePrototype = __webpack_require__("3bbe");
            module2.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
              var CORRECT_SETTER = false;
              var test = {};
              var setter;
              try {
                setter = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set;
                setter.call(test, []);
                CORRECT_SETTER = test instanceof Array;
              } catch (error) {
              }
              return function setPrototypeOf(O, proto) {
                anObject(O);
                aPossiblePrototype(proto);
                if (CORRECT_SETTER) setter.call(O, proto);
                else O.__proto__ = proto;
                return O;
              };
            }() : void 0);
          }
        ),
        /***/
        "d3b7": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
            var redefine = __webpack_require__("6eeb");
            var toString = __webpack_require__("b041");
            if (!TO_STRING_TAG_SUPPORT) {
              redefine(Object.prototype, "toString", toString, { unsafe: true });
            }
          }
        ),
        /***/
        "d44e": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var defineProperty = __webpack_require__("9bf2").f;
            var has = __webpack_require__("5135");
            var wellKnownSymbol = __webpack_require__("b622");
            var TO_STRING_TAG = wellKnownSymbol("toStringTag");
            module2.exports = function(it, TAG, STATIC) {
              if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
                defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
              }
            };
          }
        ),
        /***/
        "d58f": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var aFunction = __webpack_require__("1c0b");
            var toObject = __webpack_require__("7b0b");
            var IndexedObject = __webpack_require__("44ad");
            var toLength = __webpack_require__("50c4");
            var createMethod = function(IS_RIGHT) {
              return function(that, callbackfn, argumentsLength, memo) {
                aFunction(callbackfn);
                var O = toObject(that);
                var self2 = IndexedObject(O);
                var length = toLength(O.length);
                var index2 = IS_RIGHT ? length - 1 : 0;
                var i = IS_RIGHT ? -1 : 1;
                if (argumentsLength < 2) while (true) {
                  if (index2 in self2) {
                    memo = self2[index2];
                    index2 += i;
                    break;
                  }
                  index2 += i;
                  if (IS_RIGHT ? index2 < 0 : length <= index2) {
                    throw TypeError("Reduce of empty array with no initial value");
                  }
                }
                for (; IS_RIGHT ? index2 >= 0 : length > index2; index2 += i) if (index2 in self2) {
                  memo = callbackfn(memo, self2[index2], index2, O);
                }
                return memo;
              };
            };
            module2.exports = {
              // `Array.prototype.reduce` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
              left: createMethod(false),
              // `Array.prototype.reduceRight` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
              right: createMethod(true)
            };
          }
        ),
        /***/
        "d784": (
          /***/
          function(module2, exports2, __webpack_require__) {
            __webpack_require__("ac1f");
            var redefine = __webpack_require__("6eeb");
            var fails = __webpack_require__("d039");
            var wellKnownSymbol = __webpack_require__("b622");
            var regexpExec = __webpack_require__("9263");
            var createNonEnumerableProperty = __webpack_require__("9112");
            var SPECIES = wellKnownSymbol("species");
            var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
              var re = /./;
              re.exec = function() {
                var result = [];
                result.groups = { a: "7" };
                return result;
              };
              return "".replace(re, "$<a>") !== "7";
            });
            var REPLACE_KEEPS_$0 = function() {
              return "a".replace(/./, "$0") === "$0";
            }();
            var REPLACE = wellKnownSymbol("replace");
            var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function() {
              if (/./[REPLACE]) {
                return /./[REPLACE]("a", "$0") === "";
              }
              return false;
            }();
            var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function() {
              var re = /(?:)/;
              var originalExec = re.exec;
              re.exec = function() {
                return originalExec.apply(this, arguments);
              };
              var result = "ab".split(re);
              return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
            });
            module2.exports = function(KEY, length, exec, sham) {
              var SYMBOL = wellKnownSymbol(KEY);
              var DELEGATES_TO_SYMBOL = !fails(function() {
                var O = {};
                O[SYMBOL] = function() {
                  return 7;
                };
                return ""[KEY](O) != 7;
              });
              var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function() {
                var execCalled = false;
                var re = /a/;
                if (KEY === "split") {
                  re = {};
                  re.constructor = {};
                  re.constructor[SPECIES] = function() {
                    return re;
                  };
                  re.flags = "";
                  re[SYMBOL] = /./[SYMBOL];
                }
                re.exec = function() {
                  execCalled = true;
                  return null;
                };
                re[SYMBOL]("");
                return !execCalled;
              });
              if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === "replace" && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
                var nativeRegExpMethod = /./[SYMBOL];
                var methods = exec(SYMBOL, ""[KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
                  if (regexp.exec === regexpExec) {
                    if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                      return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                    }
                    return { done: true, value: nativeMethod.call(str, regexp, arg2) };
                  }
                  return { done: false };
                }, {
                  REPLACE_KEEPS_$0,
                  REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
                });
                var stringMethod = methods[0];
                var regexMethod = methods[1];
                redefine(String.prototype, KEY, stringMethod);
                redefine(
                  RegExp.prototype,
                  SYMBOL,
                  length == 2 ? function(string, arg) {
                    return regexMethod.call(string, this, arg);
                  } : function(string) {
                    return regexMethod.call(string, this);
                  }
                );
              }
              if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], "sham", true);
            };
          }
        ),
        /***/
        "d81d": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var $map = __webpack_require__("b727").map;
            var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("map");
            var USES_TO_LENGTH = arrayMethodUsesToLength("map");
            $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
              map: function map(callbackfn) {
                return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
              }
            });
          }
        ),
        /***/
        "da84": (
          /***/
          function(module2, exports2, __webpack_require__) {
            (function(global2) {
              var check = function(it) {
                return it && it.Math == Math && it;
              };
              module2.exports = // eslint-disable-next-line no-undef
              check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof global2 == "object" && global2) || // eslint-disable-next-line no-new-func
              Function("return this")();
            }).call(this, __webpack_require__("c8ba"));
          }
        ),
        /***/
        "dbb4": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var DESCRIPTORS = __webpack_require__("83ab");
            var ownKeys2 = __webpack_require__("56ef");
            var toIndexedObject = __webpack_require__("fc6a");
            var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
            var createProperty = __webpack_require__("8418");
            $({ target: "Object", stat: true, sham: !DESCRIPTORS }, {
              getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
                var O = toIndexedObject(object);
                var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
                var keys = ownKeys2(O);
                var result = {};
                var index2 = 0;
                var key, descriptor;
                while (keys.length > index2) {
                  descriptor = getOwnPropertyDescriptor(O, key = keys[index2++]);
                  if (descriptor !== void 0) createProperty(result, key, descriptor);
                }
                return result;
              }
            });
          }
        ),
        /***/
        "dbf1": (
          /***/
          function(module2, __webpack_exports__, __webpack_require__) {
            (function(global2) {
              __webpack_require__.d(__webpack_exports__, "a", function() {
                return console2;
              });
              function getConsole() {
                if (typeof window !== "undefined") {
                  return window.console;
                }
                return global2.console;
              }
              var console2 = getConsole();
            }).call(this, __webpack_require__("c8ba"));
          }
        ),
        /***/
        "ddb0": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var global2 = __webpack_require__("da84");
            var DOMIterables = __webpack_require__("fdbc");
            var ArrayIteratorMethods = __webpack_require__("e260");
            var createNonEnumerableProperty = __webpack_require__("9112");
            var wellKnownSymbol = __webpack_require__("b622");
            var ITERATOR = wellKnownSymbol("iterator");
            var TO_STRING_TAG = wellKnownSymbol("toStringTag");
            var ArrayValues = ArrayIteratorMethods.values;
            for (var COLLECTION_NAME in DOMIterables) {
              var Collection = global2[COLLECTION_NAME];
              var CollectionPrototype = Collection && Collection.prototype;
              if (CollectionPrototype) {
                if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
                  createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
                } catch (error) {
                  CollectionPrototype[ITERATOR] = ArrayValues;
                }
                if (!CollectionPrototype[TO_STRING_TAG]) {
                  createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
                }
                if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
                  if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
                    createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
                  } catch (error) {
                    CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
                  }
                }
              }
            }
          }
        ),
        /***/
        "df75": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var internalObjectKeys = __webpack_require__("ca84");
            var enumBugKeys = __webpack_require__("7839");
            module2.exports = Object.keys || function keys(O) {
              return internalObjectKeys(O, enumBugKeys);
            };
          }
        ),
        /***/
        "e01a": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var DESCRIPTORS = __webpack_require__("83ab");
            var global2 = __webpack_require__("da84");
            var has = __webpack_require__("5135");
            var isObject2 = __webpack_require__("861d");
            var defineProperty = __webpack_require__("9bf2").f;
            var copyConstructorProperties = __webpack_require__("e893");
            var NativeSymbol = global2.Symbol;
            if (DESCRIPTORS && typeof NativeSymbol == "function" && (!("description" in NativeSymbol.prototype) || // Safari 12 bug
            NativeSymbol().description !== void 0)) {
              var EmptyStringDescriptionStore = {};
              var SymbolWrapper = function Symbol2() {
                var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]);
                var result = this instanceof SymbolWrapper ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
                if (description === "") EmptyStringDescriptionStore[result] = true;
                return result;
              };
              copyConstructorProperties(SymbolWrapper, NativeSymbol);
              var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
              symbolPrototype.constructor = SymbolWrapper;
              var symbolToString = symbolPrototype.toString;
              var native = String(NativeSymbol("test")) == "Symbol(test)";
              var regexp = /^Symbol\((.*)\)[^)]+$/;
              defineProperty(symbolPrototype, "description", {
                configurable: true,
                get: function description() {
                  var symbol = isObject2(this) ? this.valueOf() : this;
                  var string = symbolToString.call(symbol);
                  if (has(EmptyStringDescriptionStore, symbol)) return "";
                  var desc = native ? string.slice(7, -1) : string.replace(regexp, "$1");
                  return desc === "" ? void 0 : desc;
                }
              });
              $({ global: true, forced: true }, {
                Symbol: SymbolWrapper
              });
            }
          }
        ),
        /***/
        "e163": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var has = __webpack_require__("5135");
            var toObject = __webpack_require__("7b0b");
            var sharedKey = __webpack_require__("f772");
            var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");
            var IE_PROTO = sharedKey("IE_PROTO");
            var ObjectPrototype = Object.prototype;
            module2.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function(O) {
              O = toObject(O);
              if (has(O, IE_PROTO)) return O[IE_PROTO];
              if (typeof O.constructor == "function" && O instanceof O.constructor) {
                return O.constructor.prototype;
              }
              return O instanceof Object ? ObjectPrototype : null;
            };
          }
        ),
        /***/
        "e177": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var fails = __webpack_require__("d039");
            module2.exports = !fails(function() {
              function F2() {
              }
              F2.prototype.constructor = null;
              return Object.getPrototypeOf(new F2()) !== F2.prototype;
            });
          }
        ),
        /***/
        "e260": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var toIndexedObject = __webpack_require__("fc6a");
            var addToUnscopables = __webpack_require__("44d2");
            var Iterators = __webpack_require__("3f8c");
            var InternalStateModule = __webpack_require__("69f3");
            var defineIterator = __webpack_require__("7dd0");
            var ARRAY_ITERATOR = "Array Iterator";
            var setInternalState = InternalStateModule.set;
            var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);
            module2.exports = defineIterator(Array, "Array", function(iterated, kind) {
              setInternalState(this, {
                type: ARRAY_ITERATOR,
                target: toIndexedObject(iterated),
                // target
                index: 0,
                // next index
                kind
                // kind
              });
            }, function() {
              var state = getInternalState(this);
              var target = state.target;
              var kind = state.kind;
              var index2 = state.index++;
              if (!target || index2 >= target.length) {
                state.target = void 0;
                return { value: void 0, done: true };
              }
              if (kind == "keys") return { value: index2, done: false };
              if (kind == "values") return { value: target[index2], done: false };
              return { value: [index2, target[index2]], done: false };
            }, "values");
            Iterators.Arguments = Iterators.Array;
            addToUnscopables("keys");
            addToUnscopables("values");
            addToUnscopables("entries");
          }
        ),
        /***/
        "e439": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var fails = __webpack_require__("d039");
            var toIndexedObject = __webpack_require__("fc6a");
            var nativeGetOwnPropertyDescriptor = __webpack_require__("06cf").f;
            var DESCRIPTORS = __webpack_require__("83ab");
            var FAILS_ON_PRIMITIVES = fails(function() {
              nativeGetOwnPropertyDescriptor(1);
            });
            var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;
            $({ target: "Object", stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
              getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
                return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
              }
            });
          }
        ),
        /***/
        "e538": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var wellKnownSymbol = __webpack_require__("b622");
            exports2.f = wellKnownSymbol;
          }
        ),
        /***/
        "e893": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var has = __webpack_require__("5135");
            var ownKeys2 = __webpack_require__("56ef");
            var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
            var definePropertyModule = __webpack_require__("9bf2");
            module2.exports = function(target, source) {
              var keys = ownKeys2(source);
              var defineProperty = definePropertyModule.f;
              var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
              }
            };
          }
        ),
        /***/
        "e8b5": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var classof = __webpack_require__("c6b6");
            module2.exports = Array.isArray || function isArray2(arg) {
              return classof(arg) == "Array";
            };
          }
        ),
        /***/
        "e95a": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var wellKnownSymbol = __webpack_require__("b622");
            var Iterators = __webpack_require__("3f8c");
            var ITERATOR = wellKnownSymbol("iterator");
            var ArrayPrototype = Array.prototype;
            module2.exports = function(it) {
              return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
            };
          }
        ),
        /***/
        "f5df": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
            var classofRaw = __webpack_require__("c6b6");
            var wellKnownSymbol = __webpack_require__("b622");
            var TO_STRING_TAG = wellKnownSymbol("toStringTag");
            var CORRECT_ARGUMENTS = classofRaw(/* @__PURE__ */ function() {
              return arguments;
            }()) == "Arguments";
            var tryGet = function(it, key) {
              try {
                return it[key];
              } catch (error) {
              }
            };
            module2.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
              var O, tag, result;
              return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : result;
            };
          }
        ),
        /***/
        "f772": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var shared = __webpack_require__("5692");
            var uid = __webpack_require__("90e3");
            var keys = shared("keys");
            module2.exports = function(key) {
              return keys[key] || (keys[key] = uid(key));
            };
          }
        ),
        /***/
        "fb15": (
          /***/
          function(module2, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__);
            if (typeof window !== "undefined") {
              var currentScript = window.document.currentScript;
              {
                var getCurrentScript = __webpack_require__("8875");
                currentScript = getCurrentScript();
                if (!("currentScript" in document)) {
                  Object.defineProperty(document, "currentScript", { get: getCurrentScript });
                }
              }
              var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
              if (src) {
                __webpack_require__.p = src[1];
              }
            }
            __webpack_require__("99af");
            __webpack_require__("4de4");
            __webpack_require__("4160");
            __webpack_require__("c975");
            __webpack_require__("d81d");
            __webpack_require__("a434");
            __webpack_require__("159b");
            __webpack_require__("a4d3");
            __webpack_require__("e439");
            __webpack_require__("dbb4");
            __webpack_require__("b64b");
            function _defineProperty2(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, {
                  value,
                  enumerable: true,
                  configurable: true,
                  writable: true
                });
              } else {
                obj[key] = value;
              }
              return obj;
            }
            function ownKeys2(object, enumerableOnly) {
              var keys = Object.keys(object);
              if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                if (enumerableOnly) symbols = symbols.filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                });
                keys.push.apply(keys, symbols);
              }
              return keys;
            }
            function _objectSpread22(target) {
              for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i] != null ? arguments[i] : {};
                if (i % 2) {
                  ownKeys2(Object(source), true).forEach(function(key) {
                    _defineProperty2(target, key, source[key]);
                  });
                } else if (Object.getOwnPropertyDescriptors) {
                  Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                } else {
                  ownKeys2(Object(source)).forEach(function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                  });
                }
              }
              return target;
            }
            function _arrayWithHoles(arr) {
              if (Array.isArray(arr)) return arr;
            }
            __webpack_require__("e01a");
            __webpack_require__("d28b");
            __webpack_require__("e260");
            __webpack_require__("d3b7");
            __webpack_require__("3ca3");
            __webpack_require__("ddb0");
            function _iterableToArrayLimit(arr, i) {
              if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i) break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"] != null) _i["return"]();
                } finally {
                  if (_d) throw _e;
                }
              }
              return _arr;
            }
            __webpack_require__("a630");
            __webpack_require__("fb6a");
            __webpack_require__("b0c0");
            __webpack_require__("25f0");
            function _arrayLikeToArray2(arr, len) {
              if (len == null || len > arr.length) len = arr.length;
              for (var i = 0, arr2 = new Array(len); i < len; i++) {
                arr2[i] = arr[i];
              }
              return arr2;
            }
            function _unsupportedIterableToArray2(o, minLen) {
              if (!o) return;
              if (typeof o === "string") return _arrayLikeToArray2(o, minLen);
              var n = Object.prototype.toString.call(o).slice(8, -1);
              if (n === "Object" && o.constructor) n = o.constructor.name;
              if (n === "Map" || n === "Set") return Array.from(o);
              if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray2(o, minLen);
            }
            function _nonIterableRest() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            function _slicedToArray(arr, i) {
              return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray2(arr, i) || _nonIterableRest();
            }
            function _arrayWithoutHoles2(arr) {
              if (Array.isArray(arr)) return _arrayLikeToArray2(arr);
            }
            function _iterableToArray2(iter) {
              if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
            }
            function _nonIterableSpread2() {
              throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            function _toConsumableArray2(arr) {
              return _arrayWithoutHoles2(arr) || _iterableToArray2(arr) || _unsupportedIterableToArray2(arr) || _nonIterableSpread2();
            }
            var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_ = __webpack_require__("a352");
            var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default = /* @__PURE__ */ __webpack_require__.n(external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_);
            function removeNode(node) {
              if (node.parentElement !== null) {
                node.parentElement.removeChild(node);
              }
            }
            function insertNodeAt(fatherNode, node, position) {
              var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
              fatherNode.insertBefore(node, refNode);
            }
            var console2 = __webpack_require__("dbf1");
            __webpack_require__("13d5");
            __webpack_require__("4fad");
            __webpack_require__("ac1f");
            __webpack_require__("5319");
            function cached(fn) {
              var cache2 = /* @__PURE__ */ Object.create(null);
              return function cachedFn(str) {
                var hit = cache2[str];
                return hit || (cache2[str] = fn(str));
              };
            }
            var regex = /-(\w)/g;
            var camelize = cached(function(str) {
              return str.replace(regex, function(_, c) {
                return c.toUpperCase();
              });
            });
            __webpack_require__("5db7");
            __webpack_require__("73d9");
            var manageAndEmit = ["Start", "Add", "Remove", "Update", "End"];
            var emit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
            var manage = ["Move"];
            var eventHandlerNames = [manage, manageAndEmit, emit].flatMap(function(events2) {
              return events2;
            }).map(function(evt) {
              return "on".concat(evt);
            });
            var events = {
              manage,
              manageAndEmit,
              emit
            };
            function isReadOnly(eventName) {
              return eventHandlerNames.indexOf(eventName) !== -1;
            }
            __webpack_require__("caad");
            __webpack_require__("2ca0");
            var tags = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"];
            function isHtmlTag(name) {
              return tags.includes(name);
            }
            function isTransition(name) {
              return ["transition-group", "TransitionGroup"].includes(name);
            }
            function isHtmlAttribute(value) {
              return ["id", "class", "role", "style"].includes(value) || value.startsWith("data-") || value.startsWith("aria-") || value.startsWith("on");
            }
            function project(entries) {
              return entries.reduce(function(res, _ref) {
                var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
                res[key] = value;
                return res;
              }, {});
            }
            function getComponentAttributes(_ref3) {
              var $attrs = _ref3.$attrs, _ref3$componentData = _ref3.componentData, componentData = _ref3$componentData === void 0 ? {} : _ref3$componentData;
              var attributes = project(Object.entries($attrs).filter(function(_ref4) {
                var _ref5 = _slicedToArray(_ref4, 2), key = _ref5[0];
                _ref5[1];
                return isHtmlAttribute(key);
              }));
              return _objectSpread22(_objectSpread22({}, attributes), componentData);
            }
            function createSortableOption(_ref6) {
              var $attrs = _ref6.$attrs, callBackBuilder = _ref6.callBackBuilder;
              var options = project(getValidSortableEntries($attrs));
              Object.entries(callBackBuilder).forEach(function(_ref7) {
                var _ref8 = _slicedToArray(_ref7, 2), eventType = _ref8[0], eventBuilder = _ref8[1];
                events[eventType].forEach(function(event) {
                  options["on".concat(event)] = eventBuilder(event);
                });
              });
              var draggable = "[data-draggable]".concat(options.draggable || "");
              return _objectSpread22(_objectSpread22({}, options), {}, {
                draggable
              });
            }
            function getValidSortableEntries(value) {
              return Object.entries(value).filter(function(_ref9) {
                var _ref10 = _slicedToArray(_ref9, 2), key = _ref10[0];
                _ref10[1];
                return !isHtmlAttribute(key);
              }).map(function(_ref11) {
                var _ref12 = _slicedToArray(_ref11, 2), key = _ref12[0], value2 = _ref12[1];
                return [camelize(key), value2];
              }).filter(function(_ref13) {
                var _ref14 = _slicedToArray(_ref13, 2), key = _ref14[0];
                _ref14[1];
                return !isReadOnly(key);
              });
            }
            __webpack_require__("c740");
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _defineProperties(target, props2) {
              for (var i = 0; i < props2.length; i++) {
                var descriptor = props2[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            function _createClass(Constructor, protoProps, staticProps) {
              if (protoProps) _defineProperties(Constructor.prototype, protoProps);
              return Constructor;
            }
            var getHtmlElementFromNode = function getHtmlElementFromNode2(_ref) {
              var el = _ref.el;
              return el;
            };
            var addContext = function addContext2(domElement, context) {
              return domElement.__draggable_context = context;
            };
            var getContext = function getContext2(domElement) {
              return domElement.__draggable_context;
            };
            var componentStructure_ComponentStructure = /* @__PURE__ */ function() {
              function ComponentStructure(_ref2) {
                var _ref2$nodes = _ref2.nodes, header = _ref2$nodes.header, defaultNodes = _ref2$nodes.default, footer = _ref2$nodes.footer, root = _ref2.root, realList = _ref2.realList;
                _classCallCheck(this, ComponentStructure);
                this.defaultNodes = defaultNodes;
                this.children = [].concat(_toConsumableArray2(header), _toConsumableArray2(defaultNodes), _toConsumableArray2(footer));
                this.externalComponent = root.externalComponent;
                this.rootTransition = root.transition;
                this.tag = root.tag;
                this.realList = realList;
              }
              _createClass(ComponentStructure, [{
                key: "render",
                value: function render(h2, attributes) {
                  var tag = this.tag, children = this.children, _isRootComponent = this._isRootComponent;
                  var option2 = !_isRootComponent ? children : {
                    default: function _default() {
                      return children;
                    }
                  };
                  return h2(tag, attributes, option2);
                }
              }, {
                key: "updated",
                value: function updated() {
                  var defaultNodes = this.defaultNodes, realList = this.realList;
                  defaultNodes.forEach(function(node, index2) {
                    addContext(getHtmlElementFromNode(node), {
                      element: realList[index2],
                      index: index2
                    });
                  });
                }
              }, {
                key: "getUnderlyingVm",
                value: function getUnderlyingVm(domElement) {
                  return getContext(domElement);
                }
              }, {
                key: "getVmIndexFromDomIndex",
                value: function getVmIndexFromDomIndex(domIndex, element) {
                  var defaultNodes = this.defaultNodes;
                  var length = defaultNodes.length;
                  var domChildren = element.children;
                  var domElement = domChildren.item(domIndex);
                  if (domElement === null) {
                    return length;
                  }
                  var context = getContext(domElement);
                  if (context) {
                    return context.index;
                  }
                  if (length === 0) {
                    return 0;
                  }
                  var firstDomListElement = getHtmlElementFromNode(defaultNodes[0]);
                  var indexFirstDomListElement = _toConsumableArray2(domChildren).findIndex(function(element2) {
                    return element2 === firstDomListElement;
                  });
                  return domIndex < indexFirstDomListElement ? 0 : length;
                }
              }, {
                key: "_isRootComponent",
                get: function get() {
                  return this.externalComponent || this.rootTransition;
                }
              }]);
              return ComponentStructure;
            }();
            var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
            function getSlot(slots, key) {
              var slotValue = slots[key];
              return slotValue ? slotValue() : [];
            }
            function computeNodes(_ref) {
              var $slots = _ref.$slots, realList = _ref.realList, getKey = _ref.getKey;
              var normalizedList = realList || [];
              var _map = ["header", "footer"].map(function(name) {
                return getSlot($slots, name);
              }), _map2 = _slicedToArray(_map, 2), header = _map2[0], footer = _map2[1];
              var item = $slots.item;
              if (!item) {
                throw new Error("draggable element must have an item slot");
              }
              var defaultNodes = normalizedList.flatMap(function(element, index2) {
                return item({
                  element,
                  index: index2
                }).map(function(node) {
                  node.key = getKey(element);
                  node.props = _objectSpread22(_objectSpread22({}, node.props || {}), {}, {
                    "data-draggable": true
                  });
                  return node;
                });
              });
              if (defaultNodes.length !== normalizedList.length) {
                throw new Error("Item slot must have only one child");
              }
              return {
                header,
                footer,
                default: defaultNodes
              };
            }
            function getRootInformation(tag) {
              var transition = isTransition(tag);
              var externalComponent = !isHtmlTag(tag) && !transition;
              return {
                transition,
                externalComponent,
                tag: externalComponent ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])(tag) : transition ? external_commonjs_vue_commonjs2_vue_root_Vue_["TransitionGroup"] : tag
              };
            }
            function computeComponentStructure(_ref2) {
              var $slots = _ref2.$slots, tag = _ref2.tag, realList = _ref2.realList, getKey = _ref2.getKey;
              var nodes = computeNodes({
                $slots,
                realList,
                getKey
              });
              var root = getRootInformation(tag);
              return new componentStructure_ComponentStructure({
                nodes,
                root,
                realList
              });
            }
            function _emit(evtName, evtData) {
              var _this = this;
              Object(external_commonjs_vue_commonjs2_vue_root_Vue_["nextTick"])(function() {
                return _this.$emit(evtName.toLowerCase(), evtData);
              });
            }
            function _manage(evtName) {
              var _this2 = this;
              return function(evtData, originalElement) {
                if (_this2.realList !== null) {
                  return _this2["onDrag".concat(evtName)](evtData, originalElement);
                }
              };
            }
            function _manageAndEmit(evtName) {
              var _this3 = this;
              var delegateCallBack = _manage.call(this, evtName);
              return function(evtData, originalElement) {
                delegateCallBack.call(_this3, evtData, originalElement);
                _emit.call(_this3, evtName, evtData);
              };
            }
            var draggingElement = null;
            var props = {
              list: {
                type: Array,
                required: false,
                default: null
              },
              modelValue: {
                type: Array,
                required: false,
                default: null
              },
              itemKey: {
                type: [String, Function],
                required: true
              },
              clone: {
                type: Function,
                default: function _default(original) {
                  return original;
                }
              },
              tag: {
                type: String,
                default: "div"
              },
              move: {
                type: Function,
                default: null
              },
              componentData: {
                type: Object,
                required: false,
                default: null
              }
            };
            var emits = ["update:modelValue", "change"].concat(_toConsumableArray2([].concat(_toConsumableArray2(events.manageAndEmit), _toConsumableArray2(events.emit)).map(function(evt) {
              return evt.toLowerCase();
            })));
            var draggableComponent = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
              name: "draggable",
              inheritAttrs: false,
              props,
              emits,
              data: function data() {
                return {
                  error: false
                };
              },
              render: function render() {
                try {
                  this.error = false;
                  var $slots = this.$slots, $attrs = this.$attrs, tag = this.tag, componentData = this.componentData, realList = this.realList, getKey = this.getKey;
                  var componentStructure = computeComponentStructure({
                    $slots,
                    tag,
                    realList,
                    getKey
                  });
                  this.componentStructure = componentStructure;
                  var attributes = getComponentAttributes({
                    $attrs,
                    componentData
                  });
                  return componentStructure.render(external_commonjs_vue_commonjs2_vue_root_Vue_["h"], attributes);
                } catch (err) {
                  this.error = true;
                  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["h"])("pre", {
                    style: {
                      color: "red"
                    }
                  }, err.stack);
                }
              },
              created: function created() {
                if (this.list !== null && this.modelValue !== null) {
                  console2[
                    "a"
                    /* console */
                  ].error("modelValue and list props are mutually exclusive! Please set one or another.");
                }
              },
              mounted: function mounted() {
                var _this4 = this;
                if (this.error) {
                  return;
                }
                var $attrs = this.$attrs, $el = this.$el, componentStructure = this.componentStructure;
                componentStructure.updated();
                var sortableOptions = createSortableOption({
                  $attrs,
                  callBackBuilder: {
                    manageAndEmit: function manageAndEmit2(event) {
                      return _manageAndEmit.call(_this4, event);
                    },
                    emit: function emit2(event) {
                      return _emit.bind(_this4, event);
                    },
                    manage: function manage2(event) {
                      return _manage.call(_this4, event);
                    }
                  }
                });
                var targetDomElement = $el.nodeType === 1 ? $el : $el.parentElement;
                this._sortable = new external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default.a(targetDomElement, sortableOptions);
                this.targetDomElement = targetDomElement;
                targetDomElement.__draggable_component__ = this;
              },
              updated: function updated() {
                this.componentStructure.updated();
              },
              beforeUnmount: function beforeUnmount() {
                if (this._sortable !== void 0) this._sortable.destroy();
              },
              computed: {
                realList: function realList() {
                  var list = this.list;
                  return list ? list : this.modelValue;
                },
                getKey: function getKey() {
                  var itemKey = this.itemKey;
                  if (typeof itemKey === "function") {
                    return itemKey;
                  }
                  return function(element) {
                    return element[itemKey];
                  };
                }
              },
              watch: {
                $attrs: {
                  handler: function handler(newOptionValue) {
                    var _sortable = this._sortable;
                    if (!_sortable) return;
                    getValidSortableEntries(newOptionValue).forEach(function(_ref) {
                      var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
                      _sortable.option(key, value);
                    });
                  },
                  deep: true
                }
              },
              methods: {
                getUnderlyingVm: function getUnderlyingVm(domElement) {
                  return this.componentStructure.getUnderlyingVm(domElement) || null;
                },
                getUnderlyingPotencialDraggableComponent: function getUnderlyingPotencialDraggableComponent(htmElement) {
                  return htmElement.__draggable_component__;
                },
                emitChanges: function emitChanges(evt) {
                  var _this5 = this;
                  Object(external_commonjs_vue_commonjs2_vue_root_Vue_["nextTick"])(function() {
                    return _this5.$emit("change", evt);
                  });
                },
                alterList: function alterList(onList) {
                  if (this.list) {
                    onList(this.list);
                    return;
                  }
                  var newList = _toConsumableArray2(this.modelValue);
                  onList(newList);
                  this.$emit("update:modelValue", newList);
                },
                spliceList: function spliceList() {
                  var _arguments = arguments;
                  var spliceList2 = function spliceList3(list) {
                    return list.splice.apply(list, _toConsumableArray2(_arguments));
                  };
                  this.alterList(spliceList2);
                },
                updatePosition: function updatePosition(oldIndex2, newIndex2) {
                  var updatePosition2 = function updatePosition3(list) {
                    return list.splice(newIndex2, 0, list.splice(oldIndex2, 1)[0]);
                  };
                  this.alterList(updatePosition2);
                },
                getRelatedContextFromMoveEvent: function getRelatedContextFromMoveEvent(_ref3) {
                  var to = _ref3.to, related = _ref3.related;
                  var component = this.getUnderlyingPotencialDraggableComponent(to);
                  if (!component) {
                    return {
                      component
                    };
                  }
                  var list = component.realList;
                  var context = {
                    list,
                    component
                  };
                  if (to !== related && list) {
                    var destination = component.getUnderlyingVm(related) || {};
                    return _objectSpread22(_objectSpread22({}, destination), context);
                  }
                  return context;
                },
                getVmIndexFromDomIndex: function getVmIndexFromDomIndex(domIndex) {
                  return this.componentStructure.getVmIndexFromDomIndex(domIndex, this.targetDomElement);
                },
                onDragStart: function onDragStart(evt) {
                  this.context = this.getUnderlyingVm(evt.item);
                  evt.item._underlying_vm_ = this.clone(this.context.element);
                  draggingElement = evt.item;
                },
                onDragAdd: function onDragAdd(evt) {
                  var element = evt.item._underlying_vm_;
                  if (element === void 0) {
                    return;
                  }
                  removeNode(evt.item);
                  var newIndex2 = this.getVmIndexFromDomIndex(evt.newIndex);
                  this.spliceList(newIndex2, 0, element);
                  var added = {
                    element,
                    newIndex: newIndex2
                  };
                  this.emitChanges({
                    added
                  });
                },
                onDragRemove: function onDragRemove(evt) {
                  insertNodeAt(this.$el, evt.item, evt.oldIndex);
                  if (evt.pullMode === "clone") {
                    removeNode(evt.clone);
                    return;
                  }
                  var _this$context = this.context, oldIndex2 = _this$context.index, element = _this$context.element;
                  this.spliceList(oldIndex2, 1);
                  var removed = {
                    element,
                    oldIndex: oldIndex2
                  };
                  this.emitChanges({
                    removed
                  });
                },
                onDragUpdate: function onDragUpdate(evt) {
                  removeNode(evt.item);
                  insertNodeAt(evt.from, evt.item, evt.oldIndex);
                  var oldIndex2 = this.context.index;
                  var newIndex2 = this.getVmIndexFromDomIndex(evt.newIndex);
                  this.updatePosition(oldIndex2, newIndex2);
                  var moved2 = {
                    element: this.context.element,
                    oldIndex: oldIndex2,
                    newIndex: newIndex2
                  };
                  this.emitChanges({
                    moved: moved2
                  });
                },
                computeFutureIndex: function computeFutureIndex(relatedContext, evt) {
                  if (!relatedContext.element) {
                    return 0;
                  }
                  var domChildren = _toConsumableArray2(evt.to.children).filter(function(el) {
                    return el.style["display"] !== "none";
                  });
                  var currentDomIndex = domChildren.indexOf(evt.related);
                  var currentIndex = relatedContext.component.getVmIndexFromDomIndex(currentDomIndex);
                  var draggedInList = domChildren.indexOf(draggingElement) !== -1;
                  return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
                },
                onDragMove: function onDragMove(evt, originalEvent) {
                  var move = this.move, realList = this.realList;
                  if (!move || !realList) {
                    return true;
                  }
                  var relatedContext = this.getRelatedContextFromMoveEvent(evt);
                  var futureIndex = this.computeFutureIndex(relatedContext, evt);
                  var draggedContext = _objectSpread22(_objectSpread22({}, this.context), {}, {
                    futureIndex
                  });
                  var sendEvent = _objectSpread22(_objectSpread22({}, evt), {}, {
                    relatedContext,
                    draggedContext
                  });
                  return move(sendEvent, originalEvent);
                },
                onDragEnd: function onDragEnd() {
                  draggingElement = null;
                }
              }
            });
            var vuedraggable2 = draggableComponent;
            __webpack_exports__["default"] = vuedraggable2;
          }
        ),
        /***/
        "fb6a": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var $ = __webpack_require__("23e7");
            var isObject2 = __webpack_require__("861d");
            var isArray2 = __webpack_require__("e8b5");
            var toAbsoluteIndex = __webpack_require__("23cb");
            var toLength = __webpack_require__("50c4");
            var toIndexedObject = __webpack_require__("fc6a");
            var createProperty = __webpack_require__("8418");
            var wellKnownSymbol = __webpack_require__("b622");
            var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
            var arrayMethodUsesToLength = __webpack_require__("ae40");
            var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("slice");
            var USES_TO_LENGTH = arrayMethodUsesToLength("slice", { ACCESSORS: true, 0: 0, 1: 2 });
            var SPECIES = wellKnownSymbol("species");
            var nativeSlice = [].slice;
            var max = Math.max;
            $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
              slice: function slice(start, end) {
                var O = toIndexedObject(this);
                var length = toLength(O.length);
                var k = toAbsoluteIndex(start, length);
                var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
                var Constructor, result, n;
                if (isArray2(O)) {
                  Constructor = O.constructor;
                  if (typeof Constructor == "function" && (Constructor === Array || isArray2(Constructor.prototype))) {
                    Constructor = void 0;
                  } else if (isObject2(Constructor)) {
                    Constructor = Constructor[SPECIES];
                    if (Constructor === null) Constructor = void 0;
                  }
                  if (Constructor === Array || Constructor === void 0) {
                    return nativeSlice.call(O, k, fin);
                  }
                }
                result = new (Constructor === void 0 ? Array : Constructor)(max(fin - k, 0));
                for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
                result.length = n;
                return result;
              }
            });
          }
        ),
        /***/
        "fc6a": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var IndexedObject = __webpack_require__("44ad");
            var requireObjectCoercible = __webpack_require__("1d80");
            module2.exports = function(it) {
              return IndexedObject(requireObjectCoercible(it));
            };
          }
        ),
        /***/
        "fdbc": (
          /***/
          function(module2, exports2) {
            module2.exports = {
              CSSRuleList: 0,
              CSSStyleDeclaration: 0,
              CSSValueList: 0,
              ClientRectList: 0,
              DOMRectList: 0,
              DOMStringList: 0,
              DOMTokenList: 1,
              DataTransferItemList: 0,
              FileList: 0,
              HTMLAllCollection: 0,
              HTMLCollection: 0,
              HTMLFormElement: 0,
              HTMLSelectElement: 0,
              MediaList: 0,
              MimeTypeArray: 0,
              NamedNodeMap: 0,
              NodeList: 1,
              PaintRequestList: 0,
              Plugin: 0,
              PluginArray: 0,
              SVGLengthList: 0,
              SVGNumberList: 0,
              SVGPathSegList: 0,
              SVGPointList: 0,
              SVGStringList: 0,
              SVGTransformList: 0,
              SourceBufferList: 0,
              StyleSheetList: 0,
              TextTrackCueList: 0,
              TextTrackList: 0,
              TouchList: 0
            };
          }
        ),
        /***/
        "fdbf": (
          /***/
          function(module2, exports2, __webpack_require__) {
            var NATIVE_SYMBOL = __webpack_require__("4930");
            module2.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
          }
        )
        /******/
      })["default"]
    );
  });
})(vuedraggable_umd);
var vuedraggable_umdExports = vuedraggable_umd.exports;
const vuedraggable = /* @__PURE__ */ getDefaultExportFromCjs(vuedraggable_umdExports);
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/quiz-display-tool/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var jszip_min = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function(module, exports) {
  !function(e) {
    module.exports = e();
  }(function() {
    return function s(a, o, h2) {
      function u(r, e2) {
        if (!o[r]) {
          if (!a[r]) {
            var t = "function" == typeof commonjsRequire && commonjsRequire;
            if (!e2 && t) return t(r, true);
            if (l) return l(r, true);
            var n = new Error("Cannot find module '" + r + "'");
            throw n.code = "MODULE_NOT_FOUND", n;
          }
          var i = o[r] = { exports: {} };
          a[r][0].call(i.exports, function(e3) {
            var t2 = a[r][1][e3];
            return u(t2 || e3);
          }, i, i.exports, s, a, o, h2);
        }
        return o[r].exports;
      }
      for (var l = "function" == typeof commonjsRequire && commonjsRequire, e = 0; e < h2.length; e++) u(h2[e]);
      return u;
    }({ 1: [function(e, t, r) {
      var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      r.encode = function(e2) {
        for (var t2, r2, n, i, s, a, o, h2 = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h2.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
        return h2.join("");
      }, r.decode = function(e2) {
        var t2, r2, n, i, s, a, o = 0, h2 = 0, u = "data:";
        if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
        var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
        for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h2++] = t2, 64 !== s && (l[h2++] = r2), 64 !== a && (l[h2++] = n);
        return l;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
      var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
      function o(e2, t2, r2, n2, i2) {
        this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
      }
      o.prototype = { getContentWorker: function() {
        var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
        return e2.on("end", function() {
          if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
        }), e2;
      }, getCompressedWorker: function() {
        return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, o.createWorkerFrom = function(e2, t2, r2) {
        return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
      }, t.exports = o;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
      var n = e("./stream/GenericWorker");
      r.STORE = { magic: "\0\0", compressWorker: function() {
        return new n("STORE compression");
      }, uncompressWorker: function() {
        return new n("STORE decompression");
      } }, r.DEFLATE = e("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
      var n = e("./utils");
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2) {
        return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(e, t, r) {
      r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
    }, {}], 6: [function(e, t, r) {
      var n = null;
      n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
    }, { lie: 37 }], 7: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
      function h2(e2, t2) {
        a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
      }
      r.magic = "\b\0", s.inherits(h2, a), h2.prototype.processChunk = function(e2) {
        this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
      }, h2.prototype.flush = function() {
        a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
      }, h2.prototype.cleanUp = function() {
        a.prototype.cleanUp.call(this), this._pako = null;
      }, h2.prototype._createPako = function() {
        this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
        var t2 = this;
        this._pako.onData = function(e2) {
          t2.push({ data: e2, meta: t2.meta });
        };
      }, r.compressWorker = function(e2) {
        return new h2("Deflate", e2);
      }, r.uncompressWorker = function() {
        return new h2("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
      function A(e2, t2) {
        var r2, n2 = "";
        for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
        return n2;
      }
      function n(e2, t2, r2, n2, i2, s2) {
        var a, o, h2 = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I2.transformTo("string", s2(h2.name)), c = I2.transformTo("string", O.utf8encode(h2.name)), d = h2.comment, p = I2.transformTo("string", s2(d)), m = I2.transformTo("string", O.utf8encode(d)), _ = c.length !== h2.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h2.dir, k = h2.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
        var S = 0;
        t2 && (S |= 8), l || !_ && !g || (S |= 2048);
        var z = 0, C = 0;
        w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= function(e3, t3) {
          var r3 = e3;
          return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
        }(h2.unixPermissions, w)) : (C = 20, z |= function(e3) {
          return 63 & (e3 || 0);
        }(h2.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
        var E = "";
        return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
      }
      var I2 = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
      function s(e2, t2, r2, n2) {
        i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      I2.inherits(s, i), s.prototype.push = function(e2) {
        var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
        this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
      }, s.prototype.openedSource = function(e2) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
        var t2 = this.streamFiles && !e2.file.dir;
        if (t2) {
          var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: r2.fileRecord, meta: { percent: 0 } });
        } else this.accumulate = true;
      }, s.prototype.closedSource = function(e2) {
        this.accumulate = false;
        var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: function(e3) {
          return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
        }(e2), meta: { percent: 100 } });
        else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, s.prototype.flush = function() {
        for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
        var r2 = this.bytesWritten - e2, n2 = function(e3, t3, r3, n3, i2) {
          var s2 = I2.transformTo("string", i2(n3));
          return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
        }(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
        this.push({ data: n2, meta: { percent: 100 } });
      }, s.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, s.prototype.registerPrevious = function(e2) {
        this._sources.push(e2);
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
      }, s.prototype.error = function(e2) {
        var t2 = this._sources;
        if (!i.prototype.error.call(this, e2)) return false;
        for (var r2 = 0; r2 < t2.length; r2++) try {
          t2[r2].error(e2);
        } catch (e3) {
        }
        return true;
      }, s.prototype.lock = function() {
        i.prototype.lock.call(this);
        for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
      }, t.exports = s;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
      var u = e("../compressions"), n = e("./ZipFileWorker");
      r.generateWorker = function(e2, a, t2) {
        var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h2 = 0;
        try {
          e2.forEach(function(e3, t3) {
            h2++;
            var r2 = function(e4, t4) {
              var r3 = e4 || t4, n3 = u[r3];
              if (!n3) throw new Error(r3 + " is not a valid compression method !");
              return n3;
            }(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
            t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
          }), o.entriesCount = h2;
        } catch (e3) {
          o.error(e3);
        }
        return o;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
      function n() {
        if (!(this instanceof n)) return new n();
        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var e2 = new n();
          for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
          return e2;
        };
      }
      (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
        return new n().loadAsync(e2, t2);
      }, n.external = e("./external"), t.exports = n;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
      var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
      function f(n2) {
        return new i.Promise(function(e2, t2) {
          var r2 = n2.decompressed.getContentWorker().pipe(new a());
          r2.on("error", function(e3) {
            t2(e3);
          }).on("end", function() {
            r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
          }).resume();
        });
      }
      t.exports = function(e2, o) {
        var h2 = this;
        return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
          var t2 = new s(o);
          return t2.load(e3), t2;
        }).then(function(e3) {
          var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
          if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
          return i.Promise.all(t2);
        }).then(function(e3) {
          for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
            var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
            h2.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h2.file(a2).unsafeOriginalName = s2);
          }
          return t2.zipComment.length && (h2.comment = t2.zipComment), h2;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
      var n = e("../utils"), i = e("../stream/GenericWorker");
      function s(e2, t2) {
        i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
      }
      n.inherits(s, i), s.prototype._bindStream = function(e2) {
        var t2 = this;
        (this._stream = e2).pause(), e2.on("data", function(e3) {
          t2.push({ data: e3, meta: { percent: 0 } });
        }).on("error", function(e3) {
          t2.isPaused ? this.generatedError = e3 : t2.error(e3);
        }).on("end", function() {
          t2.isPaused ? t2._upstreamEnded = true : t2.end();
        });
      }, s.prototype.pause = function() {
        return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
      }, t.exports = s;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
      var i = e("readable-stream").Readable;
      function n(e2, t2, r2) {
        i.call(this, t2), this._helper = e2;
        var n2 = this;
        e2.on("data", function(e3, t3) {
          n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
        }).on("error", function(e3) {
          n2.emit("error", e3);
        }).on("end", function() {
          n2.push(null);
        });
      }
      e("../utils").inherits(n, i), n.prototype._read = function() {
        this._helper.resume();
      }, t.exports = n;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
      t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
        if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
        return new Buffer(e2, t2);
      }, allocBuffer: function(e2) {
        if (Buffer.alloc) return Buffer.alloc(e2);
        var t2 = new Buffer(e2);
        return t2.fill(0), t2;
      }, isBuffer: function(e2) {
        return Buffer.isBuffer(e2);
      }, isStream: function(e2) {
        return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
      } };
    }, {}], 15: [function(e, t, r) {
      function s(e2, t2, r2) {
        var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
        s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
        var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
        r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
        var o2 = null;
        o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
        var h3 = new d(e2, o2, s2);
        this.files[e2] = h3;
      }
      var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
        "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
        var t2 = e2.lastIndexOf("/");
        return 0 < t2 ? e2.substring(0, t2) : "";
      }, g = function(e2) {
        return "/" !== e2.slice(-1) && (e2 += "/"), e2;
      }, b = function(e2, t2) {
        return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
      };
      function h2(e2) {
        return "[object RegExp]" === Object.prototype.toString.call(e2);
      }
      var n = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(e2) {
        var t2, r2, n2;
        for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
      }, filter: function(r2) {
        var n2 = [];
        return this.forEach(function(e2, t2) {
          r2(e2, t2) && n2.push(t2);
        }), n2;
      }, file: function(e2, t2, r2) {
        if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
        if (h2(e2)) {
          var n2 = e2;
          return this.filter(function(e3, t3) {
            return !t3.dir && n2.test(e3);
          });
        }
        var i2 = this.files[this.root + e2];
        return i2 && !i2.dir ? i2 : null;
      }, folder: function(r2) {
        if (!r2) return this;
        if (h2(r2)) return this.filter(function(e3, t3) {
          return t3.dir && r2.test(e3);
        });
        var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
        return n2.root = t2.name, n2;
      }, remove: function(r2) {
        r2 = this.root + r2;
        var e2 = this.files[r2];
        if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
        else for (var t2 = this.filter(function(e3, t3) {
          return t3.name.slice(0, r2.length) === r2;
        }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(e2) {
        var t2, r2 = {};
        try {
          if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
          u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
          var n2 = r2.comment || this.comment || "";
          t2 = o.generateWorker(this, r2, n2);
        } catch (e3) {
          (t2 = new l("error")).error(e3);
        }
        return new a(t2, r2.type || "string", r2.mimeType);
      }, generateAsync: function(e2, t2) {
        return this.generateInternalStream(e2).accumulate(t2);
      }, generateNodeStream: function(e2, t2) {
        return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
      } };
      t.exports = n;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
      t.exports = e("stream");
    }, { stream: void 0 }], 17: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
        for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data[this.zero + e2];
      }, i.prototype.lastIndexOfSignature = function(e2) {
        for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
        return -1;
      }, i.prototype.readAndCheckSignature = function(e2) {
        var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
        return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
      }, i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2) return [];
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
      var n = e("../utils");
      function i(e2) {
        this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
      }
      i.prototype = { checkOffset: function(e2) {
        this.checkIndex(this.index + e2);
      }, checkIndex: function(e2) {
        if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
      }, setIndex: function(e2) {
        this.checkIndex(e2), this.index = e2;
      }, skip: function(e2) {
        this.setIndex(this.index + e2);
      }, byteAt: function() {
      }, readInt: function(e2) {
        var t2, r2 = 0;
        for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
        return this.index += e2, r2;
      }, readString: function(e2) {
        return n.transformTo("string", this.readData(e2));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var e2 = this.readInt(4);
        return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
      } }, t.exports = i;
    }, { "../utils": 32 }], 19: [function(e, t, r) {
      var n = e("./Uint8ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data.charCodeAt(this.zero + e2);
      }, i.prototype.lastIndexOfSignature = function(e2) {
        return this.data.lastIndexOf(e2) - this.zero;
      }, i.prototype.readAndCheckSignature = function(e2) {
        return e2 === this.readData(4);
      }, i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
      var n = e("./ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
        var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
      var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h2 = e("./Uint8ArrayReader");
      t.exports = function(e2) {
        var t2 = n.getTypeOf(e2);
        return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h2(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
      r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../utils");
      function s(e2) {
        n.call(this, "ConvertWorker to " + e2), this.destType = e2;
      }
      i.inherits(s, n), s.prototype.processChunk = function(e2) {
        this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../crc32");
      function s() {
        n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
        this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
      }, t.exports = s;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
      }
      n.inherits(s, i), s.prototype.processChunk = function(e2) {
        if (e2) {
          var t2 = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = t2 + e2.data.length;
        }
        i.prototype.processChunk.call(this, e2);
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataWorker");
        var t2 = this;
        this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
          t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
        }, function(e3) {
          t2.error(e3);
        });
      }
      n.inherits(s, i), s.prototype.cleanUp = function() {
        i.prototype.cleanUp.call(this), this.data = null;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
      }, s.prototype._tickAndRepeat = function() {
        this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
      }, s.prototype._tick = function() {
        if (this.isPaused || this.isFinished) return false;
        var e2 = null, t2 = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max) return this.end();
        switch (this.type) {
          case "string":
            e2 = this.data.substring(this.index, t2);
            break;
          case "uint8array":
            e2 = this.data.subarray(this.index, t2);
            break;
          case "array":
          case "nodebuffer":
            e2 = this.data.slice(this.index, t2);
        }
        return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
      function n(e2) {
        this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      n.prototype = { push: function(e2) {
        this.emit("data", e2);
      }, end: function() {
        if (this.isFinished) return false;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = true;
        } catch (e2) {
          this.emit("error", e2);
        }
        return true;
      }, error: function(e2) {
        return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
      }, on: function(e2, t2) {
        return this._listeners[e2].push(t2), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(e2, t2) {
        if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
      }, pipe: function(e2) {
        return e2.registerPrevious(this);
      }, registerPrevious: function(e2) {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
      }, resume: function() {
        if (!this.isPaused || this.isFinished) return false;
        var e2 = this.isPaused = false;
        return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
      }, flush: function() {
      }, processChunk: function(e2) {
        this.push(e2);
      }, withStreamInfo: function(e2, t2) {
        return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
      }, lock: function() {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = true, this.previous && this.previous.lock();
      }, toString: function() {
        var e2 = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + e2 : e2;
      } }, t.exports = n;
    }, {}], 29: [function(e, t, r) {
      var h2 = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
      if (n.nodestream) try {
        o = e("../nodejs/NodejsStreamOutputAdapter");
      } catch (e2) {
      }
      function l(e2, o2) {
        return new a.Promise(function(t2, r2) {
          var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
          e2.on("data", function(e3, t3) {
            n2.push(e3), o2 && o2(t3);
          }).on("error", function(e3) {
            n2 = [], r2(e3);
          }).on("end", function() {
            try {
              var e3 = function(e4, t3, r3) {
                switch (e4) {
                  case "blob":
                    return h2.newBlob(h2.transformTo("arraybuffer", t3), r3);
                  case "base64":
                    return u.encode(t3);
                  default:
                    return h2.transformTo(e4, t3);
                }
              }(s2, function(e4, t3) {
                var r3, n3 = 0, i3 = null, s3 = 0;
                for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                switch (e4) {
                  case "string":
                    return t3.join("");
                  case "array":
                    return Array.prototype.concat.apply([], t3);
                  case "uint8array":
                    for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                    return i3;
                  case "nodebuffer":
                    return Buffer.concat(t3);
                  default:
                    throw new Error("concat : unsupported type '" + e4 + "'");
                }
              }(i2, n2), a2);
              t2(e3);
            } catch (e4) {
              r2(e4);
            }
            n2 = [];
          }).resume();
        });
      }
      function f(e2, t2, r2) {
        var n2 = t2;
        switch (t2) {
          case "blob":
          case "arraybuffer":
            n2 = "uint8array";
            break;
          case "base64":
            n2 = "string";
        }
        try {
          this._internalType = n2, this._outputType = t2, this._mimeType = r2, h2.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
        } catch (e3) {
          this._worker = new s("error"), this._worker.error(e3);
        }
      }
      f.prototype = { accumulate: function(e2) {
        return l(this, e2);
      }, on: function(e2, t2) {
        var r2 = this;
        return "data" === e2 ? this._worker.on(e2, function(e3) {
          t2.call(r2, e3.data, e3.meta);
        }) : this._worker.on(e2, function() {
          h2.delay(t2, arguments, r2);
        }), this;
      }, resume: function() {
        return h2.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(e2) {
        if (h2.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
        return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
      } }, t.exports = f;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
      if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
      else {
        var n = new ArrayBuffer(0);
        try {
          r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
        } catch (e2) {
          try {
            var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
          } catch (e3) {
            r.blob = false;
          }
        }
      }
      try {
        r.nodestream = !!e("readable-stream").Readable;
      } catch (e2) {
        r.nodestream = false;
      }
    }, { "readable-stream": 16 }], 31: [function(e, t, s) {
      for (var o = e("./utils"), h2 = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
      u[254] = u[254] = 1;
      function a() {
        n.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function l() {
        n.call(this, "utf-8 encode");
      }
      s.utf8encode = function(e2) {
        return h2.nodebuffer ? r.newBufferFrom(e2, "utf-8") : function(e3) {
          var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
          for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
          for (t2 = h2.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
          return t2;
        }(e2);
      }, s.utf8decode = function(e2) {
        return h2.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : function(e3) {
          var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
          for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
          else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
          else {
            for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
            1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
          }
          return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
        }(e2 = o.transformTo(h2.uint8array ? "uint8array" : "array", e2));
      }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
        var t2 = o.transformTo(h2.uint8array ? "uint8array" : "array", e2.data);
        if (this.leftOver && this.leftOver.length) {
          if (h2.uint8array) {
            var r2 = t2;
            (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
          } else t2 = this.leftOver.concat(t2);
          this.leftOver = null;
        }
        var n2 = function(e3, t3) {
          var r3;
          for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
          return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
        }(t2), i2 = t2;
        n2 !== t2.length && (h2.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
      }, a.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
        this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
      }, s.Utf8EncodeWorker = l;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
      var o = e("./support"), h2 = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
      function n(e2) {
        return e2;
      }
      function l(e2, t2) {
        for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
        return t2;
      }
      e("setimmediate"), a.newBlob = function(t2, r2) {
        a.checkSupport("blob");
        try {
          return new Blob([t2], { type: r2 });
        } catch (e2) {
          try {
            var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return n2.append(t2), n2.getBlob(r2);
          } catch (e3) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var i = { stringifyByChunk: function(e2, t2, r2) {
        var n2 = [], i2 = 0, s2 = e2.length;
        if (s2 <= r2) return String.fromCharCode.apply(null, e2);
        for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
        return n2.join("");
      }, stringifyByChar: function(e2) {
        for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
        return t2;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
        } catch (e2) {
          return false;
        }
      }(), nodebuffer: function() {
        try {
          return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
        } catch (e2) {
          return false;
        }
      }() } };
      function s(e2) {
        var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
        if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
          return i.stringifyByChunk(e2, r2, t2);
        } catch (e3) {
          t2 = Math.floor(t2 / 2);
        }
        return i.stringifyByChar(e2);
      }
      function f(e2, t2) {
        for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
        return t2;
      }
      a.applyFromCharCode = s;
      var c = {};
      c.string = { string: n, array: function(e2) {
        return l(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.string.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return l(e2, new Uint8Array(e2.length));
      }, nodebuffer: function(e2) {
        return l(e2, r.allocBuffer(e2.length));
      } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
        return new Uint8Array(e2).buffer;
      }, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.arraybuffer = { string: function(e2) {
        return s(new Uint8Array(e2));
      }, array: function(e2) {
        return f(new Uint8Array(e2), new Array(e2.byteLength));
      }, arraybuffer: n, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(new Uint8Array(e2));
      } }, c.uint8array = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return e2.buffer;
      }, uint8array: n, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.nodebuffer = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.nodebuffer.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return f(e2, new Uint8Array(e2.length));
      }, nodebuffer: n }, a.transformTo = function(e2, t2) {
        if (t2 = t2 || "", !e2) return t2;
        a.checkSupport(e2);
        var r2 = a.getTypeOf(t2);
        return c[r2][e2](t2);
      }, a.resolve = function(e2) {
        for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
          var i2 = t2[n2];
          "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
        }
        return r2.join("/");
      }, a.getTypeOf = function(e2) {
        return "string" == typeof e2 ? "string" : "[object Array]" === Object.prototype.toString.call(e2) ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, a.checkSupport = function(e2) {
        if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
      }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
        var t2, r2, n2 = "";
        for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
        return n2;
      }, a.delay = function(e2, t2, r2) {
        setImmediate(function() {
          e2.apply(r2 || null, t2 || []);
        });
      }, a.inherits = function(e2, t2) {
        function r2() {
        }
        r2.prototype = t2.prototype, e2.prototype = new r2();
      }, a.extend = function() {
        var e2, t2, r2 = {};
        for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
        return r2;
      }, a.prepareContent = function(r2, e2, n2, i2, s2) {
        return u.Promise.resolve(e2).then(function(n3) {
          return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) && "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
            var e3 = new FileReader();
            e3.onload = function(e4) {
              t2(e4.target.result);
            }, e3.onerror = function(e4) {
              r3(e4.target.error);
            }, e3.readAsArrayBuffer(n3);
          }) : n3;
        }).then(function(e3) {
          var t2 = a.getTypeOf(e3);
          return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h2.decode(e3) : n2 && true !== i2 && (e3 = function(e4) {
            return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
          }(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
      var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
      function h2(e2) {
        this.files = [], this.loadOptions = e2;
      }
      h2.prototype = { checkSignature: function(e2) {
        if (!this.reader.readAndCheckSignature(e2)) {
          this.reader.index -= 4;
          var t2 = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
        }
      }, isSignature: function(e2, t2) {
        var r2 = this.reader.index;
        this.reader.setIndex(e2);
        var n2 = this.reader.readString(4) === t2;
        return this.reader.setIndex(r2), n2;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
        this.zipComment = this.loadOptions.decodeFileName(r2);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var e2, t2;
        for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
      }, readCentralDir: function() {
        var e2;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
        if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
        if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
        this.reader.setIndex(e2);
        var t2 = e2;
        if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
          if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var r2 = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
        var n2 = t2 - r2;
        if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
        else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
      }, prepareReader: function(e2) {
        this.reader = n(e2);
      }, load: function(e2) {
        this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, t.exports = h2;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
      var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h2 = e("./compressions"), u = e("./support");
      function l(e2, t2) {
        this.options = e2, this.loadOptions = t2;
      }
      l.prototype = { isEncrypted: function() {
        return 1 == (1 & this.bitFlag);
      }, useUTF8: function() {
        return 2048 == (2048 & this.bitFlag);
      }, readLocalPart: function(e2) {
        var t2, r2;
        if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if (null === (t2 = function(e3) {
          for (var t3 in h2) if (Object.prototype.hasOwnProperty.call(h2, t3) && h2[t3].magic === e3) return h2[t3];
          return null;
        }(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
        this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
      }, readCentralPart: function(e2) {
        this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
        var t2 = e2.readInt(2);
        if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
        e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var e2 = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var e2 = n(this.extraFields[1].value);
          this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
        }
      }, readExtraFields: function(e2) {
        var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
        e2.setIndex(i2);
      }, handleUTF8: function() {
        var e2 = u.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
        else {
          var t2 = this.findExtraFieldUnicodePath();
          if (null !== t2) this.fileNameStr = t2;
          else {
            var r2 = s.transformTo(e2, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(r2);
          }
          var n2 = this.findExtraFieldUnicodeComment();
          if (null !== n2) this.fileCommentStr = n2;
          else {
            var i2 = s.transformTo(e2, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(i2);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var e2 = this.extraFields[28789];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var e2 = this.extraFields[25461];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      } }, t.exports = l;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
      function n(e2, t2, r2) {
        this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
      }
      var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h2 = e("./stream/GenericWorker");
      n.prototype = { internalStream: function(e2) {
        var t2 = null, r2 = "string";
        try {
          if (!e2) throw new Error("No output type specified.");
          var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
          "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
          var i2 = !this._dataBinary;
          i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
        } catch (e3) {
          (t2 = new h2("error")).error(e3);
        }
        return new s(t2, r2, "");
      }, async: function(e2, t2) {
        return this.internalStream(e2).accumulate(t2);
      }, nodeStream: function(e2, t2) {
        return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
      }, _compressWorker: function(e2, t2) {
        if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
        var r2 = this._decompressWorker();
        return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
      }, _decompressWorker: function() {
        return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h2 ? this._data : new i(this._data);
      } };
      for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
      t.exports = n;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
      (function(t2) {
        var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
        if (e2) {
          var i = 0, s = new e2(u), a = t2.document.createTextNode("");
          s.observe(a, { characterData: true }), r = function() {
            a.data = i = ++i % 2;
          };
        } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
          var e3 = t2.document.createElement("script");
          e3.onreadystatechange = function() {
            u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
          }, t2.document.documentElement.appendChild(e3);
        } : function() {
          setTimeout(u, 0);
        };
        else {
          var o = new t2.MessageChannel();
          o.port1.onmessage = u, r = function() {
            o.port2.postMessage(0);
          };
        }
        var h2 = [];
        function u() {
          var e3, t3;
          n = true;
          for (var r2 = h2.length; r2; ) {
            for (t3 = h2, h2 = [], e3 = -1; ++e3 < r2; ) t3[e3]();
            r2 = h2.length;
          }
          n = false;
        }
        l.exports = function(e3) {
          1 !== h2.push(e3) || n || r();
        };
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 37: [function(e, t, r) {
      var i = e("immediate");
      function u() {
      }
      var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
      function o(e2) {
        if ("function" != typeof e2) throw new TypeError("resolver must be a function");
        this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
      }
      function h2(e2, t2, r2) {
        this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
      }
      function f(t2, r2, n2) {
        i(function() {
          var e2;
          try {
            e2 = r2(n2);
          } catch (e3) {
            return l.reject(t2, e3);
          }
          e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
        });
      }
      function c(e2) {
        var t2 = e2 && e2.then;
        if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
          t2.apply(e2, arguments);
        };
      }
      function d(t2, e2) {
        var r2 = false;
        function n2(e3) {
          r2 || (r2 = true, l.reject(t2, e3));
        }
        function i2(e3) {
          r2 || (r2 = true, l.resolve(t2, e3));
        }
        var s2 = p(function() {
          e2(i2, n2);
        });
        "error" === s2.status && n2(s2.value);
      }
      function p(e2, t2) {
        var r2 = {};
        try {
          r2.value = e2(t2), r2.status = "success";
        } catch (e3) {
          r2.status = "error", r2.value = e3;
        }
        return r2;
      }
      (t.exports = o).prototype.finally = function(t2) {
        if ("function" != typeof t2) return this;
        var r2 = this.constructor;
        return this.then(function(e2) {
          return r2.resolve(t2()).then(function() {
            return e2;
          });
        }, function(e2) {
          return r2.resolve(t2()).then(function() {
            throw e2;
          });
        });
      }, o.prototype.catch = function(e2) {
        return this.then(null, e2);
      }, o.prototype.then = function(e2, t2) {
        if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
        var r2 = new this.constructor(u);
        this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h2(r2, e2, t2));
        return r2;
      }, h2.prototype.callFulfilled = function(e2) {
        l.resolve(this.promise, e2);
      }, h2.prototype.otherCallFulfilled = function(e2) {
        f(this.promise, this.onFulfilled, e2);
      }, h2.prototype.callRejected = function(e2) {
        l.reject(this.promise, e2);
      }, h2.prototype.otherCallRejected = function(e2) {
        f(this.promise, this.onRejected, e2);
      }, l.resolve = function(e2, t2) {
        var r2 = p(c, t2);
        if ("error" === r2.status) return l.reject(e2, r2.value);
        var n2 = r2.value;
        if (n2) d(e2, n2);
        else {
          e2.state = a, e2.outcome = t2;
          for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
        }
        return e2;
      }, l.reject = function(e2, t2) {
        e2.state = s, e2.outcome = t2;
        for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
        return e2;
      }, o.resolve = function(e2) {
        if (e2 instanceof this) return e2;
        return l.resolve(new this(u), e2);
      }, o.reject = function(e2) {
        var t2 = new this(u);
        return l.reject(t2, e2);
      }, o.all = function(e2) {
        var r2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
        var n2 = e2.length, i2 = false;
        if (!n2) return this.resolve([]);
        var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
        for (; ++t2 < n2; ) h3(e2[t2], t2);
        return o2;
        function h3(e3, t3) {
          r2.resolve(e3).then(function(e4) {
            s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
          }, function(e4) {
            i2 || (i2 = true, l.reject(o2, e4));
          });
        }
      }, o.race = function(e2) {
        var t2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
        var r2 = e2.length, n2 = false;
        if (!r2) return this.resolve([]);
        var i2 = -1, s2 = new this(u);
        for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
          n2 || (n2 = true, l.resolve(s2, e3));
        }, function(e3) {
          n2 || (n2 = true, l.reject(s2, e3));
        });
        var a2;
        return s2;
      };
    }, { immediate: 36 }], 38: [function(e, t, r) {
      var n = {};
      (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
      var a = e("./zlib/deflate"), o = e("./utils/common"), h2 = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
      function p(e2) {
        if (!(this instanceof p)) return new p(e2);
        this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
        var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
        if (r2 !== l) throw new Error(i[r2]);
        if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
          var n2;
          if (n2 = "string" == typeof t2.dictionary ? h2.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
          this._dict_set = true;
        }
      }
      function n(e2, t2) {
        var r2 = new p(t2);
        if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
        return r2.result;
      }
      p.prototype.push = function(e2, t2) {
        var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
        if (this.ended) return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h2.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
        do {
          if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
          0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h2.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
        } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
        return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
      }, p.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, p.prototype.onEnd = function(e2) {
        e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, n(e2, t2);
      }, r.gzip = function(e2, t2) {
        return (t2 = t2 || {}).gzip = true, n(e2, t2);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
      var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
      function a(e2) {
        if (!(this instanceof a)) return new a(e2);
        this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
        var r2 = c.inflateInit2(this.strm, t2.windowBits);
        if (r2 !== m.Z_OK) throw new Error(n[r2]);
        this.header = new s(), c.inflateGetHeader(this.strm, this.header);
      }
      function o(e2, t2) {
        var r2 = new a(t2);
        if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
        return r2.result;
      }
      a.prototype.push = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h2 = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
        if (this.ended) return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h2.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h2.input = new Uint8Array(e2) : h2.input = e2, h2.next_in = 0, h2.avail_in = h2.input.length;
        do {
          if (0 === h2.avail_out && (h2.output = new d.Buf8(u), h2.next_out = 0, h2.avail_out = u), (r2 = c.inflate(h2, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
          h2.next_out && (0 !== h2.avail_out && r2 !== m.Z_STREAM_END && (0 !== h2.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h2.output, h2.next_out), s2 = h2.next_out - i2, a2 = p.buf2string(h2.output, i2), h2.next_out = s2, h2.avail_out = u - s2, s2 && d.arraySet(h2.output, h2.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h2.output, h2.next_out)))), 0 === h2.avail_in && 0 === h2.avail_out && (f = true);
        } while ((0 < h2.avail_in || 0 === h2.avail_out) && r2 !== m.Z_STREAM_END);
        return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h2.avail_out = 0));
      }, a.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, a.prototype.onEnd = function(e2) {
        e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, o(e2, t2);
      }, r.ungzip = o;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
      r.assign = function(e2) {
        for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
          var r2 = t2.shift();
          if (r2) {
            if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
            for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
          }
        }
        return e2;
      }, r.shrinkBuf = function(e2, t2) {
        return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
      };
      var i = { arraySet: function(e2, t2, r2, n2, i2) {
        if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
        else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        var t2, r2, n2, i2, s2, a;
        for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
        for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
        return a;
      } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
        for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        return [].concat.apply([], e2);
      } };
      r.setTyped = function(e2) {
        e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
      }, r.setTyped(n);
    }, {}], 42: [function(e, t, r) {
      var h2 = e("./common"), i = true, s = true;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch (e2) {
        i = false;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (e2) {
        s = false;
      }
      for (var u = new h2.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
      function l(e2, t2) {
        if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h2.shrinkBuf(e2, t2));
        for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
        return r2;
      }
      u[254] = u[254] = 1, r.string2buf = function(e2) {
        var t2, r2, n2, i2, s2, a = e2.length, o = 0;
        for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
        for (t2 = new h2.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
        return t2;
      }, r.buf2binstring = function(e2) {
        return l(e2, e2.length);
      }, r.binstring2buf = function(e2) {
        for (var t2 = new h2.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
        return t2;
      }, r.buf2string = function(e2, t2) {
        var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
        for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
        else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
        else {
          for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
          1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
        }
        return l(o, n2);
      }, r.utf8border = function(e2, t2) {
        var r2;
        for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
        return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
      };
    }, { "./common": 41 }], 43: [function(e, t, r) {
      t.exports = function(e2, t2, r2, n) {
        for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
          for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
          i %= 65521, s %= 65521;
        }
        return i | s << 16 | 0;
      };
    }, {}], 44: [function(e, t, r) {
      t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(e, t, r) {
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2, r2, n) {
        var i = o, s = n + r2;
        e2 ^= -1;
        for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
        return -1 ^ e2;
      };
    }, {}], 46: [function(e, t, r) {
      var h2, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I2 = 2, O = 3, B = 4;
      function R(e2, t2) {
        return e2.msg = n[t2], t2;
      }
      function T(e2) {
        return (e2 << 1) - (4 < e2 ? 9 : 0);
      }
      function D2(e2) {
        for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
      }
      function F2(e2) {
        var t2 = e2.state, r2 = t2.pending;
        r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
      }
      function N(e2, t2) {
        u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F2(e2.strm);
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = t2;
      }
      function P(e2, t2) {
        e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
      }
      function L(e2, t2) {
        var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h3 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
        e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
        do {
          if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
            s2 += 2, r2++;
            do {
            } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
            if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
              if (e2.match_start = t2, o2 <= (a2 = n2)) break;
              d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            }
          }
        } while ((t2 = f2[t2 & l2]) > h3 && 0 != --i2);
        return a2 <= e2.lookahead ? a2 : e2.lookahead;
      }
      function j(e2) {
        var t2, r2, n2, i2, s2, a2, o2, h3, u2, l2, f2 = e2.w_size;
        do {
          if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
            for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
            for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
            i2 += f2;
          }
          if (0 === e2.strm.avail_in) break;
          if (a2 = e2.strm, o2 = e2.window, h3 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h3), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h3) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h3)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
        } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
      }
      function Z(e2, t2) {
        for (var r2, n2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l) return A;
            if (0 === e2.lookahead) break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
            for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
            e2.strstart++;
          } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
          else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
          if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
        }
        return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I2;
      }
      function W(e2, t2) {
        for (var r2, n2, i2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l) return A;
            if (0 === e2.lookahead) break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
            for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
            if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
          } else if (e2.match_available) {
            if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
          } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
        }
        return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I2;
      }
      function M(e2, t2, r2, n2, i2) {
        this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
      }
      function H2() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D2(this.dyn_ltree), D2(this.dyn_dtree), D2(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D2(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D2(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function G2(e2) {
        var t2;
        return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
      }
      function K(e2) {
        var t2 = G2(e2);
        return t2 === m && function(e3) {
          e3.window_size = 2 * e3.w_size, D2(e3.head), e3.max_lazy_match = h2[e3.level].max_lazy, e3.good_match = h2[e3.level].good_length, e3.nice_match = h2[e3.level].nice_length, e3.max_chain_length = h2[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
        }(e2.state), t2;
      }
      function Y(e2, t2, r2, n2, i2, s2) {
        if (!e2) return _;
        var a2 = 1;
        if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
        8 === n2 && (n2 = 9);
        var o2 = new H2();
        return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
      }
      h2 = [new M(0, 0, 0, 0, function(e2, t2) {
        var r2 = 65535;
        for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
          if (e2.lookahead <= 1) {
            if (j(e2), 0 === e2.lookahead && t2 === l) return A;
            if (0 === e2.lookahead) break;
          }
          e2.strstart += e2.lookahead, e2.lookahead = 0;
          var n2 = e2.block_start + r2;
          if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
          if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
        }
        return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
      }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
        return Y(e2, t2, v, 15, 8, 0);
      }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G2, r.deflateSetHeader = function(e2, t2) {
        return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
      }, r.deflate = function(e2, t2) {
        var r2, n2, i2, s2;
        if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
        if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
        if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
        else {
          var a2 = v + (n2.w_bits - 8 << 4) << 8;
          a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
        }
        if (69 === n2.status) if (n2.gzhead.extra) {
          for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
          n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
        } else n2.status = 73;
        if (73 === n2.status) if (n2.gzhead.name) {
          i2 = n2.pending;
          do {
            if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
              s2 = 1;
              break;
            }
            s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
          } while (0 !== s2);
          n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
        } else n2.status = 91;
        if (91 === n2.status) if (n2.gzhead.comment) {
          i2 = n2.pending;
          do {
            if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
              s2 = 1;
              break;
            }
            s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
          } while (0 !== s2);
          n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
        } else n2.status = 103;
        if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F2(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
          if (F2(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
        } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f) return R(e2, -5);
        if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
        if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
          var o2 = 2 === n2.strategy ? function(e3, t3) {
            for (var r3; ; ) {
              if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                if (t3 === l) return A;
                break;
              }
              if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I2;
          }(n2, t2) : 3 === n2.strategy ? function(e3, t3) {
            for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
              if (e3.lookahead <= S) {
                if (j(e3), e3.lookahead <= S && t3 === l) return A;
                if (0 === e3.lookahead) break;
              }
              if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                s3 = e3.strstart + S;
                do {
                } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
              }
              if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I2;
          }(n2, t2) : h2[n2.level].func(n2, t2);
          if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
          if (o2 === I2 && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D2(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F2(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
        }
        return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F2(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
      }, r.deflateEnd = function(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
      }, r.deflateSetDictionary = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h3, u2, l2 = t2.length;
        if (!e2 || !e2.state) return _;
        if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
        for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D2(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h3 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
          for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
          r2.strstart = n2, r2.lookahead = x - 1, j(r2);
        }
        return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h3, e2.avail_in = a2, r2.wrap = s2, m;
      }, r.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
      t.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
      };
    }, {}], 48: [function(e, t, r) {
      t.exports = function(e2, t2) {
        var r2, n, i, s, a, o, h2, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
        r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h2 = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
        e: do {
          p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
          t: for (; ; ) {
            if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
            else {
              if (!(16 & y)) {
                if (0 == (64 & y)) {
                  v = m[(65535 & v) + (d & (1 << y) - 1)];
                  continue t;
                }
                if (32 & y) {
                  r2.mode = 12;
                  break e;
                }
                e2.msg = "invalid literal/length code", r2.mode = 30;
                break e;
              }
              w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
              r: for (; ; ) {
                if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                  if (0 == (64 & y)) {
                    v = _[(65535 & v) + (d & (1 << y) - 1)];
                    continue r;
                  }
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break e;
                }
                if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h2 < (k += d & (1 << y) - 1)) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break e;
                }
                if (d >>>= y, p -= y, (y = s - a) < k) {
                  if (l < (y = k - y) && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break e;
                  }
                  if (S = c, (x = 0) === f) {
                    if (x += u - y, y < w) {
                      for (w -= y; C[s++] = c[x++], --y; ) ;
                      x = s - k, S = C;
                    }
                  } else if (f < y) {
                    if (x += u + f - y, (y -= f) < w) {
                      for (w -= y; C[s++] = c[x++], --y; ) ;
                      if (x = 0, f < w) {
                        for (w -= y = f; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                    }
                  } else if (x += f - y, y < w) {
                    for (w -= y; C[s++] = c[x++], --y; ) ;
                    x = s - k, S = C;
                  }
                  for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                  w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                } else {
                  for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                  w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                }
                break;
              }
            }
            break;
          }
        } while (n < i && s < o);
        n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
      };
    }, {}], 49: [function(e, t, r) {
      var I2 = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D2 = 1, F2 = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
      function L(e2) {
        return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
      }
      function s() {
        this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I2.Buf16(320), this.work = new I2.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function a(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I2.Buf32(n), t2.distcode = t2.distdyn = new I2.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
      }
      function o(e2) {
        var t2;
        return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
      }
      function h2(e2, t2) {
        var r2, n2;
        return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
      }
      function u(e2, t2) {
        var r2, n2;
        return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h2(e2, t2)) !== N && (e2.state = null), r2) : U;
      }
      var l, f, c = true;
      function j(e2) {
        if (c) {
          var t2;
          for (l = new I2.Buf32(512), f = new I2.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
          for (; t2 < 256; ) e2.lens[t2++] = 9;
          for (; t2 < 280; ) e2.lens[t2++] = 7;
          for (; t2 < 288; ) e2.lens[t2++] = 8;
          for (T(D2, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
          T(F2, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
        }
        e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
      }
      function Z(e2, t2, r2, n2) {
        var i2, s2 = e2.state;
        return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I2.Buf8(s2.wsize)), n2 >= s2.wsize ? (I2.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I2.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I2.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
      }
      r.inflateReset = o, r.inflateReset2 = h2, r.inflateResetKeep = a, r.inflateInit = function(e2) {
        return u(e2, 15);
      }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h3, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I2.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
        12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h3 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h3, x = N;
        e: for (; ; ) switch (r2.mode) {
          case P:
            if (0 === r2.wrap) {
              r2.mode = 13;
              break;
            }
            for (; l2 < 16; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (2 & r2.wrap && 35615 === u2) {
              E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
              break;
            }
            if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
              e2.msg = "incorrect header check", r2.mode = 30;
              break;
            }
            if (8 != (15 & u2)) {
              e2.msg = "unknown compression method", r2.mode = 30;
              break;
            }
            if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
            else if (k > r2.wbits) {
              e2.msg = "invalid window size", r2.mode = 30;
              break;
            }
            r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
            break;
          case 2:
            for (; l2 < 16; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (r2.flags = u2, 8 != (255 & r2.flags)) {
              e2.msg = "unknown compression method", r2.mode = 30;
              break;
            }
            if (57344 & r2.flags) {
              e2.msg = "unknown header flags set", r2.mode = 30;
              break;
            }
            r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
          case 3:
            for (; l2 < 32; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
          case 4:
            for (; l2 < 16; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
          case 5:
            if (1024 & r2.flags) {
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
            } else r2.head && (r2.head.extra = null);
            r2.mode = 6;
          case 6:
            if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I2.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
            r2.length = 0, r2.mode = 7;
          case 7:
            if (2048 & r2.flags) {
              if (0 === o2) break e;
              for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
              if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
            } else r2.head && (r2.head.name = null);
            r2.length = 0, r2.mode = 8;
          case 8:
            if (4096 & r2.flags) {
              if (0 === o2) break e;
              for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
              if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
            } else r2.head && (r2.head.comment = null);
            r2.mode = 9;
          case 9:
            if (512 & r2.flags) {
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (u2 !== (65535 & r2.check)) {
                e2.msg = "header crc mismatch", r2.mode = 30;
                break;
              }
              l2 = u2 = 0;
            }
            r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
            break;
          case 10:
            for (; l2 < 32; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
          case 11:
            if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
            e2.adler = r2.check = 1, r2.mode = 12;
          case 12:
            if (5 === t2 || 6 === t2) break e;
          case 13:
            if (r2.last) {
              u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
              break;
            }
            for (; l2 < 3; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
              case 0:
                r2.mode = 14;
                break;
              case 1:
                if (j(r2), r2.mode = 20, 6 !== t2) break;
                u2 >>>= 2, l2 -= 2;
                break e;
              case 2:
                r2.mode = 17;
                break;
              case 3:
                e2.msg = "invalid block type", r2.mode = 30;
            }
            u2 >>>= 2, l2 -= 2;
            break;
          case 14:
            for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
              e2.msg = "invalid stored block lengths", r2.mode = 30;
              break;
            }
            if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
          case 15:
            r2.mode = 16;
          case 16:
            if (d = r2.length) {
              if (o2 < d && (d = o2), h3 < d && (d = h3), 0 === d) break e;
              I2.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h3 -= d, a2 += d, r2.length -= d;
              break;
            }
            r2.mode = 12;
            break;
          case 17:
            for (; l2 < 14; ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
              e2.msg = "too many length or distance symbols", r2.mode = 30;
              break;
            }
            r2.have = 0, r2.mode = 18;
          case 18:
            for (; r2.have < r2.ncode; ) {
              for (; l2 < 3; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
            }
            for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
            if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
              e2.msg = "invalid code lengths set", r2.mode = 30;
              break;
            }
            r2.have = 0, r2.mode = 19;
          case 19:
            for (; r2.have < r2.nlen + r2.ndist; ) {
              for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
              else {
                if (16 === b) {
                  for (z = _ + 2; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                    e2.msg = "invalid bit length repeat", r2.mode = 30;
                    break;
                  }
                  k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                } else if (17 === b) {
                  for (z = _ + 3; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                } else {
                  for (z = _ + 7; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                }
                if (r2.have + d > r2.nlen + r2.ndist) {
                  e2.msg = "invalid bit length repeat", r2.mode = 30;
                  break;
                }
                for (; d--; ) r2.lens[r2.have++] = k;
              }
            }
            if (30 === r2.mode) break;
            if (0 === r2.lens[256]) {
              e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
              break;
            }
            if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D2, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
              e2.msg = "invalid literal/lengths set", r2.mode = 30;
              break;
            }
            if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F2, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
              e2.msg = "invalid distances set", r2.mode = 30;
              break;
            }
            if (r2.mode = 20, 6 === t2) break e;
          case 20:
            r2.mode = 21;
          case 21:
            if (6 <= o2 && 258 <= h3) {
              e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h3 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
              break;
            }
            for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (g && 0 == (240 & g)) {
              for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              u2 >>>= v, l2 -= v, r2.back += v;
            }
            if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
              r2.mode = 26;
              break;
            }
            if (32 & g) {
              r2.back = -1, r2.mode = 12;
              break;
            }
            if (64 & g) {
              e2.msg = "invalid literal/length code", r2.mode = 30;
              break;
            }
            r2.extra = 15 & g, r2.mode = 22;
          case 22:
            if (r2.extra) {
              for (z = r2.extra; l2 < z; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
            }
            r2.was = r2.length, r2.mode = 23;
          case 23:
            for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
              if (0 === o2) break e;
              o2--, u2 += n2[s2++] << l2, l2 += 8;
            }
            if (0 == (240 & g)) {
              for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              u2 >>>= v, l2 -= v, r2.back += v;
            }
            if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
              e2.msg = "invalid distance code", r2.mode = 30;
              break;
            }
            r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
          case 24:
            if (r2.extra) {
              for (z = r2.extra; l2 < z; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
            }
            if (r2.offset > r2.dmax) {
              e2.msg = "invalid distance too far back", r2.mode = 30;
              break;
            }
            r2.mode = 25;
          case 25:
            if (0 === h3) break e;
            if (d = c2 - h3, r2.offset > d) {
              if ((d = r2.offset - d) > r2.whave && r2.sane) {
                e2.msg = "invalid distance too far back", r2.mode = 30;
                break;
              }
              p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
            } else m = i2, p = a2 - r2.offset, d = r2.length;
            for (h3 < d && (d = h3), h3 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
            0 === r2.length && (r2.mode = 21);
            break;
          case 26:
            if (0 === h3) break e;
            i2[a2++] = r2.length, h3--, r2.mode = 21;
            break;
          case 27:
            if (r2.wrap) {
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 |= n2[s2++] << l2, l2 += 8;
              }
              if (c2 -= h3, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h3, (r2.flags ? u2 : L(u2)) !== r2.check) {
                e2.msg = "incorrect data check", r2.mode = 30;
                break;
              }
              l2 = u2 = 0;
            }
            r2.mode = 28;
          case 28:
            if (r2.wrap && r2.flags) {
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (u2 !== (4294967295 & r2.total)) {
                e2.msg = "incorrect length check", r2.mode = 30;
                break;
              }
              l2 = u2 = 0;
            }
            r2.mode = 29;
          case 29:
            x = 1;
            break e;
          case 30:
            x = -3;
            break e;
          case 31:
            return -4;
          case 32:
          default:
            return U;
        }
        return e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
      }, r.inflateEnd = function(e2) {
        if (!e2 || !e2.state) return U;
        var t2 = e2.state;
        return t2.window && (t2.window = null), e2.state = null, N;
      }, r.inflateGetHeader = function(e2, t2) {
        var r2;
        return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
      }, r.inflateSetDictionary = function(e2, t2) {
        var r2, n2 = t2.length;
        return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
      }, r.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
      var D2 = e("../utils/common"), F2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      t.exports = function(e2, t2, r2, n, i, s, a, o) {
        var h2, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I2 = 0, O = new D2.Buf16(16), B = new D2.Buf16(16), R = null, T = 0;
        for (b = 0; b <= 15; b++) O[b] = 0;
        for (v = 0; v < n; v++) O[t2[r2 + v]]++;
        for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
        if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
        for (y = 1; y < w && 0 === O[y]; y++) ;
        for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
        if (0 < z && (0 === e2 || 1 !== w)) return -1;
        for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
        for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
        if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F2, I2 -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
        for (; ; ) {
          for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I2 + a[v]]) : (m = 96, 0), h2 = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h2)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
          for (h2 = 1 << b - 1; E & h2; ) h2 >>= 1;
          if (0 !== h2 ? (E &= h2 - 1, E += h2) : E = 0, v++, 0 == --O[b]) {
            if (b === w) break;
            b = t2[r2 + a[v]];
          }
          if (k < b && (E & f) !== l) {
            for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
            if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
            i[l = E & f] = k << 24 | x << 16 | c - s | 0;
          }
        }
        return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(e, t, r) {
      t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(e, t, r) {
      var i = e("../utils/common"), o = 0, h2 = 1;
      function n(e2) {
        for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
      }
      var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
      n(z);
      var C = new Array(2 * f);
      n(C);
      var E = new Array(512);
      n(E);
      var A = new Array(256);
      n(A);
      var I2 = new Array(a);
      n(I2);
      var O, B, R, T = new Array(f);
      function D2(e2, t2, r2, n2, i2) {
        this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
      }
      function F2(e2, t2) {
        this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
      }
      function N(e2) {
        return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
      }
      function P(e2, t2, r2) {
        e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
      }
      function L(e2, t2, r2) {
        P(e2, r2[2 * t2], r2[2 * t2 + 1]);
      }
      function j(e2, t2) {
        for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
        return r2 >>> 1;
      }
      function Z(e2, t2, r2) {
        var n2, i2, s2 = new Array(g + 1), a2 = 0;
        for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
        for (i2 = 0; i2 <= t2; i2++) {
          var o2 = e2[2 * i2 + 1];
          0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
        }
      }
      function W(e2) {
        var t2;
        for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
        for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
        for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
        e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
      }
      function M(e2) {
        8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
      }
      function H2(e2, t2, r2, n2) {
        var i2 = 2 * t2, s2 = 2 * r2;
        return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
      }
      function G2(e2, t2, r2) {
        for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H2(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H2(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
        e2.heap[r2] = n2;
      }
      function K(e2, t2, r2) {
        var n2, i2, s2, a2, o2 = 0;
        if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I2[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; ) ;
        L(e2, m, t2);
      }
      function Y(e2, t2) {
        var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h3 = t2.stat_desc.elems, u2 = -1;
        for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h3; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
        for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
        for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G2(e2, s2, r2);
        for (i2 = h3; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G2(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G2(e2, s2, 1), 2 <= e2.heap_len; ) ;
        e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t3) {
          var r3, n3, i3, s3, a3, o3, h4 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
          for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
          for (h4[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h4[2 * h4[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h4[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h4[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
          if (0 !== m2) {
            do {
              for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
              e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
            } while (0 < m2);
            for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h4[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h4[2 * i3 + 1]) * h4[2 * i3], h4[2 * i3 + 1] = s3), n3--);
          }
        }(e2, t2), Z(s2, u2, e2.bl_count);
      }
      function X(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h3 = 7, u2 = 4;
        for (0 === a2 && (h3 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h3 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h3 = 138, 3) : i2 === a2 ? (h3 = 6, 3) : (h3 = 7, 4));
      }
      function V(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h3 = 7, u2 = 4;
        for (0 === a2 && (h3 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h3 && i2 === a2)) {
          if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
          else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
          s2 = i2, u2 = (o2 = 0) === a2 ? (h3 = 138, 3) : i2 === a2 ? (h3 = 6, 3) : (h3 = 7, 4);
        }
      }
      n(T);
      var q = false;
      function J(e2, t2, r2, n2) {
        P(e2, (s << 1) + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          M(e3), U(e3, r3), U(e3, ~r3), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
        }(e2, t2, r2);
      }
      r._tr_init = function(e2) {
        q || (function() {
          var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
          for (n2 = r2 = 0; n2 < a - 1; n2++) for (I2[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
          for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E[i2++] = n2;
          for (i2 >>= 7; n2 < f; n2++) for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E[256 + i2++] = n2;
          for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
          for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
          for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
          for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
          O = new D2(z, w, u + 1, l, g), B = new D2(C, k, 0, f, g), R = new D2(new Array(0), x, 0, c, p);
        }(), q = true), e2.l_desc = new F2(e2.dyn_ltree, O), e2.d_desc = new F2(e2.dyn_dtree, B), e2.bl_desc = new F2(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
      }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
        var i2, s2, a2 = 0;
        0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = function(e3) {
          var t3, r3 = 4093624447;
          for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
          if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h2;
          for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h2;
          return o;
        }(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = function(e3) {
          var t3;
          for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
          return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
        }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          var i3;
          for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
          V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
        }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
      }, r._tr_tally = function(e2, t2, r2) {
        return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
      }, r._tr_align = function(e2) {
        P(e2, 2, 3), L(e2, m, z), function(e3) {
          16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
        }(e2);
      };
    }, { "../utils/common": 41 }], 53: [function(e, t, r) {
      t.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(e, t, r) {
      (function(e2) {
        !function(r2, n) {
          if (!r2.setImmediate) {
            var i, s, t2, a, o = 1, h2 = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
            e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
              process.nextTick(function() {
                c(e4);
              });
            } : function() {
              if (r2.postMessage && !r2.importScripts) {
                var e4 = true, t3 = r2.onmessage;
                return r2.onmessage = function() {
                  e4 = false;
                }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
              }
            }() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
              r2.postMessage(a + e4, "*");
            }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
              c(e4.data);
            }, function(e4) {
              t2.port2.postMessage(e4);
            }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
              var t3 = l.createElement("script");
              t3.onreadystatechange = function() {
                c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
              }, s.appendChild(t3);
            }) : function(e4) {
              setTimeout(c, 0, e4);
            }, e3.setImmediate = function(e4) {
              "function" != typeof e4 && (e4 = new Function("" + e4));
              for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
              var n2 = { callback: e4, args: t3 };
              return h2[o] = n2, i(o), o++;
            }, e3.clearImmediate = f;
          }
          function f(e4) {
            delete h2[e4];
          }
          function c(e4) {
            if (u) setTimeout(c, 0, e4);
            else {
              var t3 = h2[e4];
              if (t3) {
                u = true;
                try {
                  !function(e5) {
                    var t4 = e5.callback, r3 = e5.args;
                    switch (r3.length) {
                      case 0:
                        t4();
                        break;
                      case 1:
                        t4(r3[0]);
                        break;
                      case 2:
                        t4(r3[0], r3[1]);
                        break;
                      case 3:
                        t4(r3[0], r3[1], r3[2]);
                        break;
                      default:
                        t4.apply(n, r3);
                    }
                  }(t3);
                } finally {
                  f(e4), u = false;
                }
              }
            }
          }
          function d(e4) {
            e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
          }
        }("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(jszip_min);
var jszip_minExports = jszip_min.exports;
const JSZip = /* @__PURE__ */ getDefaultExportFromCjs(jszip_minExports);
var FileSaver_min = { exports: {} };
(function(module, exports) {
  (function(a, b) {
    b();
  })(commonjsGlobal, function() {
    function b(a2, b2) {
      return "undefined" == typeof b2 ? b2 = { autoBom: false } : "object" != typeof b2 && (console.warn("Deprecated: Expected third argument to be a object"), b2 = { autoBom: !b2 }), b2.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a2.type) ? new Blob(["\uFEFF", a2], { type: a2.type }) : a2;
    }
    function c(a2, b2, c2) {
      var d2 = new XMLHttpRequest();
      d2.open("GET", a2), d2.responseType = "blob", d2.onload = function() {
        g(d2.response, b2, c2);
      }, d2.onerror = function() {
        console.error("could not download file");
      }, d2.send();
    }
    function d(a2) {
      var b2 = new XMLHttpRequest();
      b2.open("HEAD", a2, false);
      try {
        b2.send();
      } catch (a3) {
      }
      return 200 <= b2.status && 299 >= b2.status;
    }
    function e(a2) {
      try {
        a2.dispatchEvent(new MouseEvent("click"));
      } catch (c2) {
        var b2 = document.createEvent("MouseEvents");
        b2.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null), a2.dispatchEvent(b2);
      }
    }
    var f = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof commonjsGlobal && commonjsGlobal.global === commonjsGlobal ? commonjsGlobal : void 0, a = f.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), g = f.saveAs || ("object" != typeof window || window !== f ? function() {
    } : "download" in HTMLAnchorElement.prototype && !a ? function(b2, g2, h2) {
      var i = f.URL || f.webkitURL, j = document.createElement("a");
      g2 = g2 || b2.name || "download", j.download = g2, j.rel = "noopener", "string" == typeof b2 ? (j.href = b2, j.origin === location.origin ? e(j) : d(j.href) ? c(b2, g2, h2) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b2), setTimeout(function() {
        i.revokeObjectURL(j.href);
      }, 4e4), setTimeout(function() {
        e(j);
      }, 0));
    } : "msSaveOrOpenBlob" in navigator ? function(f2, g2, h2) {
      if (g2 = g2 || f2.name || "download", "string" != typeof f2) navigator.msSaveOrOpenBlob(b(f2, h2), g2);
      else if (d(f2)) c(f2, g2, h2);
      else {
        var i = document.createElement("a");
        i.href = f2, i.target = "_blank", setTimeout(function() {
          e(i);
        });
      }
    } : function(b2, d2, e2, g2) {
      if (g2 = g2 || open("", "_blank"), g2 && (g2.document.title = g2.document.body.innerText = "downloading..."), "string" == typeof b2) return c(b2, d2, e2);
      var h2 = "application/octet-stream" === b2.type, i = /constructor/i.test(f.HTMLElement) || f.safari, j = /CriOS\/[\d]+/.test(navigator.userAgent);
      if ((j || h2 && i || a) && "undefined" != typeof FileReader) {
        var k = new FileReader();
        k.onloadend = function() {
          var a2 = k.result;
          a2 = j ? a2 : a2.replace(/^data:[^;]*;/, "data:attachment/file;"), g2 ? g2.location.href = a2 : location = a2, g2 = null;
        }, k.readAsDataURL(b2);
      } else {
        var l = f.URL || f.webkitURL, m = l.createObjectURL(b2);
        g2 ? g2.location = m : location.href = m, g2 = null, setTimeout(function() {
          l.revokeObjectURL(m);
        }, 4e4);
      }
    });
    f.saveAs = g.saveAs = g, module.exports = g;
  });
})(FileSaver_min);
var FileSaver_minExports = FileSaver_min.exports;
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "DataManager",
  props: {
    dataStore: {},
    extraStore: {},
    dataType: {}
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const dataStore = props.dataStore;
    const extraStore = props.extraStore;
    const importInput = ref(null);
    const { notify } = useNotifier();
    const triggerImport = () => {
      var _a2;
      (_a2 = importInput.value) == null ? void 0 : _a2.click();
    };
    const selectionCheck = async () => {
      const unselectedDataIds = [];
      dataStore.allData.forEach((data) => {
        if (!extraStore.hasSelection(data.id)) {
          unselectedDataIds.push(data.id);
        }
      });
      if (unselectedDataIds.length > 0) {
        const confirmed = await notify("export-confirm");
        if (!confirmed) {
          notify("cancel");
          return false;
        }
        unselectedDataIds.forEach((id) => {
          const data = dataStore.allData.find((d) => d.id === id);
          if (data && extraStore.$id === "zoomer" && props.dataType === "image") {
            const imageData = data;
            const rect = randomSelection(
              imageData.displayWidth,
              imageData.displayHeight
            );
            extraStore.setRect(id, rect);
          }
        });
      }
      return true;
    };
    const handleExport = async () => {
      if (extraStore.$id === "zoomer") {
        const conti = await selectionCheck();
        if (!!!conti) return;
      }
      try {
        const zip = new JSZip();
        const extraData = extraStore.contexts;
        const header = {
          version: "1.0.0",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          mode: extraStore.$id,
          dataType: props.dataType,
          appName: "quiz-display-tool"
        };
        let allDataSerialized;
        if (props.dataType === "image") {
          allDataSerialized = dataStore.allData.map((d) => ({
            id: d.id,
            name: d.name,
            naturalWidth: d.naturalWidth,
            naturalHeight: d.naturalHeight,
            displayWidth: d.displayWidth,
            displayHeight: d.displayHeight
          }));
        } else {
          allDataSerialized = dataStore.allData.map((d) => ({
            id: d.id,
            name: d.name,
            content: d.content
          }));
        }
        const sessionData = {
          header,
          dataStore: {
            allData: allDataSerialized,
            currentIndex: dataStore.currentIndex
          },
          extraStore: extraData
        };
        zip.file("session.json", JSON.stringify(sessionData, null, 2));
        if (props.dataType === "image") {
          const imageFolder = zip.folder("images");
          dataStore.allData.forEach((data) => {
            if (data.image) {
              imageFolder.file(data.name, data.image);
            }
          });
        } else {
          const textFolder = zip.folder("texts");
          dataStore.allData.forEach((data) => {
            if (data.content) {
              textFolder.file(data.name, data.content);
            }
          });
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        FileSaver_minExports.saveAs(zipBlob, `session_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`);
        notify("exported");
      } catch (e) {
        notify("error");
      }
    };
    const importImageData = async (zip, sessionData) => {
      const imageFiles = zip.folder("images");
      if (!imageFiles) throw new Error("images folder not found");
      const newImageData = await Promise.all(
        sessionData.dataStore.allData.map(async (item) => {
          const imageFile = imageFiles.file(item.name);
          if (!imageFile) return null;
          const blob = await imageFile.async("blob");
          const file = new File([blob], item.name, { type: blob.type });
          return await loadImageFile(file);
        })
      );
      const validImageData = newImageData.filter(Boolean);
      return validImageData;
    };
    const importTextData = async (zip, sessionData) => {
      const textFiles = zip.folder("texts");
      if (!textFiles) throw new Error("texts folder not found");
      const { getTextPreview } = await __vitePreload(async () => {
        const { getTextPreview: getTextPreview2 } = await import("./useTextLoader-DnyA7q0G.js");
        return { getTextPreview: getTextPreview2 };
      }, true ? [] : void 0);
      const newTextData = [];
      for (const item of sessionData.dataStore.allData) {
        const textFile = textFiles.file(item.name);
        if (!textFile) continue;
        const content = await textFile.async("string");
        newTextData.push({
          id: item.id,
          name: item.name,
          content,
          thumbnailSrc: getTextPreview(content)
        });
      }
      return newTextData;
    };
    const handleImport = (event) => {
      var _a2;
      const file = (_a2 = event.target.files) == null ? void 0 : _a2[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        var _a3;
        try {
          const zip = await JSZip.loadAsync((_a3 = e.target) == null ? void 0 : _a3.result);
          const sessionFile = zip.file("session.json");
          if (!sessionFile) throw new Error("session.json not found in zip");
          const sessionData = JSON.parse(await sessionFile.async("string"));
          const header = sessionData.header;
          const importedMode = header.mode;
          const importedDataType = header.dataType || "image";
          const currentMode = extraStore.$id;
          if (importedMode !== currentMode || importedDataType !== props.dataType) {
            notify("mode-mismatch");
            return;
          }
          if (sessionData.dataStore) {
            dataStore.allData.forEach((data) => {
              if (data.thumbnailSrc && data.thumbnailSrc.startsWith("blob:")) {
                URL.revokeObjectURL(data.thumbnailSrc);
              }
            });
            const newData = props.dataType === "image" ? await importImageData(zip, sessionData) : await importTextData(zip, sessionData);
            dataStore.importData({
              allData: newData,
              currentIndex: sessionData.dataStore.currentIndex
            });
            extraStore.importData({ contexts: sessionData.extraStore });
            notify("imported");
          }
        } catch (error) {
          notify("error");
        }
      };
      reader.readAsArrayBuffer(file);
      if (importInput.value) {
        importInput.value.value = "";
      }
    };
    __expose({
      triggerImport,
      handleExport
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("input", {
        ref_key: "importInput",
        ref: importInput,
        type: "file",
        accept: ".zip",
        style: { "display": "none" },
        onChange: handleImport
      }, null, 544);
    };
  }
});
const _hoisted_1$6 = { class: "data-sidebar-ep" };
const _hoisted_2$6 = { class: "sidebar-header" };
const _hoisted_3$5 = { class: "thumbnail-ep add-file-thumbnail" };
const _hoisted_4$4 = { class: "filename" };
const _hoisted_5$3 = ["onClick"];
const _hoisted_6$2 = { class: "thumbnail-slot-error" };
const _hoisted_7$2 = {
  key: 1,
  class: "thumbnail-ep text-thumbnail"
};
const _hoisted_8$1 = { class: "filename" };
const _hoisted_9$1 = { class: "thumbnail-ep add-file-thumbnail" };
const _hoisted_10 = { class: "filename" };
const _hoisted_11 = {
  key: 3,
  class: "empty-state"
};
const _hoisted_12 = { class: "sidebar-footer" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "DataSidebar",
  props: {
    currentId: {},
    dataStore: {},
    extraStore: {},
    dataType: {}
  },
  emits: ["select-data", "add-file"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const router2 = useRouter();
    const props = __props;
    const emit = __emit;
    const dataStore = props.dataStore;
    const allData = computed(() => dataStore.allData);
    const extraStore = props.extraStore;
    const showThumbnails = ref(true);
    const dataManagerRef = ref(null);
    const dataList = computed({
      get: () => allData.value,
      set: (newOrder) => {
        dataStore.updateOrder(newOrder);
      }
    });
    const selectData = (id) => {
      emit("select-data", id);
    };
    const handleDelete = (id) => {
      dataStore.removeData(id);
      extraStore.removeContext(id);
    };
    const handleImport = () => {
      var _a2;
      (_a2 = dataManagerRef.value) == null ? void 0 : _a2.triggerImport();
    };
    const handleExport = () => {
      var _a2;
      (_a2 = dataManagerRef.value) == null ? void 0 : _a2.handleExport();
    };
    const handleGoHome = () => {
      router2.push("/");
    };
    return (_ctx, _cache) => {
      const _component_el_switch = ElSwitch;
      const _component_el_tooltip = ElTooltip;
      const _component_el_image = ElImage;
      const _component_el_scrollbar = ElScrollbar;
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        createBaseVNode("div", _hoisted_2$6, [
          _cache[4] || (_cache[4] = createBaseVNode("h4", { class: "sidebar-title" }, null, -1)),
          createVNode(_component_el_tooltip, {
            content: showThumbnails.value ? unref(t)("sidebar.hideThumbnails") : unref(t)("sidebar.showThumbnails"),
            placement: "bottom"
          }, {
            default: withCtx(() => [
              createVNode(_component_el_switch, {
                modelValue: showThumbnails.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showThumbnails.value = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }, 8, ["content"])
        ]),
        createVNode(_component_el_scrollbar, null, {
          default: withCtx(() => [
            dataList.value.length === 0 ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "list-item-ep add-file-item",
              onClick: _cache[1] || (_cache[1] = ($event) => emit("add-file"))
            }, [
              createBaseVNode("div", _hoisted_3$5, [
                createVNode(Icon, {
                  name: "PhPlus",
                  size: "24"
                })
              ]),
              createBaseVNode("span", _hoisted_4$4, toDisplayString$1(unref(t)("sidebar.addItem")), 1)
            ])) : createCommentVNode("", true),
            dataList.value.length > 0 ? (openBlock(), createBlock(unref(vuedraggable), {
              key: 1,
              modelValue: dataList.value,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dataList.value = $event),
              "item-key": "id",
              class: "draggable-list",
              "ghost-class": "ghost",
              tag: "div"
            }, {
              item: withCtx(({ element }) => {
                var _a2, _b;
                return [
                  createBaseVNode("div", {
                    class: normalizeClass(["list-item-ep", {
                      "is-active": element.id === _ctx.currentId,
                      "not-selected": !(((_b = (_a2 = unref(extraStore)) == null ? void 0 : _a2.hasSelection) == null ? void 0 : _b.call(_a2, element.id)) ?? true)
                    }]),
                    onClick: ($event) => selectData(element.id)
                  }, [
                    _ctx.dataType === "image" ? (openBlock(), createBlock(_component_el_image, {
                      key: 0,
                      src: showThumbnails.value ? element.thumbnailSrc : "",
                      fit: "cover",
                      class: "thumbnail-ep"
                    }, {
                      error: withCtx(() => [
                        createBaseVNode("div", _hoisted_6$2, [
                          createVNode(Icon, { name: "PhImage" })
                        ])
                      ]),
                      _: 2
                    }, 1032, ["src"])) : (openBlock(), createElementBlock("div", _hoisted_7$2, toDisplayString$1(showThumbnails.value ? element.thumbnailSrc : ""), 1)),
                    createBaseVNode("span", _hoisted_8$1, toDisplayString$1(showThumbnails.value ? element.name : unref(dataStore).getIndexById(element.id) + 1), 1),
                    createVNode(Button, {
                      type: "danger",
                      size: "small",
                      circle: "",
                      plain: "",
                      class: "delete-btn",
                      icon: "PhTrash",
                      "icon-size": "16",
                      title: unref(t)("sidebar.delete"),
                      onClick: withModifiers(($event) => handleDelete(element.id), ["stop"])
                    }, null, 8, ["title", "onClick"])
                  ], 10, _hoisted_5$3)
                ];
              }),
              _: 1
            }, 8, ["modelValue"])) : createCommentVNode("", true),
            dataList.value.length > 0 ? (openBlock(), createElementBlock("div", {
              key: 2,
              class: "list-item-ep add-file-item",
              onClick: _cache[3] || (_cache[3] = ($event) => emit("add-file"))
            }, [
              createBaseVNode("div", _hoisted_9$1, [
                createVNode(Icon, {
                  name: "PhPlus",
                  size: "24"
                })
              ]),
              createBaseVNode("span", _hoisted_10, toDisplayString$1(unref(t)("sidebar.addItem")), 1)
            ])) : createCommentVNode("", true),
            dataList.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_11, [
              createVNode(Button, {
                type: "primary",
                icon: "PhBoxArrowUp",
                title: unref(t)("sidebar.import"),
                onClick: handleImport
              }, null, 8, ["title"])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_12, [
          createVNode(Button, {
            icon: "PhHouse",
            title: unref(t)("sidebar.home"),
            onClick: handleGoHome
          }, null, 8, ["title"]),
          dataList.value.length > 0 ? (openBlock(), createBlock(Button, {
            key: 0,
            icon: "PhBoxArrowDown",
            title: unref(t)("sidebar.export"),
            onClick: handleExport
          }, null, 8, ["title"])) : createCommentVNode("", true)
        ]),
        createVNode(_sfc_main$7, {
          ref_key: "dataManagerRef",
          ref: dataManagerRef,
          dataStore: unref(dataStore),
          extraStore: props.extraStore,
          dataType: props.dataType
        }, null, 8, ["dataStore", "extraStore", "dataType"])
      ]);
    };
  }
});
const DataSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-0b832f6c"]]);
const _hoisted_1$5 = { class: "manager-top-bar" };
const _hoisted_2$5 = { class: "top-bar-section file-utils" };
const _hoisted_3$4 = { class: "display-area" };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ManagerLayout",
  props: {
    canGoPrev: { type: Boolean, default: false },
    canGoNext: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ["go-prev", "go-next"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { t } = useI18n();
    const isSidebarVisible = ref(false);
    const toggleSidebar = () => {
      isSidebarVisible.value = !isSidebarVisible.value;
    };
    return (_ctx, _cache) => {
      const _component_el_button_group = ElButtonGroup;
      const _component_el_divider = ElDivider;
      const _component_el_main = ElMain;
      const _component_el_container = ElContainer;
      const _component_el_drawer = ElDrawer;
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_component_el_container, { class: "manager-layout" }, {
          default: withCtx(() => [
            createVNode(_component_el_main, { class: "manager-main" }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_1$5, [
                  createBaseVNode("div", _hoisted_2$5, [
                    createVNode(Button, {
                      onClick: toggleSidebar,
                      disabled: _ctx.disabled,
                      icon: "PhSidebarSimple",
                      title: unref(t)("sidebar.openSidebar")
                    }, null, 8, ["disabled", "title"]),
                    renderSlot(_ctx.$slots, "file-input", {}, void 0, true),
                    createVNode(_component_el_button_group, null, {
                      default: withCtx(() => [
                        createVNode(Button, {
                          onClick: _cache[0] || (_cache[0] = ($event) => emit("go-prev")),
                          disabled: !_ctx.canGoPrev,
                          icon: "PhArrowLeft",
                          title: unref(t)("topbar.previous")
                        }, null, 8, ["disabled", "title"]),
                        createVNode(Button, {
                          onClick: _cache[1] || (_cache[1] = ($event) => emit("go-next")),
                          disabled: !_ctx.canGoNext,
                          icon: "PhArrowRight",
                          title: unref(t)("topbar.next")
                        }, null, 8, ["disabled", "title"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_el_divider, { direction: "vertical" }),
                  renderSlot(_ctx.$slots, "common-utils", {}, void 0, true),
                  createVNode(_component_el_divider, { direction: "vertical" }),
                  renderSlot(_ctx.$slots, "auto-play-controls", {}, void 0, true),
                  _ctx.$slots["mode-toggle"] ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createVNode(_component_el_divider, { direction: "vertical" }),
                    renderSlot(_ctx.$slots, "mode-toggle", {}, void 0, true)
                  ], 64)) : createCommentVNode("", true)
                ]),
                createBaseVNode("div", _hoisted_3$4, [
                  renderSlot(_ctx.$slots, "display", {}, void 0, true)
                ])
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        renderSlot(_ctx.$slots, "floating-button", {}, void 0, true),
        createVNode(_component_el_drawer, {
          modelValue: isSidebarVisible.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isSidebarVisible.value = $event),
          direction: "ltr",
          size: "280px",
          "with-header": false
        }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "sidebar", {}, void 0, true)
          ]),
          _: 3
        }, 8, ["modelValue"])
      ], 64);
    };
  }
});
const ManagerLayout = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-5fd3b433"]]);
const _hoisted_1$4 = { class: "top-bar-section common-utils" };
const _hoisted_2$4 = { class: "top-bar-section auto-play" };
const _hoisted_3$3 = { class: "duration-control" };
const _hoisted_4$3 = { class: "top-bar-section mode-toggle" };
const _hoisted_5$2 = { class: "floating-play-button" };
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ZoomerManager",
  setup(__props) {
    const imageStore = useImageStore();
    const zoomStore = useZoomerStore();
    const { t } = useI18n();
    const {
      fileInput,
      currentId,
      canGoPrev,
      canGoNext,
      isZooming,
      isPaused,
      triggerFileInput,
      onFileChange: baseOnFileChange,
      handleDataSelect,
      goToPrev,
      goToNext
    } = useManagerBase({
      dataStore: imageStore,
      extraStore: zoomStore,
      dataType: "image",
      fileAccept: "image/*",
      loadFile: loadImageFile,
      onFileAdded: (id, status) => {
        if (status === "added") {
          zoomStore.setContext(id, {
            duration: duration.value,
            selection: { x: 0, y: 0, w: 0, h: 0 }
          });
        }
      }
    });
    const zoomer = ref(null);
    const duration = ref(3e4);
    const displayMode = ref("full");
    const hasSelection = computed(() => zoomStore.hasSelection(currentId.value));
    const durationSec = computed({
      get: () => Math.round(duration.value / 1e3),
      set: (v) => {
        duration.value = v * 1e3;
        if (currentId.value) {
          zoomStore.setContext(currentId.value, {
            duration: duration.value,
            selection: zoomStore.getContext(currentId.value).selection
          });
        }
      }
    });
    const displayModes = [
      {
        value: "full",
        icon: "PhImage",
        currentLabel: t("zoomer.showFullImage"),
        nextLabel: t("zoomer.switchToShowSelectedArea")
      },
      {
        value: "selection",
        icon: "PhCrop",
        currentLabel: t("zoomer.showSelectedArea"),
        nextLabel: t("zoomer.switchToHideImage")
      },
      {
        value: "none",
        icon: "PhEyeSlash",
        currentLabel: t("zoomer.hideImage"),
        nextLabel: t("zoomer.switchToShowFullImage")
      }
    ];
    const currentDisplayMode = computed(() => {
      const current = displayModes.find((m) => m.value === displayMode.value);
      return {
        icon: (current == null ? void 0 : current.icon) || "PhImage",
        tooltip: (current == null ? void 0 : current.nextLabel) || t("zoomer.switchToShowSelectedArea")
      };
    });
    const handleZoomControl = () => {
      var _a2, _b, _c;
      if (!isZooming.value) {
        (_a2 = zoomer.value) == null ? void 0 : _a2.startZoomOut();
      } else {
        if (isPaused.value) (_b = zoomer.value) == null ? void 0 : _b.resumeZoomOut();
        else (_c = zoomer.value) == null ? void 0 : _c.pauseZoomOut();
      }
    };
    const handleShowFullImage = () => {
      var _a2;
      return (_a2 = zoomer.value) == null ? void 0 : _a2.showFullImage();
    };
    const cycleDisplayMode = () => {
      const idx = displayModes.findIndex((m) => m.value === displayMode.value);
      displayMode.value = displayModes[(idx + 1) % displayModes.length].value;
    };
    watch(currentId, (id) => {
      if (id) {
        const ctx = zoomStore.getContext(id);
        if (ctx && typeof ctx.duration === "number") {
          duration.value = ctx.duration;
        }
      }
    });
    onMounted(() => {
      const images = imageStore.getAllData();
      if (images.length > 0) {
        images.forEach((image) => {
          if (!zoomStore.hasContext(image.id)) {
            zoomStore.setContext(image.id, {
              duration: duration.value,
              selection: { x: 0, y: 0, w: 0, h: 0 }
            });
          }
        });
      }
    });
    return (_ctx, _cache) => {
      const _component_el_slider = ElSlider;
      const _component_el_input_number = ElInputNumber;
      return openBlock(), createBlock(ManagerLayout, {
        "can-go-prev": unref(canGoPrev),
        "can-go-next": unref(canGoNext),
        disabled: unref(isZooming),
        onGoPrev: unref(goToPrev),
        onGoNext: unref(goToNext)
      }, {
        "file-input": withCtx(() => [
          createBaseVNode("input", {
            ref_key: "fileInput",
            ref: fileInput,
            type: "file",
            accept: "image/*",
            onChange: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => unref(baseOnFileChange) && unref(baseOnFileChange)(...args)),
            style: { "display": "none" }
          }, null, 544)
        ]),
        "common-utils": withCtx(() => [
          createBaseVNode("div", _hoisted_1$4, [
            createVNode(Button, {
              onClick: handleShowFullImage,
              disabled: !unref(currentId) || !unref(isZooming),
              icon: "PhCornersOut",
              title: unref(t)("topbar.showAll")
            }, null, 8, ["disabled", "title"])
          ])
        ]),
        "auto-play-controls": withCtx(() => [
          createBaseVNode("div", _hoisted_2$4, [
            createBaseVNode("div", _hoisted_3$3, [
              createVNode(_component_el_slider, {
                modelValue: durationSec.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => durationSec.value = $event),
                min: 1,
                max: 50,
                step: 1,
                style: { "width": "120px" },
                disabled: unref(isZooming),
                "show-tooltip": false
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_el_input_number, {
                modelValue: durationSec.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => durationSec.value = $event),
                min: 1,
                max: 50,
                step: 1,
                size: "small",
                disabled: unref(isZooming)
              }, null, 8, ["modelValue", "disabled"])
            ])
          ])
        ]),
        "mode-toggle": withCtx(() => [
          createBaseVNode("div", _hoisted_4$3, [
            createVNode(Button, {
              icon: currentDisplayMode.value.icon,
              title: currentDisplayMode.value.tooltip,
              tooltipPlacement: "left",
              onClick: cycleDisplayMode,
              disabled: unref(isZooming)
            }, null, 8, ["icon", "title", "disabled"])
          ])
        ]),
        display: withCtx(() => [
          createVNode(_sfc_main$8, {
            ref_key: "zoomer",
            ref: zoomer,
            id: unref(currentId),
            displayMode: displayMode.value
          }, null, 8, ["id", "displayMode"])
        ]),
        "floating-button": withCtx(() => [
          createBaseVNode("div", _hoisted_5$2, [
            createVNode(Button, {
              onClick: handleZoomControl,
              icon: unref(isZooming) && !unref(isPaused) ? "PhPause" : "PhPlay",
              title: unref(isZooming) && !unref(isPaused) ? unref(t)("topbar.pause") : unref(t)("topbar.play"),
              "icon-size": 28,
              disabled: !hasSelection.value,
              size: "large",
              circle: ""
            }, null, 8, ["icon", "title", "disabled"])
          ])
        ]),
        sidebar: withCtx(() => [
          createVNode(DataSidebar, {
            "current-id": unref(currentId),
            "data-store": unref(imageStore),
            "extra-store": unref(zoomStore),
            "data-type": "image",
            onSelectData: unref(handleDataSelect),
            onAddFile: unref(triggerFileInput)
          }, null, 8, ["current-id", "data-store", "extra-store", "onSelectData", "onAddFile"])
        ]),
        _: 1
      }, 8, ["can-go-prev", "can-go-next", "disabled", "onGoPrev", "onGoNext"]);
    };
  }
});
const usePanelStore = defineStore("panel", {
  state: () => ({
    contexts: {},
    isPaused: false,
    isAutoRevealing: false
  }),
  actions: {
    /**
     * Get panel context by id
     */
    getContext(id) {
      return id ? this.contexts[id] || null : null;
    },
    /**
     * Set panel context
     */
    setContext(id, context) {
      this.contexts[id] = context;
    },
    /**
     * Set panel grid dimensions
     */
    setAmount(id, amount) {
      if (this.contexts[id]) {
        this.contexts[id].amount = amount;
      }
    },
    /**
     * Check if panel has grid dimensions set
     */
    hasSelection(id) {
      const context = this.getContext(id);
      return context ? !!(context.amount.x && context.amount.y) : false;
    },
    /**
     * Check if panel context exists
     */
    hasContext(id) {
      return !!this.contexts[id];
    },
    /**
     * Remove panel context
     */
    removeContext(id) {
      if (this.contexts[id]) {
        delete this.contexts[id];
        return true;
      }
      return false;
    },
    /**
     * Set reveal animation pause state
     */
    setPaused(paused) {
      this.isPaused = paused;
    },
    /**
     * Set reveal animation active state
     */
    setRevealing(revealing) {
      this.isAutoRevealing = revealing;
    },
    /**
     * Import panel contexts data
     */
    importData(data) {
      this.contexts = data.contexts;
    },
    /**
     * Check if more panels can be revealed
     */
    canReveal(context) {
      if (!context) return false;
      const totalPanels = context.amount.x * context.amount.y;
      const revealedCount = context.revealed.length;
      return revealedCount < totalPanels;
    },
    /**
     * Set the reveal order for a panel
     */
    setOrder(id, order) {
      if (this.contexts[id]) {
        this.contexts[id].order = order;
      }
    },
    /**
     * Add a panel to the revealed list
     */
    addRevealedPanel(id, panel) {
      if (this.contexts[id]) {
        this.contexts[id].revealed.push(panel);
      }
    },
    /**
     * Clear all revealed panels for a specific panel context
     */
    clearRevealedPanels(id) {
      if (this.contexts[id]) {
        this.contexts[id].revealed = [];
      }
    }
  }
});
function generateRevealOrder(mode, amount) {
  const { x: cols, y: rows } = amount;
  if (mode.startsWith("spiral")) {
    const parts = mode.split("-");
    const startPoint = parts[1];
    const direction = parts[2];
    return generateSpiralCoords(rows, cols, { startPoint, direction });
  }
  const allCoords = Array.from({ length: rows }).flatMap(
    (_, j) => Array.from({ length: cols }, (_2, i) => [i, j])
  );
  if (mode.startsWith("linear")) {
    const toMatch = mode.replace("linear-", "");
    switch (toMatch) {
      case "Right-Down":
        return allCoords.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
      case "Right-Up":
        return allCoords.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
      case "Left-Down":
        return allCoords.sort((a, b) => a[1] - b[1] || b[0] - a[0]);
      case "Left-Up":
        return allCoords.sort((a, b) => b[1] - a[1] || b[0] - a[0]);
      case "Down-Right":
        return allCoords.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      case "Down-Left":
        return allCoords.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
      case "Up-Right":
        return allCoords.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
      case "Up-Left":
        return allCoords.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    }
  }
  return shuffleArray(allCoords);
}
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function generateSpiralCoords(rows, cols, options = {}) {
  const { startPoint = "topLeft", direction = "clockwise" } = options;
  if (rows === 0 || cols === 0) return [];
  const result = [];
  const total = rows * cols;
  if (startPoint === "center") {
    let x = Math.floor((cols - 1) / 2);
    let y = Math.floor((rows - 1) / 2);
    result.push([x, y]);
    const dirs = direction === "clockwise" ? [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ] : [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1]
    ];
    let step = 1;
    let dirIndex = 0;
    while (result.length < total) {
      for (let i = 0; i < 2; i++) {
        for (let s = 0; s < step; s++) {
          if (result.length >= total) break;
          x += dirs[dirIndex][0];
          y += dirs[dirIndex][1];
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            result.push([x, y]);
          }
        }
        if (result.length >= total) break;
        dirIndex = (dirIndex + 1) % 4;
      }
      step++;
    }
    return result;
  }
  let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
  const traverseRight = () => {
    for (let i = left; i <= right; i++) result.push([i, top]);
    top++;
  };
  const traverseDown = () => {
    for (let j = top; j <= bottom; j++) result.push([right, j]);
    right--;
  };
  const traverseLeft = () => {
    for (let i = right; i >= left; i--) result.push([i, bottom]);
    bottom--;
  };
  const traverseUp = () => {
    for (let j = bottom; j >= top; j--) result.push([left, j]);
    left++;
  };
  let movePlan = [];
  if (direction === "clockwise") {
    switch (startPoint) {
      case "topLeft":
        movePlan = [traverseRight, traverseDown, traverseLeft, traverseUp];
        break;
      case "topRight":
        movePlan = [traverseDown, traverseLeft, traverseUp, traverseRight];
        break;
      case "bottomRight":
        movePlan = [traverseLeft, traverseUp, traverseRight, traverseDown];
        break;
      case "bottomLeft":
        movePlan = [traverseUp, traverseRight, traverseDown, traverseLeft];
        break;
    }
  } else {
    switch (startPoint) {
      case "topLeft":
        movePlan = [traverseDown, traverseRight, traverseUp, traverseLeft];
        break;
      case "topRight":
        movePlan = [traverseUp, traverseLeft, traverseDown, traverseRight];
        break;
      case "bottomRight":
        movePlan = [traverseLeft, traverseDown, traverseRight, traverseUp];
        break;
      case "bottomLeft":
        movePlan = [traverseRight, traverseUp, traverseLeft, traverseDown];
        break;
    }
  }
  let planIndex = 0;
  while (result.length < total) {
    movePlan[planIndex % 4]();
    planIndex++;
  }
  return result;
}
function getMainRevealModes() {
  const { t } = useI18n();
  return [
    { value: "random", label: t("mode.random"), icon: "PhShuffleSimple" },
    { value: "linear", label: t("mode.linear"), icon: "PhArrowsLeftRight" },
    { value: "spiral", label: t("mode.spiral"), icon: "PhArrowsClockwise" }
  ];
}
function getSpiralSubModes() {
  const { t } = useI18n();
  const startPoints = [
    "topLeft",
    "topRight",
    "bottomRight",
    "bottomLeft",
    "center"
  ];
  const directions = ["clockwise", "counterClockwise"];
  const subModes = [];
  for (const sp of startPoints) {
    for (const dir of directions) {
      subModes.push({
        value: `${sp}-${dir}`,
        label: `${t(`mode.position.${sp}`)}`,
        icon: dir === "clockwise" ? "PhArrowClockwise" : "PhArrowCounterClockwise"
      });
    }
  }
  return subModes;
}
function getLinearSubModes() {
  const { t } = useI18n();
  const verticals = ["Right", "Left"];
  const horizontals = ["Down", "Up"];
  const subModes = [];
  for (const hor of horizontals) {
    for (const ver of verticals) {
      subModes.push({
        value: `${ver}-${hor}`,
        label: `${t(`mode.direction.${ver.toLowerCase()}`)} - ${t(
          `mode.direction.${hor.toLowerCase()}`
        )}`,
        icon: `PhArrowElbow${ver}${hor}`
      });
      subModes.push({
        value: `${hor}-${ver}`,
        label: `${t(`mode.direction.${hor.toLowerCase()}`)} - ${t(
          `mode.direction.${ver.toLowerCase()}`
        )}`,
        icon: `PhArrowElbow${hor}${ver}`
      });
    }
  }
  return subModes;
}
function getDistributedSizes(totalLength, numDivisions) {
  if (numDivisions <= 0) return [];
  const baseSize = Math.floor(totalLength / numDivisions);
  const remainder = totalLength % numDivisions;
  const sizes = [];
  let numPlaced = 0;
  for (let i = 0; i < numDivisions; i++) {
    if ((i + 1) * remainder > numPlaced * numDivisions) {
      sizes.push(baseSize + 1);
      numPlaced++;
    } else {
      sizes.push(baseSize);
    }
  }
  return sizes;
}
function findIndexFromCoord(coord, sizes) {
  let cumulativeSize = 0;
  for (let i = 0; i < sizes.length; i++) {
    cumulativeSize += sizes[i];
    if (coord < cumulativeSize) {
      return i;
    }
  }
  return -1;
}
function isPanelRevealed(ctx, i, j) {
  return ctx.revealed.some(([rx, ry]) => rx === i && ry === j);
}
function flipPanel(ctx, i, j) {
  const id = ctx.id;
  const store = usePanelStore();
  const context = store.getContext(id);
  if (!isPanelRevealed(ctx, i, j)) {
    context.revealed.push([i, j]);
  } else {
    context.revealed = ctx.revealed.filter(
      ([rx, ry]) => !(rx === i && ry === j)
    );
  }
}
function drawGrid(canvas, context) {
  if (!canvas.value || !context.value) return;
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  const contextValue = context.value;
  const { displayWidth, displayHeight } = contextValue;
  const { x: numCols, y: numRows } = contextValue.amount;
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  const widths = getDistributedSizes(displayWidth, numCols);
  const heights = getDistributedSizes(displayHeight, numRows);
  const avgArea = displayWidth * displayHeight / (numCols * numRows);
  const toStroke = avgArea > 500;
  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "rgb(66,66,66)";
  const avgCellWidth = displayWidth / numCols;
  const avgCellHeight = displayHeight / numRows;
  const fontSize = Math.min(avgCellWidth, avgCellHeight) * 0.4;
  let currentY = 0;
  for (let j = 0; j < numRows; j++) {
    const rectHeight = heights[j];
    let currentX = 0;
    for (let i = 0; i < numCols; i++) {
      const rectWidth = widths[i];
      if (!isPanelRevealed(contextValue, i, j)) {
        ctx.fillRect(currentX, currentY, rectWidth, rectHeight);
        if (toStroke) {
          ctx.strokeRect(currentX, currentY, rectWidth, rectHeight);
        }
        const panelNumber = j * numCols + i + 1;
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.font = `${fontSize}px "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          panelNumber.toString(),
          currentX + rectWidth / 2,
          currentY + rectHeight / 2
        );
        ctx.fillStyle = "rgb(66,66,66)";
      }
      currentX += rectWidth;
    }
    currentY += rectHeight;
  }
}
function handlePanelClick(e, panelCanvas, context) {
  if (!panelCanvas.value || !context.value) return;
  const contextValue = context.value;
  const { displayWidth, displayHeight } = contextValue;
  const { x: numCols, y: numRows } = contextValue.amount;
  const bounds = panelCanvas.value.getBoundingClientRect();
  const x = (e.clientX - bounds.left) / bounds.width * displayWidth;
  const y = (e.clientY - bounds.top) / bounds.height * displayHeight;
  const widths = getDistributedSizes(displayWidth, numCols);
  const heights = getDistributedSizes(displayHeight, numRows);
  const i = findIndexFromCoord(x, widths);
  const j = findIndexFromCoord(y, heights);
  if (i === -1 || j === -1) return;
  flipPanel(contextValue, i, j);
}
function createRevealUtil(config) {
  const {
    useStore,
    generateOrder: externalGenerateOrder,
    setRevealingMethod = "setAutoRevealing",
    addRevealedMethod = "addRevealed",
    customRevealAll,
    customCoverAll
  } = config;
  let currentController2 = null;
  function createRevealController() {
    let paused = false;
    let finished = false;
    let revealFn = () => {
    };
    const stop = () => {
      var _a2, _b;
      finished = true;
      const store = useStore();
      (_a2 = store[setRevealingMethod]) == null ? void 0 : _a2.call(store, false);
      (_b = store.setPaused) == null ? void 0 : _b.call(store, false);
    };
    const pause = () => {
      var _a2;
      paused = true;
      const store = useStore();
      (_a2 = store.setPaused) == null ? void 0 : _a2.call(store, true);
    };
    const resume = () => {
      var _a2;
      paused = false;
      const store = useStore();
      (_a2 = store.setPaused) == null ? void 0 : _a2.call(store, false);
      revealFn();
    };
    const setRevealFn = (fn) => {
      revealFn = fn;
    };
    return {
      stop,
      pause,
      resume,
      setRevealFn,
      get isPaused() {
        return paused;
      },
      get isFinished() {
        return finished;
      }
    };
  }
  function startReveal2(params) {
    var _a2, _b, _c;
    if (currentController2) {
      currentController2.stop();
    }
    const store = useStore();
    const context = (_a2 = store.getContext) == null ? void 0 : _a2.call(store, params.id);
    if (!context) return null;
    (_b = store[setRevealingMethod]) == null ? void 0 : _b.call(store, true);
    (_c = store.setPaused) == null ? void 0 : _c.call(store, false);
    if (externalGenerateOrder && store.setOrder) {
      const order = externalGenerateOrder(
        context.autoRevealMode,
        context.amount
      );
      store.setOrder(params.id, order);
    } else if (store.generateOrder) {
      store.generateOrder(params.id, context.autoRevealMode || "sequential");
    }
    currentController2 = createRevealController();
    const controller = currentController2;
    const { id, duration, onReveal } = params;
    let currentIndex = 0;
    const reveal = () => {
      var _a3;
      if (controller.isPaused || controller.isFinished) return;
      const context2 = (_a3 = store.getContext) == null ? void 0 : _a3.call(store, id);
      if (!context2 || !context2.order || currentIndex >= context2.order.length) {
        controller.stop();
        return;
      }
      const nextItem = context2.order[currentIndex];
      if (store[addRevealedMethod]) {
        store[addRevealedMethod](id, nextItem);
      } else if (store.addRevealed) {
        store.addRevealed(id, nextItem);
      }
      currentIndex++;
      if (onReveal) onReveal(nextItem);
      if (currentIndex < context2.order.length) {
        window.setTimeout(reveal, duration);
      } else {
        controller.stop();
      }
    };
    controller.setRevealFn(reveal);
    reveal();
    return controller;
  }
  function stopReveal2() {
    if (currentController2) {
      currentController2.stop();
      currentController2 = null;
    }
  }
  function pauseReveal2() {
    if (currentController2 && !currentController2.isPaused) {
      currentController2.pause();
    }
  }
  function resumeReveal2() {
    if (currentController2 && currentController2.isPaused) {
      currentController2.resume();
    }
  }
  function revealAll2(id, onComplete) {
    if (currentController2) {
      currentController2.stop();
      currentController2 = null;
    }
    const store = useStore();
    const result = customRevealAll ? customRevealAll(id, store) : (() => {
      var _a2, _b;
      const context = (_a2 = store.getContext) == null ? void 0 : _a2.call(store, id);
      if (!context) return false;
      (_b = store.revealAll) == null ? void 0 : _b.call(store, id);
      return true;
    })();
    if (onComplete) onComplete();
    return result;
  }
  function coverAll2(id, onComplete) {
    if (currentController2) {
      currentController2.stop();
      currentController2 = null;
    }
    const store = useStore();
    const result = customCoverAll ? customCoverAll(id, store) : (() => {
      var _a2, _b;
      const context = (_a2 = store.getContext) == null ? void 0 : _a2.call(store, id);
      if (!context) return false;
      (_b = store.coverAll) == null ? void 0 : _b.call(store, id);
      return true;
    })();
    if (onComplete) onComplete();
    return result;
  }
  return {
    startReveal: startReveal2,
    stopReveal: stopReveal2,
    pauseReveal: pauseReveal2,
    resumeReveal: resumeReveal2,
    revealAll: revealAll2,
    coverAll: coverAll2
  };
}
const { startReveal: startReveal$1, stopReveal: stopReveal$1, pauseReveal: pauseReveal$1, resumeReveal: resumeReveal$1, revealAll: revealAll$1, coverAll: coverAll$1 } = createRevealUtil({
  useStore: usePanelStore,
  generateOrder: generateRevealOrder,
  setRevealingMethod: "setRevealing",
  addRevealedMethod: "addRevealedPanel",
  // Custom revealAll implementation for panels
  customRevealAll: (id, store) => {
    const context = store.getContext(id);
    if (!context) return false;
    const { x: cols, y: rows } = context.amount;
    const allPanels = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        if (!context.revealed.some(([rx, ry]) => rx === i && ry === j)) {
          allPanels.push([i, j]);
        }
      }
    }
    if (allPanels.length === 0) {
      return true;
    }
    allPanels.forEach((panel) => {
      store.addRevealedPanel(id, panel);
    });
    return true;
  },
  // Custom coverAll implementation for panels
  customCoverAll: (id, store) => {
    const context = store.getContext(id);
    if (!context) return false;
    store.clearRevealedPanels(id);
    return true;
  }
});
const _hoisted_1$3 = { class: "display-root" };
const _hoisted_2$3 = {
  class: "display-canvas-container",
  ref: "canvasContainer"
};
const _hoisted_3$2 = ["width", "height"];
const _hoisted_4$2 = ["width", "height"];
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Panel",
  props: {
    id: { default: null },
    isManualMode: { type: Boolean, default: true }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const imageStore = useImageStore();
    const panelStore = usePanelStore();
    const mainCanvas = ref(null);
    const panelCanvas = ref(null);
    const context = computed(() => {
      if (!props.id) return {};
      const imageData = imageStore.getData(props.id);
      const panelContext = panelStore.getContext(props.id);
      return {
        ...imageData,
        ...panelContext
      };
    });
    const onPanelClick = (e) => {
      if (!panelCanvas.value || !context.value || panelStore.isAutoRevealing || !props.isManualMode)
        return;
      handlePanelClick(e, panelCanvas, context);
      drawGrid(panelCanvas, context);
    };
    const startAutoReveal = () => {
      if (!props.id) return false;
      const panelContext = panelStore.getContext(props.id);
      if (!panelContext || !panelStore.canReveal(panelContext)) return false;
      startReveal$1({
        id: props.id,
        duration: panelContext.duration || 5e3,
        onReveal: () => {
          drawGrid(panelCanvas, context);
        }
      });
      return true;
    };
    const pauseAutoReveal = () => {
      pauseReveal$1();
      return true;
    };
    const resumeAutoReveal = () => {
      resumeReveal$1();
      return true;
    };
    const stopAutoReveal = () => {
      stopReveal$1();
      return true;
    };
    const revealAllPanels = () => {
      if (!props.id) return false;
      return revealAll$1(props.id, () => {
        drawGrid(panelCanvas, context);
      });
    };
    const coverAllPanels = () => {
      if (!props.id) return false;
      return coverAll$1(props.id, () => {
        drawGrid(panelCanvas, context);
      });
    };
    __expose({
      startAutoReveal,
      pauseAutoReveal,
      resumeAutoReveal,
      stopAutoReveal,
      revealAllPanels,
      coverAllPanels
    });
    watch(
      () => props.id,
      (newId) => {
        if (newId) {
          nextTick(() => {
            drawImage();
            drawGrid(panelCanvas, context);
          });
        }
      },
      { immediate: true }
    );
    watch(
      () => {
        var _a2;
        return (_a2 = context.value) == null ? void 0 : _a2.revealed;
      },
      (data) => {
        if (data) {
          drawGrid(panelCanvas, context);
        }
      },
      { deep: true }
    );
    const drawImage = () => {
      if (!mainCanvas.value || !context.value) return;
      const contextValue = context.value;
      const ctx = mainCanvas.value.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, contextValue.displayWidth, contextValue.displayHeight);
      ctx.drawImage(
        contextValue.renderable,
        0,
        0,
        contextValue.displayWidth,
        contextValue.displayHeight
      );
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("canvas", {
            ref_key: "mainCanvas",
            ref: mainCanvas,
            width: context.value.displayWidth,
            height: context.value.displayHeight,
            style: { "pointer-events": "none" }
          }, null, 8, _hoisted_3$2),
          createBaseVNode("canvas", {
            ref_key: "panelCanvas",
            ref: panelCanvas,
            class: "panelCanvas",
            width: context.value.displayWidth,
            height: context.value.displayHeight,
            style: { "position": "absolute", "cursor": "pointer" },
            onClick: onPanelClick
          }, null, 8, _hoisted_4$2)
        ], 512)
      ]);
    };
  }
});
const _hoisted_1$2 = { class: "top-bar-section common-utils" };
const _hoisted_2$2 = { class: "grid-selector" };
const _hoisted_3$1 = { class: "top-bar-section auto-play" };
const _hoisted_4$1 = { class: "duration-control" };
const _hoisted_5$1 = { style: { "display": "flex", "align-items": "center" } };
const _hoisted_6$1 = { style: { "display": "flex", "align-items": "center" } };
const _hoisted_7$1 = { style: { "display": "flex", "align-items": "center" } };
const _hoisted_8 = { class: "top-bar-section mode-toggle" };
const _hoisted_9 = {
  key: 0,
  class: "floating-play-button"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PanelManager",
  setup(__props) {
    const imageStore = useImageStore();
    const panelStore = usePanelStore();
    const { t } = useI18n();
    const {
      fileInput,
      currentId,
      canGoPrev,
      canGoNext,
      isAutoRevealing,
      isPaused,
      triggerFileInput,
      onFileChange: baseOnFileChange,
      handleDataSelect,
      goToPrev,
      goToNext
    } = useManagerBase({
      dataStore: imageStore,
      extraStore: panelStore,
      dataType: "image",
      fileAccept: "image/*",
      loadFile: loadImageFile,
      onFileAdded: (id, status) => {
        if (status === "added") {
          panelStore.setContext(id, {
            revealed: [],
            isManual: isManual.value,
            autoRevealMode: autoRevealMode.value,
            duration: duration.value,
            amount: { x: gridX.value, y: gridY.value }
          });
        }
      }
    });
    const panel = ref(null);
    const gridX = ref(5);
    const gridY = ref(5);
    const duration = ref(1e3);
    const isManual = ref(true);
    const mainMode = ref("random");
    const subMode = ref("");
    const autoRevealMode = computed(
      () => mainMode.value + (subMode.value ? `-${subMode.value}` : "")
    );
    const isSomeRevealed = computed(() => {
      const ctx = panelStore.getContext(currentId.value);
      return ctx ? ctx.amount.x * ctx.amount.y > ctx.revealed.length && ctx.revealed.length > 0 : false;
    });
    const canShowAll = computed(() => {
      const ctx = panelStore.getContext(currentId.value);
      return ctx && ctx.revealed.length < ctx.amount.x * ctx.amount.y;
    });
    const canHideAll = computed(
      () => {
        var _a2;
        return ((_a2 = panelStore.getContext(currentId.value)) == null ? void 0 : _a2.revealed.length) > 0;
      }
    );
    const durationSec = computed({
      get: () => duration.value / 1e3,
      set: (v) => {
        duration.value = Math.round(v * 1e3);
        const ctx = panelStore.getContext(currentId.value);
        if (ctx) {
          panelStore.setContext(currentId.value, {
            ...ctx,
            duration: duration.value
          });
        }
      }
    });
    const revealTypeButton = computed(() => ({
      icon: isManual.value ? "PhCursorClick" : "PhClockClockwise",
      tooltip: isManual.value ? t("panel.switchToAuto") : t("panel.switchToManual")
    }));
    const modeGet = (mode) => {
      if (mode.startsWith("spiral")) {
        return ["spiral", mode.replace("spiral-", "")];
      } else if (mode.startsWith("linear")) {
        return ["linear", mode.replace("linear-", "")];
      } else {
        return [mode, ""];
      }
    };
    const handleRevealControl = () => {
      var _a2, _b, _c;
      if (!isAutoRevealing.value) {
        if (currentId.value) {
          const ctx = panelStore.getContext(currentId.value);
          if (ctx) {
            panelStore.setContext(currentId.value, {
              ...ctx,
              autoRevealMode: autoRevealMode.value
            });
          }
        }
        (_a2 = panel.value) == null ? void 0 : _a2.startAutoReveal();
      } else {
        if (isPaused.value) {
          (_b = panel.value) == null ? void 0 : _b.resumeAutoReveal();
        } else {
          (_c = panel.value) == null ? void 0 : _c.pauseAutoReveal();
        }
      }
    };
    const handleRevealAll = () => {
      var _a2;
      (_a2 = panel.value) == null ? void 0 : _a2.revealAllPanels();
    };
    const handleCoverAll = () => {
      var _a2;
      (_a2 = panel.value) == null ? void 0 : _a2.coverAllPanels();
    };
    const toggleManualMode = () => {
      isManual.value = !isManual.value;
      const ctx = panelStore.getContext(currentId.value);
      if (ctx) {
        panelStore.setContext(currentId.value, {
          ...ctx,
          isManual: isManual.value
        });
      }
    };
    watch([gridX, gridY], ([x, y]) => {
      if (currentId.value) {
        panelStore.setAmount(currentId.value, { x, y });
      }
    });
    watch(currentId, (id) => {
      const ctx = panelStore.getContext(id);
      if (ctx) {
        duration.value = ctx.duration || 1e3;
        isManual.value = ctx.isManual;
        gridX.value = ctx.amount.x;
        gridY.value = ctx.amount.y;
        [mainMode.value, subMode.value] = modeGet(ctx.autoRevealMode);
      }
    });
    watch(autoRevealMode, () => {
      const ctx = panelStore.getContext(currentId.value);
      if (ctx) {
        panelStore.setContext(currentId.value, {
          ...ctx,
          autoRevealMode: autoRevealMode.value
        });
      }
    });
    onMounted(() => {
      const images = imageStore.getAllData();
      if (images.length > 0) {
        images.forEach((image) => {
          if (!panelStore.hasContext(image.id)) {
            panelStore.setContext(image.id, {
              revealed: [],
              isManual: true,
              autoRevealMode: "random",
              amount: { x: gridX.value, y: gridY.value },
              duration: duration.value
            });
          }
        });
      }
    });
    return (_ctx, _cache) => {
      const _component_el_button_group = ElButtonGroup;
      const _component_el_option = ElOption;
      const _component_el_select = ElSelect;
      const _component_el_slider = ElSlider;
      const _component_el_input_number = ElInputNumber;
      return openBlock(), createBlock(ManagerLayout, {
        "can-go-prev": unref(canGoPrev),
        "can-go-next": unref(canGoNext),
        disabled: unref(isAutoRevealing),
        onGoPrev: unref(goToPrev),
        onGoNext: unref(goToNext)
      }, {
        "file-input": withCtx(() => [
          createBaseVNode("input", {
            ref_key: "fileInput",
            ref: fileInput,
            type: "file",
            accept: "image/*",
            onChange: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => unref(baseOnFileChange) && unref(baseOnFileChange)(...args)),
            style: { "display": "none" }
          }, null, 544)
        ]),
        "common-utils": withCtx(() => [
          createBaseVNode("div", _hoisted_1$2, [
            createVNode(_component_el_button_group, null, {
              default: withCtx(() => [
                createVNode(Button, {
                  onClick: handleCoverAll,
                  icon: "PhEyeClosed",
                  title: unref(t)("topbar.hideAll"),
                  disabled: !canHideAll.value
                }, null, 8, ["title", "disabled"]),
                createVNode(Button, {
                  onClick: handleRevealAll,
                  icon: "PhFrameCorners",
                  title: unref(t)("topbar.showAll"),
                  disabled: !canShowAll.value
                }, null, 8, ["title", "disabled"])
              ]),
              _: 1
            }),
            createBaseVNode("div", _hoisted_2$2, [
              createVNode(_component_el_select, {
                modelValue: gridX.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => gridX.value = $event),
                size: "small",
                style: { "width": "60px" },
                disabled: unref(isAutoRevealing)
              }, {
                default: withCtx(() => [
                  (openBlock(), createElementBlock(Fragment, null, renderList(100, (n) => {
                    return createVNode(_component_el_option, {
                      key: `x-${n}`,
                      value: n,
                      label: n
                    }, null, 8, ["value", "label"]);
                  }), 64))
                ]),
                _: 1
              }, 8, ["modelValue", "disabled"]),
              createVNode(Icon, { name: "PhX" }),
              createVNode(_component_el_select, {
                modelValue: gridY.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => gridY.value = $event),
                size: "small",
                style: { "width": "60px" },
                disabled: unref(isAutoRevealing)
              }, {
                default: withCtx(() => [
                  (openBlock(), createElementBlock(Fragment, null, renderList(100, (n) => {
                    return createVNode(_component_el_option, {
                      key: `y-${n}`,
                      value: n,
                      label: n
                    }, null, 8, ["value", "label"]);
                  }), 64))
                ]),
                _: 1
              }, 8, ["modelValue", "disabled"])
            ])
          ])
        ]),
        "auto-play-controls": withCtx(() => [
          createBaseVNode("div", _hoisted_3$1, [
            withDirectives(createBaseVNode("div", _hoisted_4$1, [
              createVNode(_component_el_slider, {
                modelValue: durationSec.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => durationSec.value = $event),
                min: 0.1,
                max: 10,
                step: 0.1,
                style: { "width": "120px" },
                disabled: isManual.value || unref(isAutoRevealing),
                "show-tooltip": false
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_el_input_number, {
                modelValue: durationSec.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => durationSec.value = $event),
                min: 0.1,
                max: 10,
                step: 0.1,
                size: "small",
                disabled: isManual.value || unref(isAutoRevealing)
              }, null, 8, ["modelValue", "disabled"])
            ], 512), [
              [vShow, !isManual.value]
            ]),
            withDirectives(createVNode(_component_el_select, {
              class: "text-select",
              modelValue: mainMode.value,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => mainMode.value = $event),
              size: "small",
              disabled: unref(isAutoRevealing) || isManual.value
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(getMainRevealModes)(), (mode) => {
                  return openBlock(), createBlock(_component_el_option, {
                    key: mode.value,
                    label: mode.label,
                    value: mode.value
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_5$1, [
                        createVNode(Icon, {
                          name: mode.icon,
                          style: { "margin-right": "5px" }
                        }, null, 8, ["name"]),
                        createBaseVNode("span", null, toDisplayString$1(mode.label), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["label", "value"]);
                }), 128))
              ]),
              _: 1
            }, 8, ["modelValue", "disabled"]), [
              [vShow, !isManual.value]
            ]),
            withDirectives(createVNode(_component_el_select, {
              class: "text-select",
              modelValue: subMode.value,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => subMode.value = $event),
              size: "small",
              disabled: unref(isAutoRevealing) || isManual.value,
              placeholder: unref(t)("panel.directionPriority")
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(getLinearSubModes)(), (subMode2) => {
                  return openBlock(), createBlock(_component_el_option, {
                    key: subMode2.value,
                    label: subMode2.label,
                    value: subMode2.value
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_6$1, [
                        createVNode(Icon, {
                          name: subMode2.icon,
                          style: { "margin-right": "5px" }
                        }, null, 8, ["name"]),
                        createBaseVNode("span", null, toDisplayString$1(subMode2.label), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["label", "value"]);
                }), 128))
              ]),
              _: 1
            }, 8, ["modelValue", "disabled", "placeholder"]), [
              [vShow, !isManual.value && mainMode.value === "linear"]
            ]),
            withDirectives(createVNode(_component_el_select, {
              class: "text-select",
              modelValue: subMode.value,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => subMode.value = $event),
              size: "small",
              disabled: unref(isAutoRevealing) || isManual.value,
              placeholder: unref(t)("panel.directionAndStart")
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(getSpiralSubModes)(), (subMode2) => {
                  return openBlock(), createBlock(_component_el_option, {
                    key: subMode2.value,
                    label: subMode2.label,
                    value: subMode2.value
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_7$1, [
                        createVNode(Icon, {
                          name: subMode2.icon,
                          style: { "margin-right": "5px" }
                        }, null, 8, ["name"]),
                        createBaseVNode("span", null, toDisplayString$1(subMode2.label), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["label", "value"]);
                }), 128))
              ]),
              _: 1
            }, 8, ["modelValue", "disabled", "placeholder"]), [
              [vShow, !isManual.value && mainMode.value === "spiral"]
            ])
          ])
        ]),
        "mode-toggle": withCtx(() => [
          createBaseVNode("div", _hoisted_8, [
            createVNode(Button, {
              icon: revealTypeButton.value.icon,
              title: revealTypeButton.value.tooltip,
              tooltipPlacement: "left",
              onClick: toggleManualMode,
              disabled: unref(isAutoRevealing) || isSomeRevealed.value
            }, null, 8, ["icon", "title", "disabled"])
          ])
        ]),
        display: withCtx(() => [
          createVNode(_sfc_main$3, {
            ref_key: "panel",
            ref: panel,
            id: unref(currentId),
            isManualMode: isManual.value
          }, null, 8, ["id", "isManualMode"])
        ]),
        "floating-button": withCtx(() => [
          !isManual.value ? (openBlock(), createElementBlock("div", _hoisted_9, [
            createVNode(Button, {
              onClick: handleRevealControl,
              icon: unref(isAutoRevealing) && !unref(isPaused) ? "PhPause" : "PhPlay",
              title: unref(isAutoRevealing) && !unref(isPaused) ? unref(t)("topbar.pause") : unref(t)("topbar.play"),
              "icon-size": 28,
              disabled: !canShowAll.value,
              size: "large",
              circle: ""
            }, null, 8, ["icon", "title", "disabled"])
          ])) : createCommentVNode("", true)
        ]),
        sidebar: withCtx(() => [
          createVNode(DataSidebar, {
            "current-id": unref(currentId),
            "data-store": unref(imageStore),
            "extra-store": unref(panelStore),
            "data-type": "image",
            onSelectData: unref(handleDataSelect),
            onAddFile: unref(triggerFileInput)
          }, null, 8, ["current-id", "data-store", "extra-store", "onSelectData", "onAddFile"])
        ]),
        _: 1
      }, 8, ["can-go-prev", "can-go-next", "disabled", "onGoPrev", "onGoNext"]);
    };
  }
});
const useLetterStore = defineStore("letter", {
  state: () => ({
    contexts: {},
    isPaused: false,
    isAutoRevealing: false
  }),
  actions: {
    /**
     * Get letter context by id
     */
    getContext(id) {
      return id ? this.contexts[id] || null : null;
    },
    /**
     * Set letter context
     */
    setContext(id, context) {
      this.contexts[id] = context;
    },
    /**
     * Update characters per row
     */
    setCharsPerRow(id, charsPerRow) {
      if (this.contexts[id]) {
        this.contexts[id].charsPerRow = charsPerRow;
      }
    },
    /**
     * Check if letter context exists
     */
    hasContext(id) {
      return !!this.contexts[id];
    },
    /**
     * Set auto revealing state
     */
    setAutoRevealing(value) {
      this.isAutoRevealing = value;
    },
    /**
     * Set paused state
     */
    setPaused(value) {
      this.isPaused = value;
    },
    /**
     * Reveal a character at index
     */
    revealChar(id, index2) {
      const context = this.getContext(id);
      if (context && !context.revealed.includes(index2)) {
        context.revealed.push(index2);
      }
    },
    /**
     * Reveal all characters
     */
    revealAll(id) {
      const context = this.getContext(id);
      if (context) {
        context.revealed = Array.from(
          { length: context.totalChars },
          (_, i) => i
        );
      }
    },
    /**
     * Cover all characters
     */
    coverAll(id) {
      const context = this.getContext(id);
      if (context) {
        context.revealed = [];
      }
    },
    /**
     * Generate reveal order based on mode
     */
    generateOrder(id, mode) {
      const context = this.getContext(id);
      if (!context) return;
      const indices = Array.from({ length: context.totalChars }, (_, i) => i);
      switch (mode) {
        case "random":
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          break;
        case "sequential":
          break;
        case "reverse":
          indices.reverse();
          break;
      }
      context.order = indices;
    }
  }
});
function isCharRevealed(ctx, index2) {
  return ctx.revealed.includes(index2);
}
function flipChar(ctx, index2) {
  const id = ctx.id;
  const store = useLetterStore();
  const context = store.getContext(id);
  if (!context) return;
  if (!isCharRevealed(ctx, index2)) {
    context.revealed.push(index2);
  } else {
    context.revealed = ctx.revealed.filter((i) => i !== index2);
  }
}
function drawText(canvas, context, canvasWidth, canvasHeight) {
  if (!canvas.value || !context.value || !context.value.content) return;
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  const contextValue = context.value;
  const { content, charsPerRow } = contextValue;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const chars = content.split("");
  const totalChars = chars.length;
  const numRows = Math.ceil(totalChars / charsPerRow);
  const cellWidth = canvasWidth / charsPerRow;
  const cellHeight = canvasHeight / numRows;
  const fontSize = Math.min(cellWidth, cellHeight) * 0.8;
  ctx.font = `${fontSize}px "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  chars.forEach((char, index2) => {
    const row = Math.floor(index2 / charsPerRow);
    const col = index2 % charsPerRow;
    const x = col * cellWidth + cellWidth / 2;
    const y = row * cellHeight + cellHeight / 2;
    if (isCharRevealed(contextValue, index2)) {
      ctx.fillStyle = "#ffffff";
      ctx.fillText(char, x, y);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(
        col * cellWidth + 5,
        row * cellHeight + 5,
        cellWidth - 10,
        cellHeight - 10
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      const originalFont = ctx.font;
      ctx.font = `${fontSize * 0.5}px "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
      ctx.fillText((index2 + 1).toString(), x, y);
      ctx.font = originalFont;
    }
  });
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= charsPerRow; i++) {
    const x = i * cellWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let i = 0; i <= numRows; i++) {
    const y = i * cellHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }
}
function handleLetterClick(e, letterCanvas, context, canvasWidth, canvasHeight) {
  if (!letterCanvas.value || !context.value) return;
  const contextValue = context.value;
  const { content, charsPerRow } = contextValue;
  const rect = letterCanvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const totalChars = content.length;
  const numRows = Math.ceil(totalChars / charsPerRow);
  const cellWidth = canvasWidth / charsPerRow;
  const cellHeight = canvasHeight / numRows;
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);
  const index2 = row * charsPerRow + col;
  if (index2 >= 0 && index2 < totalChars) {
    flipChar(contextValue, index2);
  }
}
const { startReveal, stopReveal, pauseReveal, resumeReveal, revealAll, coverAll } = createRevealUtil({
  useStore: () => {
    const store = useLetterStore();
    return {
      ...store,
      // Map store methods to expected interface
      addRevealed: (id, index2) => store.revealChar(id, index2)
    };
  },
  setRevealingMethod: "setAutoRevealing",
  addRevealedMethod: "revealChar"
});
const _hoisted_1$1 = { class: "display-root" };
const _hoisted_2$1 = ["width", "height"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Letter",
  props: {
    id: { default: null },
    isManualMode: { type: Boolean, default: true }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const textStore = useTextStore();
    const letterStore = useLetterStore();
    const canvasContainer = ref(null);
    const letterCanvas = ref(null);
    const canvasWidth = ref(800);
    const canvasHeight = ref(600);
    const context = computed(() => {
      if (!props.id) return {};
      const textData = textStore.getData(props.id);
      const letterContext = letterStore.getContext(props.id);
      return {
        ...textData,
        ...letterContext
      };
    });
    const updateCanvasDimensions = () => {
      if (!canvasContainer.value) return;
      const rect = canvasContainer.value.getBoundingClientRect();
      canvasWidth.value = rect.width;
      canvasHeight.value = rect.height;
    };
    const draw = () => {
      drawText(letterCanvas, context, canvasWidth.value, canvasHeight.value);
    };
    const onLetterClick = (e) => {
      if (!letterCanvas.value || !context.value || letterStore.isAutoRevealing || !props.isManualMode)
        return;
      handleLetterClick(e, letterCanvas, context, canvasWidth.value, canvasHeight.value);
      draw();
    };
    const startAutoReveal = () => {
      if (!props.id) return false;
      const letterContext = letterStore.getContext(props.id);
      if (!letterContext) return false;
      if (letterContext.revealed.length >= letterContext.totalChars) {
        return false;
      }
      const charsPerSecond = letterContext.charsPerSecond || 5;
      const duration = Math.round(1e3 / charsPerSecond);
      startReveal({
        id: props.id,
        duration,
        onReveal: () => {
          draw();
        }
      });
      return true;
    };
    const pauseAutoReveal = () => {
      pauseReveal();
      return true;
    };
    const resumeAutoReveal = () => {
      resumeReveal();
      return true;
    };
    const stopAutoReveal = () => {
      stopReveal();
      return true;
    };
    const revealAllLetters = () => {
      if (!props.id) return false;
      return revealAll(props.id, () => {
        draw();
      });
    };
    const coverAllLetters = () => {
      if (!props.id) return false;
      return coverAll(props.id, () => {
        draw();
      });
    };
    __expose({
      startAutoReveal,
      pauseAutoReveal,
      resumeAutoReveal,
      stopAutoReveal,
      revealAllLetters,
      coverAllLetters
    });
    watch(
      () => props.id,
      (newId) => {
        if (newId) {
          nextTick(() => {
            updateCanvasDimensions();
            draw();
          });
        }
      },
      { immediate: true }
    );
    watch(
      () => {
        var _a2;
        return (_a2 = context.value) == null ? void 0 : _a2.revealed;
      },
      () => {
        draw();
      },
      { deep: true }
    );
    watch(
      () => {
        var _a2;
        return (_a2 = context.value) == null ? void 0 : _a2.charsPerRow;
      },
      () => {
        draw();
      }
    );
    onMounted(() => {
      updateCanvasDimensions();
      draw();
      window.addEventListener("resize", () => {
        updateCanvasDimensions();
        nextTick(() => {
          draw();
        });
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", {
          class: "display-canvas-container",
          ref_key: "canvasContainer",
          ref: canvasContainer
        }, [
          createBaseVNode("canvas", {
            ref_key: "letterCanvas",
            ref: letterCanvas,
            class: "letterCanvas",
            width: canvasWidth.value,
            height: canvasHeight.value,
            style: { "position": "absolute", "cursor": "pointer" },
            onClick: onLetterClick
          }, null, 8, _hoisted_2$1)
        ], 512)
      ]);
    };
  }
});
const Letter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-dce48ce5"]]);
const _hoisted_1 = { class: "top-bar-section common-utils" };
const _hoisted_2 = { class: "chars-per-row-control" };
const _hoisted_3 = { class: "top-bar-section auto-play" };
const _hoisted_4 = { class: "duration-control" };
const _hoisted_5 = { style: { "display": "flex", "align-items": "center" } };
const _hoisted_6 = { class: "top-bar-section mode-toggle" };
const _hoisted_7 = {
  key: 0,
  class: "floating-play-button"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LetterManager",
  setup(__props) {
    const textStore = useTextStore();
    const letterStore = useLetterStore();
    const { t } = useI18n();
    const {
      fileInput,
      currentId,
      canGoPrev,
      canGoNext,
      isAutoRevealing,
      isPaused,
      triggerFileInput,
      onFileChange: baseOnFileChange,
      handleDataSelect,
      goToPrev,
      goToNext
    } = useManagerBase({
      dataStore: textStore,
      extraStore: letterStore,
      dataType: "text",
      fileAccept: ".txt",
      loadFile: async (file) => {
        const { loadTextFile } = await __vitePreload(async () => {
          const { loadTextFile: loadTextFile2 } = await import("./useTextLoader-DnyA7q0G.js");
          return { loadTextFile: loadTextFile2 };
        }, true ? [] : void 0);
        return await loadTextFile(file);
      },
      onFileAdded: (id, status) => {
        if (status === "added") {
          const textData = textStore.getData(id);
          if (textData) {
            letterStore.setContext(id, {
              totalChars: textData.content.length,
              charsPerRow: charsPerRow.value,
              revealed: [],
              isManual: isManual.value,
              autoRevealMode: autoRevealMode.value,
              charsPerSecond: charsPerSecond.value
            });
          }
        }
      }
    });
    const letter = ref(null);
    const charsPerRow = ref(10);
    const charsPerSecond = ref(5);
    const isManual = ref(true);
    const autoRevealMode = ref("random");
    const isSomeRevealed = computed(() => {
      const ctx = letterStore.getContext(currentId.value);
      return ctx ? ctx.totalChars > ctx.revealed.length && ctx.revealed.length > 0 : false;
    });
    const canShowAll = computed(() => {
      const ctx = letterStore.getContext(currentId.value);
      return ctx && ctx.revealed.length < ctx.totalChars;
    });
    const canHideAll = computed(() => {
      const ctx = letterStore.getContext(currentId.value);
      return ctx ? ctx.revealed.length > 0 : false;
    });
    const charsPerSecondControl = computed({
      get: () => charsPerSecond.value,
      set: (v) => {
        charsPerSecond.value = v;
        const ctx = letterStore.getContext(currentId.value);
        if (ctx) {
          letterStore.setContext(currentId.value, {
            ...ctx,
            charsPerSecond: charsPerSecond.value
          });
        }
      }
    });
    const revealModes = [
      { value: "random", icon: "PhShuffleSimple", label: t("letter.random") },
      { value: "sequential", icon: "PhArrowRight", label: t("letter.sequential") },
      { value: "reverse", icon: "PhArrowLeft", label: t("letter.reverse") }
    ];
    const revealTypeButton = computed(() => ({
      icon: isManual.value ? "PhCursorClick" : "PhClockClockwise",
      tooltip: isManual.value ? t("letter.switchToAuto") : t("letter.switchToManual")
    }));
    const handleRevealControl = () => {
      var _a2, _b, _c;
      if (!isAutoRevealing.value) {
        if (currentId.value) {
          const ctx = letterStore.getContext(currentId.value);
          if (ctx) {
            letterStore.setContext(currentId.value, {
              ...ctx,
              autoRevealMode: autoRevealMode.value
            });
          }
        }
        (_a2 = letter.value) == null ? void 0 : _a2.startAutoReveal();
      } else {
        if (isPaused.value) {
          (_b = letter.value) == null ? void 0 : _b.resumeAutoReveal();
        } else {
          (_c = letter.value) == null ? void 0 : _c.pauseAutoReveal();
        }
      }
    };
    const handleRevealAll = () => {
      var _a2;
      (_a2 = letter.value) == null ? void 0 : _a2.revealAllLetters();
    };
    const handleCoverAll = () => {
      var _a2;
      (_a2 = letter.value) == null ? void 0 : _a2.coverAllLetters();
    };
    const toggleManualMode = () => {
      isManual.value = !isManual.value;
      const ctx = letterStore.getContext(currentId.value);
      if (ctx) {
        letterStore.setContext(currentId.value, {
          ...ctx,
          isManual: isManual.value
        });
      }
    };
    watch(charsPerRow, (newValue) => {
      if (currentId.value) {
        letterStore.setCharsPerRow(currentId.value, newValue);
      }
    });
    watch(currentId, (id) => {
      const ctx = letterStore.getContext(id);
      if (ctx) {
        charsPerSecond.value = ctx.charsPerSecond || 5;
        isManual.value = ctx.isManual;
        charsPerRow.value = ctx.charsPerRow;
        autoRevealMode.value = ctx.autoRevealMode;
      }
    });
    watch(autoRevealMode, () => {
      const ctx = letterStore.getContext(currentId.value);
      if (ctx) {
        letterStore.setContext(currentId.value, {
          ...ctx,
          autoRevealMode: autoRevealMode.value
        });
      }
    });
    return (_ctx, _cache) => {
      const _component_el_button_group = ElButtonGroup;
      const _component_el_input_number = ElInputNumber;
      const _component_el_slider = ElSlider;
      const _component_el_option = ElOption;
      const _component_el_select = ElSelect;
      return openBlock(), createBlock(ManagerLayout, {
        "can-go-prev": unref(canGoPrev),
        "can-go-next": unref(canGoNext),
        disabled: unref(isAutoRevealing),
        onGoPrev: unref(goToPrev),
        onGoNext: unref(goToNext)
      }, {
        "file-input": withCtx(() => [
          createBaseVNode("input", {
            ref_key: "fileInput",
            ref: fileInput,
            type: "file",
            accept: ".txt",
            onChange: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => unref(baseOnFileChange) && unref(baseOnFileChange)(...args)),
            style: { "display": "none" }
          }, null, 544)
        ]),
        "common-utils": withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(_component_el_button_group, null, {
              default: withCtx(() => [
                createVNode(Button, {
                  onClick: handleCoverAll,
                  icon: "PhEyeClosed",
                  title: unref(t)("topbar.hideAll"),
                  disabled: !canHideAll.value
                }, null, 8, ["title", "disabled"]),
                createVNode(Button, {
                  onClick: handleRevealAll,
                  icon: "PhFrameCorners",
                  title: unref(t)("topbar.showAll"),
                  disabled: !canShowAll.value
                }, null, 8, ["title", "disabled"])
              ]),
              _: 1
            }),
            createBaseVNode("div", _hoisted_2, [
              createBaseVNode("span", null, toDisplayString$1(unref(t)("letter.charsPerRow")) + ":", 1),
              createVNode(_component_el_input_number, {
                modelValue: charsPerRow.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => charsPerRow.value = $event),
                min: 1,
                max: 100,
                step: 1,
                size: "small",
                disabled: unref(isAutoRevealing)
              }, null, 8, ["modelValue", "disabled"])
            ])
          ])
        ]),
        "auto-play-controls": withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            withDirectives(createBaseVNode("div", _hoisted_4, [
              createVNode(_component_el_slider, {
                modelValue: charsPerSecondControl.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => charsPerSecondControl.value = $event),
                min: 1,
                max: 100,
                step: 1,
                style: { "width": "120px" },
                disabled: isManual.value || unref(isAutoRevealing),
                "show-tooltip": false
              }, null, 8, ["modelValue", "disabled"]),
              createVNode(_component_el_input_number, {
                modelValue: charsPerSecondControl.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => charsPerSecondControl.value = $event),
                min: 1,
                max: 100,
                step: 1,
                size: "small",
                disabled: isManual.value || unref(isAutoRevealing),
                style: { "width": "100px" }
              }, null, 8, ["modelValue", "disabled"])
            ], 512), [
              [vShow, !isManual.value]
            ]),
            withDirectives(createVNode(_component_el_select, {
              class: "text-select",
              modelValue: autoRevealMode.value,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => autoRevealMode.value = $event),
              size: "small",
              disabled: unref(isAutoRevealing) || isManual.value
            }, {
              default: withCtx(() => [
                (openBlock(), createElementBlock(Fragment, null, renderList(revealModes, (mode) => {
                  return createVNode(_component_el_option, {
                    key: mode.value,
                    label: mode.label,
                    value: mode.value
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_5, [
                        createVNode(Icon, {
                          name: mode.icon,
                          style: { "margin-right": "5px" }
                        }, null, 8, ["name"]),
                        createBaseVNode("span", null, toDisplayString$1(mode.label), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["label", "value"]);
                }), 64))
              ]),
              _: 1
            }, 8, ["modelValue", "disabled"]), [
              [vShow, !isManual.value]
            ])
          ])
        ]),
        "mode-toggle": withCtx(() => [
          createBaseVNode("div", _hoisted_6, [
            createVNode(Button, {
              icon: revealTypeButton.value.icon,
              title: revealTypeButton.value.tooltip,
              tooltipPlacement: "left",
              onClick: toggleManualMode,
              disabled: unref(isAutoRevealing) || isSomeRevealed.value
            }, null, 8, ["icon", "title", "disabled"])
          ])
        ]),
        display: withCtx(() => [
          createVNode(Letter, {
            ref_key: "letter",
            ref: letter,
            id: unref(currentId),
            isManualMode: isManual.value
          }, null, 8, ["id", "isManualMode"])
        ]),
        "floating-button": withCtx(() => [
          !isManual.value ? (openBlock(), createElementBlock("div", _hoisted_7, [
            createVNode(Button, {
              onClick: handleRevealControl,
              icon: unref(isAutoRevealing) && !unref(isPaused) ? "PhPause" : "PhPlay",
              title: unref(isAutoRevealing) && !unref(isPaused) ? unref(t)("topbar.pause") : unref(t)("topbar.play"),
              "icon-size": 28,
              disabled: !canShowAll.value,
              size: "large",
              circle: ""
            }, null, 8, ["icon", "title", "disabled"])
          ])) : createCommentVNode("", true)
        ]),
        sidebar: withCtx(() => [
          createVNode(DataSidebar, {
            "current-id": unref(currentId),
            "data-store": unref(textStore),
            "extra-store": unref(letterStore),
            "data-type": "text",
            onSelectData: unref(handleDataSelect),
            onAddFile: unref(triggerFileInput)
          }, null, 8, ["current-id", "data-store", "extra-store", "onSelectData", "onAddFile"])
        ]),
        _: 1
      }, 8, ["can-go-prev", "can-go-next", "disabled", "onGoPrev", "onGoNext"]);
    };
  }
});
const LetterManager = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ba6585e1"]]);
const router = createRouter({
  history: createWebHistory("/quiz-display-tool/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/zoomer",
      name: "zoomer",
      component: _sfc_main$4
    },
    {
      path: "/panel",
      name: "panel",
      component: _sfc_main$2
    },
    {
      path: "/text-panel",
      name: "text-panel",
      component: LetterManager
    }
  ]
});
const currentLang = localStorage.getItem("language") || navigator.language.toLowerCase();
(_a = document.querySelector("html")) == null ? void 0 : _a.setAttribute("lang", currentLang);
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount("#app");
//# sourceMappingURL=index-B9iHDbnG.js.map
