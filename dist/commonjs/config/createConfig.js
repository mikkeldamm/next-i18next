"use strict";

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

require("core-js/modules/es.object.define-properties.js");

require("core-js/modules/es.object.define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = void 0;

require("core-js/modules/es.array.some.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.array.for-each.js");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defaultConfig = require("./defaultConfig");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var deepMergeObjects = ['backend', 'detection'];

var createConfig = function createConfig(userConfig) {
  if (typeof (userConfig === null || userConfig === void 0 ? void 0 : userConfig.lng) !== 'string') {
    throw new Error('config.lng was not passed into createConfig');
  } //
  // Initial merge of default and user-provided config
  //


  var userI18n = userConfig.i18n,
      userConfigStripped = (0, _objectWithoutProperties2["default"])(userConfig, ["i18n"]);
  var defaultI18n = _defaultConfig.defaultConfig.i18n,
      defaultConfigStripped = (0, _objectWithoutProperties2["default"])(_defaultConfig.defaultConfig, ["i18n"]);

  var combinedConfig = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultConfigStripped), userConfigStripped), defaultI18n), userI18n);

  var defaultNS = combinedConfig.defaultNS,
      lng = combinedConfig.lng,
      locales = combinedConfig.locales,
      localeExtension = combinedConfig.localeExtension,
      localePath = combinedConfig.localePath,
      localeStructure = combinedConfig.localeStructure;
  /**
   * Skips translation file resolution while in cimode
   * https://github.com/isaachinman/next-i18next/pull/851#discussion_r503113620
  */

  if (lng === 'cimode') {
    return combinedConfig;
  }

  if (typeof combinedConfig.fallbackLng === 'undefined') {
    combinedConfig.fallbackLng = combinedConfig.defaultLocale;
  }

  if (!process.browser && typeof window === 'undefined') {
    var _userConfig$use;

    combinedConfig.preload = locales;
    var hasCustomBackend = userConfig === null || userConfig === void 0 ? void 0 : (_userConfig$use = userConfig.use) === null || _userConfig$use === void 0 ? void 0 : _userConfig$use.some(function (b) {
      return b.type === 'backend';
    });

    if (!hasCustomBackend) {
      var fs = require('fs');

      var path = require('path');

      var serverLocalePath = localePath; //
      // Validate defaultNS
      // https://github.com/isaachinman/next-i18next/issues/358
      //

      if (typeof defaultNS === 'string' && typeof lng !== 'undefined') {
        var defaultLocaleStructure = localeStructure.replace('{{lng}}', lng).replace('{{ns}}', defaultNS);
        var defaultFile = "/".concat(defaultLocaleStructure, ".").concat(localeExtension);
        var defaultNSPath = path.join(localePath, defaultFile);
        var defaultNSExists = fs.existsSync(defaultNSPath);

        if (!defaultNSExists && process.env.NODE_ENV !== 'production') {
          throw new Error("Default namespace not found at ".concat(defaultNSPath));
        }
      } //
      // Set server side backend
      //


      combinedConfig.backend = {
        addPath: path.resolve(process.cwd(), "".concat(serverLocalePath, "/").concat(localeStructure, ".missing.").concat(localeExtension)),
        loadPath: path.resolve(process.cwd(), "".concat(serverLocalePath, "/").concat(localeStructure, ".").concat(localeExtension))
      }; //
      // Set server side preload (namespaces)
      //

      if (!combinedConfig.ns) {
        var getAllNamespaces = function getAllNamespaces(p) {
          return fs.readdirSync(p).map(function (file) {
            return file.replace(".".concat(localeExtension), '');
          });
        };

        combinedConfig.ns = getAllNamespaces(path.resolve(process.cwd(), "".concat(serverLocalePath, "/").concat(lng)));
      }
    }
  } else {
    var clientLocalePath = localePath; //
    // Remove public prefix from client site config
    //

    if (localePath.match(/^\.?\/public\//)) {
      clientLocalePath = localePath.replace(/^\.?\/public/, '');
    } //
    // Set client side backend
    //


    combinedConfig.backend = {
      addPath: "".concat(clientLocalePath, "/").concat(localeStructure, ".missing.").concat(localeExtension),
      loadPath: "".concat(clientLocalePath, "/").concat(localeStructure, ".").concat(localeExtension)
    };
    combinedConfig.ns = [defaultNS];
  } //
  // Deep merge with overwrite - goes last
  //


  deepMergeObjects.forEach(function (obj) {
    if (userConfig[obj]) {
      combinedConfig[obj] = _objectSpread(_objectSpread({}, combinedConfig[obj]), userConfig[obj]);
    }
  });
  return combinedConfig;
};

exports.createConfig = createConfig;