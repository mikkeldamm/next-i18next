"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.function.bind.js");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _createConfig = require("./createConfig");

jest.mock('fs', function () {
  return {
    existsSync: jest.fn(),
    readdirSync: jest.fn()
  };
});
describe('createConfig', function () {
  describe('server side', function () {
    beforeAll(function () {
      Object.assign(process, {
        browser: false
      });
      delete global.window;
    });
    describe('when filesystem is as expected', function () {
      beforeAll(function () {
        _fs["default"].existsSync.mockReturnValue(true);

        _fs["default"].readdirSync.mockReturnValue([]);
      });
      it('throws when lng is not provided', function () {
        expect(_createConfig.createConfig).toThrow('config.lng was not passed into createConfig');
      });
      it('returns a valid config when only lng is provided', function () {
        var config = (0, _createConfig.createConfig)({
          lng: 'en'
        });
        expect(config.backend.addPath).toMatch('/public/locales/{{lng}}/{{ns}}.missing.json');
        expect(config.backend.loadPath).toMatch('/public/locales/{{lng}}/{{ns}}.json');
        expect(config.defaultLocale).toEqual('en');
        expect(config.defaultNS).toEqual('common');
        expect(config.errorStackTraceLimit).toEqual(0);
        expect(config.lng).toEqual('en');
        expect(config.load).toEqual('currentOnly');
        expect(config.localeExtension).toEqual('json');
        expect(config.localePath).toEqual('./public/locales');
        expect(config.localeStructure).toEqual('{{lng}}/{{ns}}');
        expect(config.locales).toEqual(['en']);
        expect(config.ns).toEqual([]);
        expect(config.preload).toEqual(['en']);
        expect(config.strictMode).toEqual(true);
        expect(config.use).toEqual([]);
        expect(_fs["default"].existsSync).toHaveBeenCalledTimes(1);
        expect(_fs["default"].readdirSync).toHaveBeenCalledTimes(1);
      });
      it('deep merges backend', function () {
        var config = (0, _createConfig.createConfig)({
          backend: {
            hello: 'world'
          },
          lng: 'en'
        });
        expect(config.backend.hello).toEqual('world');
        expect(config.backend.loadPath).toEqual(_path["default"].join(process.cwd(), '/public/locales/{{lng}}/{{ns}}.json'));
      });
      it('deep merges detection', function () {
        var config = (0, _createConfig.createConfig)({
          detection: {
            hello: 'world'
          },
          lng: 'en'
        });
        expect(config.detection.hello).toEqual('world');
      });
      describe('fallbackLng', function () {
        it('automatically sets if it user does not provide', function () {
          var config = (0, _createConfig.createConfig)({
            lng: 'en'
          });
          expect(config.fallbackLng).toBe('en');
        });
        it('does not overwrite user provided value', function () {
          var config = (0, _createConfig.createConfig)({
            fallbackLng: 'hello-world',
            lng: 'en'
          });
          expect(config.fallbackLng).toBe('hello-world');
        });
        it('does not overwrite user provided boolean', function () {
          var config = (0, _createConfig.createConfig)({
            fallbackLng: false,
            lng: 'en'
          });
          expect(config.fallbackLng).toBe(false);
        });
      });
    });
    describe('when filesystem is missing defaultNS', function () {
      it('throws an error', function () {
        _fs["default"].existsSync.mockReturnValueOnce(false);

        var config = _createConfig.createConfig.bind(null, {
          lng: 'en'
        });

        expect(config).toThrow('Default namespace not found at public/locales/en/common.json');
      });
    });
    describe('hasCustomBackend', function () {
      it('returns a config without calling any fs methods', function () {
        _fs["default"].existsSync.mockReset();

        _fs["default"].readdirSync.mockReset();

        (0, _createConfig.createConfig)({
          lng: 'en',
          use: [{
            type: 'backend'
          }]
        });
        expect(_fs["default"].existsSync).toHaveBeenCalledTimes(0);
        expect(_fs["default"].readdirSync).toHaveBeenCalledTimes(0);
      });
    });
    describe('ci mode', function () {
      it('returns a config without calling any fs methods', function () {
        (0, _createConfig.createConfig)({
          lng: 'cimode'
        });
        expect(_fs["default"].existsSync).toHaveBeenCalledTimes(0);
        expect(_fs["default"].readdirSync).toHaveBeenCalledTimes(0);
      });
    });
  });
  describe('client side', function () {
    beforeAll(function () {
      Object.assign(process, {
        browser: true
      });
      global.window = {};
    });
    it('throws when lng is not provided', function () {
      expect(_createConfig.createConfig).toThrow('config.lng was not passed into createConfig');
    });
    it('returns a valid config when only lng is provided', function () {
      var config = (0, _createConfig.createConfig)({
        lng: 'en'
      });
      expect(config.backend.addPath).toMatch('/locales/{{lng}}/{{ns}}.missing.json');
      expect(config.backend.loadPath).toMatch('/locales/{{lng}}/{{ns}}.json');
      expect(config.defaultLocale).toEqual('en');
      expect(config.defaultNS).toEqual('common');
      expect(config.errorStackTraceLimit).toEqual(0);
      expect(config.lng).toEqual('en');
      expect(config.load).toEqual('currentOnly');
      expect(config.localeExtension).toEqual('json');
      expect(config.localePath).toEqual('./public/locales');
      expect(config.localeStructure).toEqual('{{lng}}/{{ns}}');
      expect(config.locales).toEqual(['en']);
      expect(config.ns).toEqual(['common']);
      expect(config.preload).toBeUndefined();
      expect(config.strictMode).toEqual(true);
      expect(config.use).toEqual([]);
    });
    it('deep merges backend', function () {
      var config = (0, _createConfig.createConfig)({
        backend: {
          hello: 'world'
        },
        lng: 'en'
      });
      expect(config.backend.hello).toEqual('world');
      expect(config.backend.loadPath).toMatch('/locales/{{lng}}/{{ns}}.json');
    });
  });
});