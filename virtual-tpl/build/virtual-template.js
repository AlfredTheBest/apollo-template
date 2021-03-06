/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var _ = exports

_.type = function (obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
}

_.isArray = function isArray (list) {
  return _.type(list) === 'Array'
}

_.isString = function isString (list) {
  return _.type(list) === 'String'
}

_.each = function each (array, fn) {
  for (var i = 0, len = array.length; i < len; i++) {
    fn(array[i], i)
  }
}

_.toArray = function toArray (listLike) {
  if (!listLike) {
    return []
  }

  var list = []

  for (var i = 0, len = listLike.length; i < len; i++) {
    list.push(listLike[i])
  }

  return list
}

_.setAttr = function setAttr (node, key, value) {
  switch (key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      var tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (
        tagName === 'input' || tagName === 'textarea'
      ) {
        node.value = value
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _ = {};

_.each = function (list, callback) {
  for (var i = 0, len = list.length; i < len; i++) {
    callback(list[i], i);
  }
};

_.extend = function (dest, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      dest[key] = src[key];
    }
  }
  return dest;
};

if (process.env.NODE_ENV) {
  _.nextTick = process.nextTick;
} else {
  var nextTick = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;

  if (nextTick) {
    _.nextTick = function () {
      nextTick.apply(window, arguments);
    };
  } else {
    _.nextTick = function (func) {
      setTimeout(func);
    };
  }
}

module.exports = _;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  TK_TEXT: 1,
  TK_IF: 2,
  TK_END_IF: 3,
  TK_ELSE_IF: 4,
  TK_ELSE: 5,
  TK_EACH: 6,
  TK_END_EACH: 7,
  TK_GT: 8,
  TK_SLASH_GT: 9,
  TK_TAG_NAME: 10,
  TK_ATTR_NAME: 11,
  TK_ATTR_EQUAL: 12,
  TK_ATTR_STRING: 13,
  TK_CLOSE_TAG: 14,
  TK_EOF: 100
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(0)

var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

function patch (node, patches) {
  var walker = {index: 0}
  dfsWalk(node, walker, patches)
}

function dfsWalk (node, walker, patches) {
  var currentPatches = patches[walker.index]

  var len = node.childNodes
    ? node.childNodes.length
    : 0
  for (var i = 0; i < len; i++) {
    var child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches (node, currentPatches) {
  _.each(currentPatches, function (currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        var newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // fuck ie
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}

function setProps (node, props) {
  for (var key in props) {
    if (props[key] === void 666) {
      node.removeAttribute(key)
    } else {
      var value = props[key]
      _.setAttr(node, key, value)
    }
  }
}

function reorderChildren (node, moves) {
  var staticNodeList = _.toArray(node.childNodes)
  var maps = {}

  _.each(staticNodeList, function (node) {
    if (node.nodeType === 1) {
      var key = node.getAttribute('key')
      if (key) {
        maps[key] = node
      }
    }
  })

  _.each(moves, function (move) {
    var index = move.index
    if (move.type === 0) { // remove item
      if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    } else if (move.type === 1) { // insert item
      var insertNode = maps[move.item.key]
        ? maps[move.item.key] // reuse old item
        : (typeof move.item === 'object')
            ? move.item.render()
            : document.createTextNode(move.item)
      staticNodeList.splice(index, 0, insertNode)
      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  })
}

patch.REPLACE = REPLACE
patch.REORDER = REORDER
patch.PROPS = PROPS
patch.TEXT = TEXT

module.exports = patch


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.vTemplate = __webpack_require__(5);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CodeGen = __webpack_require__(6);
var Parser = __webpack_require__(8);
var svd = __webpack_require__(10);
var _ = __webpack_require__(1);

var vTemplate = {};

vTemplate.compile = function (template) {
  var astRoot = new Parser(template).parse();
  var code = new CodeGen(astRoot);
  return function (data) {
    var params = [];
    for (var key in data) {
      params.push('  var ' + key + ' = ' + '_data_.' + key + ';\n');
    }
    var body = params.join('') + code.body;
    var renderFunc = new Function('_data_', '_el_', body);
    var el = getElementByRenderFunc(renderFunc, data);
    return new VTemplate(el, data, renderFunc);
  };
};

function VTemplate(el, data, renderFunc) {
  this.oldVd = el;
  this.dom = el.render();
  this.data = data;
  this.renderFunc = renderFunc;
}

var pp = VTemplate.prototype;

pp.setData = function (data, isSync) {
  _.extend(this.data, data);
  if (isSync) {
    this.flush();
  } else {
    var self = this;
    _.nextTick(function () {
      self.flush();
    });
  }
};

pp.flush = function () {
  var newVd = getElementByRenderFunc(this.renderFunc, this.data);
  var patches = svd.diff(this.oldVd, newVd);
  svd.patch(this.dom, patches);
  this.oldVd = newVd;
};

function getElementByRenderFunc(render, data) {

  var container = render(data, svd.el);
  return container.children.length === 1 ? container.children[0] : container;
}

module.exports = vTemplate;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1);
var codeGenMethods = {};

function CodeGen(astRoot) {
  this.nodeIndex = 1;
  this.lines = ['  var node0 = {children: []};'];
  this.walkRoot(astRoot);
  this.lines.push('  return _el_("div", {}, node0.children);');
  this.body = this.lines.join('\n');
}

var pp = CodeGen.prototype;

pp.walkRoot = function (astRoot) {
  this.walk(astRoot, '  ', '0');
};

pp.walk = function (node, indent, parentIndex) {
  if (typeof node === 'string') {
    return this.genString(node, indent, parentIndex);
  } else {
    return this['gen' + node.type](node, indent, parentIndex);
  }
};

pp.genStat = function (node, indent, parentIndex) {
  var self = this;
  _.each(node.members, function (item) {
    self.walk(item, indent, parentIndex);
  });
};

pp.genIfStat = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*if\s*)|(\s*\}$)/g, '');
  this.lines.push('\n' + indent + 'if (' + expr + ') {');
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex);
  }
  if (node.elseifs) {
    var self = this;
    _.each(node.elseifs, function (elseif) {
      self.walk(elseif, indent, parentIndex);
    });
  }
  if (node.elsebody) {
    this.lines.push(indent + '} else {');
    this.walk(node.elsebody, inc(indent), parentIndex);
  }
  this.lines.push(indent + '}\n');
};

pp.genElseIf = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*else\s*if\s*)|(\s*\}$)/g, '');
  this.lines.push(indent + '} else if (' + expr + ') {');
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex);
  }
};

pp.genEachStat = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*each\s*)|(\s*\}$)/g, '');
  var tokens = expr.split(/\s+/);
  var list = tokens[0];
  var item = tokens[2];
  var key = tokens[3] || getKey();
  this.lines.push('\n' + indent + 'for (var ' + key + ' = 0, len = ' + list + '.length; ' + key + ' < len; ' + key + '++) {');
  this.lines.push(inc(indent) + 'var ' + item + ' = ' + list + '[' + key + '];');
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex);
  }
  this.lines.push(indent + '}\n');
};

pp.genNode = function (node, indent, parentIndex) {
  var currentIndex = this.nodeIndex++;
  var nodeName = 'node' + currentIndex;
  this.lines.push(indent + 'var ' + nodeName + ' = {children: []};');
  if (node.body) {
    this.walk(node.body, indent, currentIndex);
  }
  this.lines.push(indent + nodeName + ' = _el_("' + node.name + '", ' + pp.getAttrs(node) + ', ' + nodeName + '.children);');
  this.lines.push(indent + 'node' + parentIndex + '.children.push(node' + currentIndex + ');');
};

pp.genString = function (node, indent, parentIndex) {
  var line = indent + 'node' + parentIndex + '.children.push(' + getInterpolation(node) + ')';
  line = line.replace('\n', '\\n');
  this.lines.push(line);
};

pp.getAttrs = function (node) {
  var str = '{';
  var attrs = node.attributes;
  var i = 0;
  for (var key in attrs) {
    var attrStr = getInterpolation(attrs[key]);
    if (i++ != 0) {
      str += ', ' + key + ': ' + attrStr;
    } else {
      str += key + ': ' + attrStr;
    }
  }
  str += '}';
  return str;
};

function inc(indent) {
  return indent + '  ';
}

var keyIndex = 0;

function getKey() {
  return 'key' + keyIndex++;
}

function getInterpolation(node) {
  var reg = /\{[\s\S]+?\}/g;
  var inters = node.match(reg);
  var strs = node.split(reg);
  if (!inters) return ['"', '"'].join(node);
  var last = strs[strs.length - 1];
  strs.splice(strs.length - 1, 1);
  var ret = '';
  _.each(strs, function (str, i) {
    ret += '"' + str + '" + ';
    ret += '(' + inters[i].replace(/[\{\}]/g, '') + ') + ';
  });
  ret += '"' + last + '"';
  return ret;
}

module.exports = CodeGen;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Tokenizer = __webpack_require__(9);
var types = __webpack_require__(2);

var typesName = {};
typesName[types.TK_TEXT] = "text node";
typesName[types.TK_IF] = "{if}";
typesName[types.TK_END_IF] = "{/if}";
typesName[types.TK_ELSE_IF] = "{elseif ..}";
typesName[types.TK_ELSE] = "{else}";
typesName[types.TK_EACH] = "{each ... }";
typesName[types.TK_END_EACH] = "{/each}";
typesName[types.TK_GT] = ">";
typesName[types.TK_SLASH_GT] = "/>";
typesName[types.TK_TAG_NAME] = "open tag name";
typesName[types.TK_ATTR_NAME] = "attribute name";
typesName[types.TK_ATTR_EQUAL] = "=";
typesName[types.TK_ATTR_STRING] = "attribute string";
typesName[types.TK_CLOSE_TAG] = "close tag";
typesName[types.TK_EOF] = "EOF";

function Parser(input) {
  this.tokens = new Tokenizer(input);
}

var pp = Parser.prototype;

pp.is = function (type) {
  return this.tokens.peekToken().type === type;
};

pp.parse = function () {
  this.tokens.index = 0;
  var root = this.parseStat();
  this.eat(types.TK_EOF);
  return root;
};

pp.parseStat = function () {
  var stat = {
    type: 'Stat',
    members: []
  };
  if (this.is(types.TK_IF) || this.is(types.TK_EACH) || this.is(types.TK_TAG_NAME) || this.is(types.TK_TEXT)) {
    pushMembers(stat.members, [this.parseFrag()]);
    pushMembers(stat.members, this.parseStat().members);
    console.log(stat.members);
  } else {// TODO: Follow check
    // end
  }
  return stat;
};

/*
 * push stat's memeber and concat all text
 */
function pushMembers(target, candidates) {
  for (var i = 0, len = candidates.length; i < len; i++) {
    var lasIdx = target.length - 1;
    if (isString(target[lasIdx]) && isString(candidates[i])) {
      target[lasIdx] += candidates[i];
    } else {
      target.push(candidates[i]);
    }
  }
}

function isString(str) {
  return typeof str === 'string';
}

pp.parseFrag = function () {
  if (this.is(types.TK_IF)) return this.parseIfStat();else if (this.is(types.TK_EACH)) return this.parseEachStat();else if (this.is(types.TK_TAG_NAME)) return this.parseNode();else if (this.is(types.TK_TEXT)) {
    var token = this.eat(types.TK_TEXT);
    return token.label;
  } else {
    this.parseError('parseFrag');
  }
};

/*
 * IfStat -> if Stat ElseIfs Else '{/if}'
 */

pp.parseIfStat = function () {
  var token = this.tokens.peekToken();
  var ifStat = {
    type: 'IfStat',
    label: token.label
  };
  this.eat(types.TK_IF);
  ifStat.body = this.parseStat();
  ifStat.elseifs = this.parseElseIfs();
  ifStat.elsebody = this.parseElse();
  this.eat(types.TK_END_IF);
  return ifStat;
};

/*
 * ElseIfs -> ElseIf ElseIfs|e
 */

pp.parseElseIfs = function () {
  var elseifs = [];
  if (this.is(types.TK_ELSE_IF)) {
    elseifs.push(this.parseElseIf());
    elseifs.push.apply(elseifs, this.parseElseIfs());
  } else if (this.is(types.TK_ELSE) || this.is(types.TK_END_IF)) {
    // do nothing
  } else {
    this.parseError('parseElseIfs');
  }
  return elseifs;
};

/*
 * ElseIfs -> elseif Stat
 */

pp.parseElseIf = function () {
  var token = this.tokens.peekToken();
  var elseif = {
    type: 'ElseIf',
    label: token.label
  };
  this.eat(types.TK_ELSE_IF);
  elseif.body = this.parseStat();
  return elseif;
};

/*
 * Else -> '{else}' Stat|e
 */

pp.parseElse = function () {
  if (this.is(types.TK_ELSE)) {
    this.eat(types.TK_ELSE);
    return this.parseStat();
  } else if (this.is(types.TK_END_IF)) {
    // do nothing
  } else {
    parseError('parseElse');
  }
};

/*
 * EachStat -> each Stat '{/each}'
 */

pp.parseEachStat = function () {
  var eachStat = {
    type: 'EachStat'
  };
  var token = this.eat(types.TK_EACH);
  eachStat.label = token.label;
  eachStat.body = this.parseStat();
  this.eat(types.TK_END_EACH);
  return eachStat;
};

/*
 * Node -> OpenTag NodeTail
 */

pp.parseNode = function () {
  var token = this.tokens.peekToken();
  var node = {
    type: 'Node',
    name: token.label
  };
  this.parseOpenTag(node);
  this.parseNodeTail(node);
  return node;
};

/*
 * OpenTag -> tagName Attrs
 */

pp.parseOpenTag = function (node) {
  this.eat(types.TK_TAG_NAME);
  node.attributes = this.parseAttrs();
};

/*
 * NodeTail -> '>' Stat closeTag
 *           | '/>'
 */

pp.parseNodeTail = function (node) {
  if (this.is(types.TK_GT)) {
    this.eat(types.TK_GT);
    node.body = this.parseStat();
    this.eat(types.TK_CLOSE_TAG);
  } else if (this.is(types.TK_SLASH_GT)) {
    this.eat(types.TK_SLASH_GT);
  } else {
    this.parseError('parseNodeTail');
  }
};

pp.parseAttrs = function () {
  var attrs = {};
  if (this.is(types.TK_ATTR_NAME)) {
    extend(attrs, this.parseAttr());
    extend(attrs, this.parseAttrs());
  } else if (this.is(types.TK_GT) || this.is(types.TK_SLASH_GT)) {
    // do nothing
  } else {
    this.parseError('parseAttrs');
  }
  return attrs;
};

pp.parseAttr = function () {
  var attr = {};
  var token = this.eat(types.TK_ATTR_NAME);
  var value = this.parseValue();
  attr[token.label] = value;
  return attr;
};

pp.parseValue = function () {
  if (this.is(types.TK_ATTR_EQUAL)) {
    this.eat(types.TK_ATTR_EQUAL);
    var token = this.eat(types.TK_ATTR_STRING);
    return token.label;
  } else if (this.is(types.TK_GT) || this.is(types.TK_SLASH_GT) || this.is(types.TK_ATTR_NAME)) {
    // do nothing
  } else {
    this.parseError('parseValue');
  }
};

pp.error = function (msg) {
  throw new Error('Parse Error: ' + msg);
};

pp.parseError = function (name) {
  var token = this.tokens.peekToken();
  this.error('in ' + name + ', unexpected token \'' + token.label + '\'');
};

pp.eat = function (type) {
  var token = this.tokens.nextToken();
  if (token.type !== type) {
    this.error('expect a(n) ' + typesName[type] + ', but got a(n) ' + typesName[token.type]);
  }
  return token;
};

function extend(src, dest) {
  for (var key in dest) {
    if (dest.hasOwnProperty(key)) {
      src[key] = dest[key];
    }
  }
}

module.exports = Parser;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var types = __webpack_require__(2);

function Tokenizer(input) {
  this.input = input;
  this.index = 0;
  this.context = null;
  this.eof = false;
}

var pp = Tokenizer.prototype;

pp.nextToken = function () {
  this.eatSpaces();
  return this.readCloseTag() || this.readTagName() || this.readAttrName() || this.readAttrEqual() || this.readAttrString() || this.readGT() || this.readSlashGT() || this.readIF() || this.readElseIf() || this.readElse() || this.readEndIf() || this.readEach() || this.readEndEach() || this.readText() || this.readEOF() || this.error();
};

pp.peekToken = function () {
  var index = this.index;
  var token = this.nextToken();
  this.index = index;
  return token;
};

/*
 * Read token one by one
 */

pp.readTagName = function () {
  if (this.char() === '<') {
    this.index++;
    this.eatSpaces();
    var start = this.index;
    while (this.char().match(/[\w\d]/)) {
      this.index++;
    }
    var tagName = this.input.slice(start, this.index);
    this.setContext(types.TK_TAG_NAME);
    return {
      type: types.TK_TAG_NAME,
      label: tagName
    };
  }
};

pp.readAttrName = function () {
  if (this.inContext(types.TK_TAG_NAME) && this.char()) {
    var reg = /[\w\-\d]/;
    if (!reg.test(this.char())) return;
    var start = this.index;
    while (this.char() && reg.test(this.char())) {
      this.index++;
    }
    return {
      type: types.TK_ATTR_NAME,
      label: this.input.slice(start, this.index)
    };
  }
};

pp.readAttrEqual = function () {
  if (this.inContext(types.TK_TAG_NAME) && this.char() === '=') {
    this.index++;
    return {
      type: types.TK_ATTR_EQUAL,
      label: '='
    };
  }
};

pp.readAttrString = function () {
  if (this.inContext(types.TK_TAG_NAME) && /['"]/.test(this.char())) {
    var quote = this.char();
    var start = this.index;
    this.index++;
    while (!isUndefined(this.char()) && this.char() !== quote) {
      this.index++;
    }
    this.index++;
    return {
      type: types.TK_ATTR_STRING,
      label: this.input.slice(start + 1, this.index - 1)
    };
  }
};

pp.readCloseTag = function () {
  return this.captureByRegx(/^\<\s*?\/\s*?[\w\d-]+?\s*?\>/, types.TK_CLOSE_TAG);
};

pp.readGT = function () {
  if (this.char() === '>') {
    this.index++;
    this.setContext(types.TK_GT);
    return {
      type: types.TK_GT,
      label: '>'
    };
  }
};

pp.readSlashGT = function () {
  return this.captureByRegx(/^\/\>/, types.TK_SLASH_GT);
};

pp.readIF = function () {
  return this.captureByRegx(/^\{\s*?if\s[\S\s]*?\}/, types.TK_IF);
};

pp.readElse = function () {
  return this.captureByRegx(/^\{\s*else\s*\}/, types.TK_ELSE);
};

pp.readElseIf = function () {
  return this.captureByRegx(/^\{\s*elseif\s*[\S\s]+?\}/, types.TK_ELSE_IF);
};

pp.readEndIf = function () {
  return this.captureByRegx(/^\{\s*\/if\s*\}/, types.TK_END_IF);
};

pp.readEach = function () {
  return this.captureByRegx(/^\{\s*each\s*[\S\s]*?\}/, types.TK_EACH);
};

pp.readEndEach = function () {
  return this.captureByRegx(/^\{\s*\/each\s*\}/, types.TK_END_EACH);
};

pp.readText = function () {
  if (!this.inContext(types.TK_TAG_NAME)) {
    var start = this.index;
    if (!this.char()) return;
    this.index++;
    while (this.char() && !/[\<\{]/.test(this.char())) {
      this.index++;
    }
    return {
      type: types.TK_TEXT,
      label: this.input.slice(start, this.index)
    };
  }
};

pp.readEOF = function () {
  if (this.index >= this.input.length) {
    this.eof = true;
    return {
      type: types.TK_EOF,
      label: '$'
    };
  }
};

/*
 * Helpers Functions
 */

pp.eatSpaces = function () {
  while (/\s/.test(this.char())) {
    this.index++;
  }
};

pp.setContext = function (type) {
  this.context = type;
};

pp.inContext = function (type) {
  return this.context === type;
};

pp.char = function () {
  return this.input[this.index];
};

pp.captureByRegx = function (regx, type) {
  var input = this.input.slice(this.index);
  var capture = input.match(regx);
  if (capture) {
    capture = capture[0];
    this.index += capture.length;
    this.setContext(type);
    return {
      type: type,
      label: capture
    };
  }
};

pp.test = function () {
  while (!this.eof) {
    console.log(this.nextToken());
  }
};

pp.error = function () {
  throw new Error('Unexpected token: \'' + this.char() + '\'');
};

function isUndefined(value) {
  return value === void 666;
}

module.exports = Tokenizer;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports.el = __webpack_require__(11)
exports.diff = __webpack_require__(12)
exports.patch = __webpack_require__(3)


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(0)

/**
 * Virtual-dom Element.
 * @param {String} tagName
 * @param {Object} props - Element's properties,
 *                       - using object to store key-value pair
 * @param {Array<Element|String>} - This element's children elements.
 *                                - Can be Element instance or just a piece plain text.
 */
function Element (tagName, props, children) {
  if (!(this instanceof Element)) {
    return new Element(tagName, props, children)
  }

  if (_.isArray(props)) {
    children = props
    props = {}
  }

  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = props
    ? props.key
    : void 666

  var count = 0

  _.each(this.children, function (child, i) {
    if (child instanceof Element) {
      count += child.count
    } else {
      children[i] = '' + child
    }
    count++
  })

  this.count = count
}

/**
 * Render the hold element tree.
 */
Element.prototype.render = function () {
  var el = document.createElement(this.tagName)
  var props = this.props

  for (var propName in props) {
    var propValue = props[propName]
    _.setAttr(el, propName, propValue)
  }

  _.each(this.children, function (child) {
    var childEl = (child instanceof Element)
      ? child.render()
      : document.createTextNode(child)
    el.appendChild(childEl)
  })

  return el
}

module.exports = Element


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(0)
var patch = __webpack_require__(3)
var listDiff = __webpack_require__(13)

function diff (oldTree, newTree) {
  var index = 0
  var patches = {}
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

function dfsWalk (oldNode, newNode, index, patches) {
  var currentPatch = []

  // Node is removed.
  if (newNode === null) {
    // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
  // TextNode content replacing
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    if (newNode !== oldNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode })
    }
  // Nodes are the same, diff old node's props and children
  } else if (
      oldNode.tagName === newNode.tagName &&
      oldNode.key === newNode.key
    ) {
    // Diff props
    var propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches })
    }
    // Diff children. If the node has a `ignore` property, do not diff children
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )
    }
  // Nodes are not the same, replace the old node with new node
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
  var diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }

  var leftNode = null
  var currentNodeIndex = index
  _.each(oldChildren, function (child, i) {
    var newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches)
    leftNode = child
  })
}

function diffProps (oldNode, newNode) {
  var count = 0
  var oldProps = oldNode.props
  var newProps = newNode.props

  var key, value
  var propsPatches = {}

  // Find out different properties
  for (key in oldProps) {
    value = oldProps[key]
    if (newProps[key] !== value) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  // Find out new property
  for (key in newProps) {
    value = newProps[key]
    if (!oldProps.hasOwnProperty(key)) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  // If properties all are identical
  if (count === 0) {
    return null
  }

  return propsPatches
}

function isIgnoreChildren (node) {
  return (node.props && node.props.hasOwnProperty('ignore'))
}

module.exports = diff


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14).diff


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function diff (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // a simulate list to manipulate
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  var simulateList = children.slice(0)

  // remove items no longer exist
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }

    i++
  }

  function remove (index) {
    var move = {index: index, type: 0}
    moves.push(move)
  }

  function insert (index, item) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item, key) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

exports.makeKeyIndexAndFree = makeKeyIndexAndFree // exports for test
exports.diff = diff


/***/ })
/******/ ]);