"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.object.values.js");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _serverSideTranslations = require("./serverSideTranslations");

jest.mock('fs', function () {
  return {
    existsSync: jest.fn(),
    readdirSync: jest.fn()
  };
});
describe('serverSideTranslations', function () {
  beforeEach(function () {
    _fs["default"].existsSync.mockReturnValueOnce(false);

    _fs["default"].existsSync.mockReturnValueOnce(true);

    _fs["default"].readdirSync.mockReturnValue([]);
  });
  afterEach(jest.resetAllMocks);
  it('throws if initialLocale is not passed', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return expect((0, _serverSideTranslations.serverSideTranslations)(undefined)).rejects.toThrow('Initial locale argument was not passed into serverSideTranslations');

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('returns all namespaces if namespacesRequired is not provided', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var props;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _fs["default"].readdirSync.mockReturnValue(['one', 'two', 'three']);

            _context2.next = 3;
            return (0, _serverSideTranslations.serverSideTranslations)('en-US', undefined, {
              i18n: {
                defaultLocale: 'en-US',
                locales: ['en-US', 'fr-CA']
              }
            });

          case 3:
            props = _context2.sent;
            expect(_fs["default"].readdirSync).toHaveBeenCalledTimes(1);
            expect(_fs["default"].readdirSync).toHaveBeenCalledWith(expect.stringMatching('/public/locales/en-US'));
            expect(Object.values(props._nextI18Next.initialI18nStore)).toEqual([{
              one: {},
              three: {},
              two: {}
            }]);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('returns props', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var props;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _serverSideTranslations.serverSideTranslations)('en-US', [], {
              i18n: {
                defaultLocale: 'en-US',
                locales: ['en-US', 'fr-CA']
              }
            });

          case 2:
            props = _context3.sent;
            expect(props).toEqual({
              _nextI18Next: {
                initialI18nStore: {
                  'en-US': {}
                },
                initialLocale: 'en-US',
                userConfig: {
                  i18n: {
                    defaultLocale: 'en-US',
                    locales: ['en-US', 'fr-CA']
                  }
                }
              }
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
});