import fs from 'fs';
import path from 'path';
import { createConfig } from './createConfig';
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
        fs.existsSync.mockReturnValue(true);
        fs.readdirSync.mockReturnValue([]);
      });
      it('throws when lng is not provided', function () {
        expect(createConfig).toThrow('config.lng was not passed into createConfig');
      });
      it('returns a valid config when only lng is provided', function () {
        var config = createConfig({
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
        expect(fs.existsSync).toHaveBeenCalledTimes(1);
        expect(fs.readdirSync).toHaveBeenCalledTimes(1);
      });
      it('deep merges backend', function () {
        var config = createConfig({
          backend: {
            hello: 'world'
          },
          lng: 'en'
        });
        expect(config.backend.hello).toEqual('world');
        expect(config.backend.loadPath).toEqual(path.join(process.cwd(), '/public/locales/{{lng}}/{{ns}}.json'));
      });
      it('deep merges detection', function () {
        var config = createConfig({
          detection: {
            hello: 'world'
          },
          lng: 'en'
        });
        expect(config.detection.hello).toEqual('world');
      });
      describe('fallbackLng', function () {
        it('automatically sets if it user does not provide', function () {
          var config = createConfig({
            lng: 'en'
          });
          expect(config.fallbackLng).toBe('en');
        });
        it('does not overwrite user provided value', function () {
          var config = createConfig({
            fallbackLng: 'hello-world',
            lng: 'en'
          });
          expect(config.fallbackLng).toBe('hello-world');
        });
        it('does not overwrite user provided boolean', function () {
          var config = createConfig({
            fallbackLng: false,
            lng: 'en'
          });
          expect(config.fallbackLng).toBe(false);
        });
      });
    });
    describe('when filesystem is missing defaultNS', function () {
      it('throws an error', function () {
        fs.existsSync.mockReturnValueOnce(false);
        var config = createConfig.bind(null, {
          lng: 'en'
        });
        expect(config).toThrow('Default namespace not found at public/locales/en/common.json');
      });
    });
    describe('hasCustomBackend', function () {
      it('returns a config without calling any fs methods', function () {
        fs.existsSync.mockReset();
        fs.readdirSync.mockReset();
        createConfig({
          lng: 'en',
          use: [{
            type: 'backend'
          }]
        });
        expect(fs.existsSync).toHaveBeenCalledTimes(0);
        expect(fs.readdirSync).toHaveBeenCalledTimes(0);
      });
    });
    describe('ci mode', function () {
      it('returns a config without calling any fs methods', function () {
        createConfig({
          lng: 'cimode'
        });
        expect(fs.existsSync).toHaveBeenCalledTimes(0);
        expect(fs.readdirSync).toHaveBeenCalledTimes(0);
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
      expect(createConfig).toThrow('config.lng was not passed into createConfig');
    });
    it('returns a valid config when only lng is provided', function () {
      var config = createConfig({
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
      var config = createConfig({
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