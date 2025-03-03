import _regeneratorRuntime from "@babel/runtime/regenerator";
import _typeof from "@babel/runtime/helpers/typeof";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import fs from 'fs';
import path from 'path';
import { createConfig } from './config/createConfig';
import createClient from './createClient';
var DEFAULT_CONFIG_PATH = './next-i18next.config.js';
export var serverSideTranslations = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(initialLocale) {
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

    return _regeneratorRuntime.wrap(function _callee$(_context) {
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

            if (!fs.existsSync(path.resolve(DEFAULT_CONFIG_PATH))) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return import(path.resolve(DEFAULT_CONFIG_PATH));

          case 8:
            userConfig = _context.sent;

          case 9:
            if (!(userConfig === null)) {
              _context.next = 11;
              break;
            }

            throw new Error('next-i18next was unable to find a user config');

          case 11:
            config = createConfig(_objectSpread(_objectSpread({}, userConfig), {}, {
              lng: initialLocale
            }));
            defaultLocale = config.defaultLocale, localeExtension = config.localeExtension, localePath = config.localePath;
            _createClient = createClient(_objectSpread(_objectSpread({}, config), {}, {
              lng: initialLocale
            })), i18n = _createClient.i18n, initPromise = _createClient.initPromise;
            _context.next = 16;
            return initPromise;

          case 16:
            initialI18nStore = _defineProperty({}, initialLocale, {});

            if (_typeof(config.preload) === 'object' && config.preload.length > 0) {
              config.preload.forEach(function (_preloadLocale) {
                initialI18nStore[_preloadLocale] = {};
              });
            }

            if (typeof config.fallbackLng === 'string') {
              initialI18nStore[config.fallbackLng] = {};
            }

            if (namespacesRequired.length === 0) {
              getAllNamespaces = function getAllNamespaces(path) {
                return fs.readdirSync(path).map(function (file) {
                  return file.replace(".".concat(localeExtension), '');
                });
              };

              namespacesRequired = getAllNamespaces(path.resolve(process.cwd(), "".concat(localePath, "/").concat(defaultLocale)));
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