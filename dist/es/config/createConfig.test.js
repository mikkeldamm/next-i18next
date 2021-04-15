import fs from 'fs';
import path from 'path';
import { createConfig } from './createConfig';
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn()
}));
describe('createConfig', () => {
  describe('server side', () => {
    beforeAll(() => {
      Object.assign(process, {
        browser: false
      });
      delete global.window;
    });
    describe('when filesystem is as expected', () => {
      beforeAll(() => {
        fs.existsSync.mockReturnValue(true);
        fs.readdirSync.mockReturnValue([]);
      });
      it('throws when lng is not provided', () => {
        expect(createConfig).toThrow('config.lng was not passed into createConfig');
      });
      it('returns a valid config when only lng is provided', () => {
        const config = createConfig({
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
      it('deep merges backend', () => {
        const config = createConfig({
          backend: {
            hello: 'world'
          },
          lng: 'en'
        });
        expect(config.backend.hello).toEqual('world');
        expect(config.backend.loadPath).toEqual(path.join(process.cwd(), '/public/locales/{{lng}}/{{ns}}.json'));
      });
      it('deep merges detection', () => {
        const config = createConfig({
          detection: {
            hello: 'world'
          },
          lng: 'en'
        });
        expect(config.detection.hello).toEqual('world');
      });
      describe('fallbackLng', () => {
        it('automatically sets if it user does not provide', () => {
          const config = createConfig({
            lng: 'en'
          });
          expect(config.fallbackLng).toBe('en');
        });
        it('does not overwrite user provided value', () => {
          const config = createConfig({
            fallbackLng: 'hello-world',
            lng: 'en'
          });
          expect(config.fallbackLng).toBe('hello-world');
        });
        it('does not overwrite user provided boolean', () => {
          const config = createConfig({
            fallbackLng: false,
            lng: 'en'
          });
          expect(config.fallbackLng).toBe(false);
        });
      });
    });
    describe('when filesystem is missing defaultNS', () => {
      it('throws an error', () => {
        fs.existsSync.mockReturnValueOnce(false);
        const config = createConfig.bind(null, {
          lng: 'en'
        });
        expect(config).toThrow('Default namespace not found at public/locales/en/common.json');
      });
    });
    describe('hasCustomBackend', () => {
      it('returns a config without calling any fs methods', () => {
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
    describe('ci mode', () => {
      it('returns a config without calling any fs methods', () => {
        createConfig({
          lng: 'cimode'
        });
        expect(fs.existsSync).toHaveBeenCalledTimes(0);
        expect(fs.readdirSync).toHaveBeenCalledTimes(0);
      });
    });
  });
  describe('client side', () => {
    beforeAll(() => {
      Object.assign(process, {
        browser: true
      });
      global.window = {};
    });
    it('throws when lng is not provided', () => {
      expect(createConfig).toThrow('config.lng was not passed into createConfig');
    });
    it('returns a valid config when only lng is provided', () => {
      const config = createConfig({
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
    it('deep merges backend', () => {
      const config = createConfig({
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