"use strict";

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

require("core-js/modules/es.object.define-properties.js");

require("core-js/modules/es.object.define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverSideTranslations = void 0;

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.concat.js");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _createConfig = require("./config/createConfig");

var _createClient2 = _interopRequireDefault(require("./createClient"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_CONFIG_PATH = './next-i18next.config.js';

var serverSideTranslations = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(initialLocale) {
    var namespacesRequired,
        configOverride,
        userConfig,
        config,
        defaultLocale,
        localeExtension,
        localePath,
        _createClient,
        i18n,
        initPromise,
        initialI18nStore,
        getAllNamespaces,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            namespacesRequired = _args.length > 1 && _args[1] !== undefined ? _args[1] : [];
            configOverride = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;

            if (!(typeof initialLocale !== 'string')) {
              _context.next = 4;
              break;
            }

            throw new Error('Initial locale argument was not passed into serverSideTranslations');

          case 4:
            userConfig = configOverride;

            if (!_fs["default"].existsSync(_path["default"].resolve(DEFAULT_CONFIG_PATH))) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return Promise.resolve("".concat(_path["default"].resolve(DEFAULT_CONFIG_PATH))).then(function (s) {
              return (0, _interopRequireWildcard2["default"])(require(s));
            });

          case 8:
            userConfig = _context.sent;

          case 9:
            if (!(userConfig === null)) {
              _context.next = 11;
              break;
            }

            throw new Error('next-i18next was unable to find a user config');

          case 11:
            config = (0, _createConfig.createConfig)(_objectSpread(_objectSpread({}, userConfig), {}, {
              lng: initialLocale
            }));
            defaultLocale = config.defaultLocale, localeExtension = config.localeExtension, localePath = config.localePath;
            _createClient = (0, _createClient2["default"])(_objectSpread(_objectSpread({}, config), {}, {
              lng: initialLocale
            })), i18n = _createClient.i18n, initPromise = _createClient.initPromise;
            _context.next = 16;
            return initPromise;

          case 16:
            initialI18nStore = (0, _defineProperty2["default"])({}, initialLocale, {});

            if ((0, _typeof2["default"])(config.preload) === 'object' && config.preload.length > 0) {
              config.preload.forEach(function (_preloadLocale) {
                initialI18nStore[_preloadLocale] = {};
              });
            }

            if (typeof config.fallbackLng === 'string') {
              initialI18nStore[config.fallbackLng] = {};
            }

            if (namespacesRequired.length === 0) {
              getAllNamespaces = function getAllNamespaces(path) {
                return _fs["default"].readdirSync(path).map(function (file) {
                  return file.replace(".".concat(localeExtension), '');
                });
              };

              namespacesRequired = getAllNamespaces(_path["default"].resolve(process.cwd(), "".concat(localePath, "/").concat(defaultLocale)));
            }

            namespacesRequired.forEach(function (ns) {
              for (var locale in initialI18nStore) {
                initialI18nStore[locale][ns] = (i18n.services.resourceStore.data[locale] || {})[ns] || {};
              }
            });
            return _context.abrupt("return", {
              _nextI18Next: {
                initialI18nStore: initialI18nStore,
                initialLocale: initialLocale,
                userConfig: config.serializeConfig ? userConfig : null
              }
            });

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function serverSideTranslations(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.serverSideTranslations = serverSideTranslations;