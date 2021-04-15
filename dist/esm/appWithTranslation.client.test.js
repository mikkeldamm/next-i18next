import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
var __jsx = React.createElement;
import React from 'react';
import fs from 'fs';
import { screen, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { appWithTranslation } from './appWithTranslation';
jest.mock('fs', function () {
  return {
    existsSync: jest.fn(),
    readdirSync: jest.fn()
  };
});

var DummyI18nextProvider = function DummyI18nextProvider(_ref) {
  var children = _ref.children;
  return __jsx(React.Fragment, null, children);
};

jest.mock('react-i18next', function () {
  return {
    I18nextProvider: jest.fn(),
    __esmodule: true
  };
});
var DummyApp = appWithTranslation(function () {
  return __jsx("div", null, "Hello world");
});
var props = {
  pageProps: {
    _nextI18Next: {
      initialLocale: 'en',
      userConfig: {
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'de']
        }
      }
    }
  }
};

var renderComponent = function renderComponent() {
  return render(__jsx(DummyApp, props));
};

describe('appWithTranslation', function () {
  beforeEach(function () {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([]);
    I18nextProvider.mockImplementation(DummyI18nextProvider);
  });
  afterEach(jest.resetAllMocks);
  it('returns children', function () {
    renderComponent();
    expect(screen.getByText('Hello world')).toBeTruthy();
  });
  it('respects configOverride', function () {
    var DummyAppConfigOverride = appWithTranslation(function () {
      return __jsx("div", null, "Hello world");
    }, {
      configOverride: 'custom-value',
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'de']
      }
    });
    var customProps = {
      pageProps: {
        _nextI18Next: {
          initialLocale: 'en'
        }
      }
    };
    render(__jsx(DummyAppConfigOverride, customProps));

    var _mock$calls = _slicedToArray(I18nextProvider.mock.calls, 1),
        args = _mock$calls[0];

    expect(screen.getByText('Hello world')).toBeTruthy();
    expect(args[0].i18n.options.configOverride).toBe('custom-value');
  });
  it('throws an error if userConfig and configOverride are both missing', function () {
    var DummyAppConfigOverride = appWithTranslation(function () {
      return __jsx("div", null, "Hello world");
    });
    var customProps = {
      pageProps: {
        _nextI18Next: {
          initialLocale: 'en',
          userConfig: null
        }
      }
    };
    expect(function () {
      return render(__jsx(DummyAppConfigOverride, customProps));
    }).toThrow('appWithTranslation was called without a next-i18next config');
  });
  it('returns an I18nextProvider', function () {
    renderComponent();
    expect(I18nextProvider).toHaveBeenCalledTimes(1);

    var _mock$calls2 = _slicedToArray(I18nextProvider.mock.calls, 1),
        args = _mock$calls2[0];

    expect(I18nextProvider).toHaveBeenCalledTimes(1);
    expect(args).toHaveLength(2);
    expect(args[0].children).toBeTruthy();
    expect(args[0].i18n.addResource).toBeTruthy();
    expect(args[0].i18n.language).toEqual('en');
    expect(args[0].i18n.isInitialized).toEqual(true);
    expect(fs.existsSync).toHaveBeenCalledTimes(0);
    expect(fs.readdirSync).toHaveBeenCalledTimes(0);
  });
});