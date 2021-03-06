'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = handleAction;

var _constants = require('../constants');

var _updateState = require('./updateState');

var _updateState2 = _interopRequireDefault(_updateState);

var _handleMiddleware = require('./handleMiddleware');

var _handleMiddleware2 = _interopRequireDefault(_handleMiddleware);

var _handleGenerator = require('./handleGenerator');

var _handleGenerator2 = _interopRequireDefault(_handleGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleAction(machine, action) {
  var state = machine.state,
      transitions = machine.transitions;


  if (!transitions[state.name]) return false;

  var handler = transitions[state.name][action];

  if (typeof handler === 'undefined') return false;

  for (var _len = arguments.length, payload = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    payload[_key - 2] = arguments[_key];
  }

  _handleMiddleware2.default.apply(undefined, [_constants.MIDDLEWARE_PROCESS_ACTION, machine, action].concat(payload));

  // string as a handler
  if (typeof handler === 'string') {
    (0, _updateState2.default)(machine, _extends({}, state, { name: transitions[state.name][action] }));

    // object as a handler
  } else if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
    (0, _updateState2.default)(machine, handler);

    // function as a handler
  } else if (typeof handler === 'function') {
    var response = transitions[state.name][action].apply(machine, [machine.state].concat(payload));

    // generator
    if (response && typeof response.next === 'function') {
      var generator = response;

      return (0, _handleGenerator2.default)(machine, generator, function (response) {
        (0, _updateState2.default)(machine, response);
      });
    } else {
      (0, _updateState2.default)(machine, response);
    }

    // wrong type of handler
  } else {
    throw new Error(_constants.ERROR_NOT_SUPPORTED_HANDLER_TYPE);
  }

  _handleMiddleware2.default.apply(undefined, [_constants.MIDDLEWARE_ACTION_PROCESSED, machine, action].concat(payload));
};
module.exports = exports['default'];